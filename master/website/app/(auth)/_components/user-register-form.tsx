'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const API_BASE_URL = "/api/v1";

// 表单验证模式
const formSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username must not exceed 20 characters' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
  captcha: z.string()
    .min(1, { message: 'Captcha is required' })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValue = z.infer<typeof formSchema>;

interface CaptchaData {
  captchaId: string;
  captchaImg: string;
}

export default function UserRegisterForm() {
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const router = useRouter();

  const form = useForm<RegisterFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      captcha: '',
    },
  });

  const getCaptcha = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/captcha`, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to fetch captcha');
      
      const data = await response.json();
      console.log('Captcha response:', data);
      
      if (data.succeed && data.captcha_id) {
        const captchaImgUrl = `${API_BASE_URL}/captcha/${data.captcha_id}`;
        
        setCaptcha({
          captchaId: data.captcha_id,
          captchaImg: captchaImgUrl
        });
      }
    } catch (error) {
      console.error('Captcha error:', error);
      toast.error('Failed to load captcha');
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  const onSubmit = async (data: RegisterFormValue) => {
    try {
      if (!captcha?.captchaId) {
        console.log('No captcha ID found');
        throw new Error('Captcha not loaded');
      }

      console.log('Sending register request with:', {
        username: data.username,
        captchaId: captcha.captchaId,
        userInput: data.captcha
      });

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'captchaId': captcha.captchaId,
          'userInput': data.captcha
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Full response data:', result);

      if (!response.ok) {
        const errorMessage = result.error || result.message || result.msg || 'Unknown error';
        console.log('Error message:', errorMessage);

        if (errorMessage.includes('Duplicate entry') || 
            errorMessage.includes('1062') || 
            errorMessage.includes('already exists')) {
          toast.error('Registration failed: Username already exists');
        } else if (errorMessage.includes('captcha')) {
          toast.error('Registration failed: Invalid captcha');
        } else {
          toast.error('Registration failed: Please try again');
        }
        getCaptcha();
        return;
      }

      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed: Please try again');
      getCaptcha();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Confirm your password..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="captcha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Captcha</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Enter captcha..." {...field} />
                </FormControl>
                <div className="relative h-10 w-24 bg-white rounded-md overflow-hidden">
                  {captcha?.captchaImg && (
                    <img
                      src={`${captcha.captchaImg}`}
                      alt="captcha"
                      className="h-full w-full cursor-pointer object-contain bg-white"
                      onClick={() => getCaptcha()}
                    />
                  )}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Form>
  );
}
