import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    console.log('No session user');
    return redirect('/');
  } else {
    console.log('Session user:', session.user);
    redirect('/dashboard/overview');
  }
}
