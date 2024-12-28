'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/components/providers/user-provider';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface GameAccount {
  id: string;
  user_id: string;
  username: string;
  server: string;
  created_at: string;
  status: string;
}

export default function AccountListingPage() {
  const { user } = useUser();
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: '',
    server: '',
  });

  // 获取账号列表
  const fetchAccounts = async () => {
    try {
      const response = await fetch(`/api/v1/account/user/${user?.id}`, {
        credentials: 'include',
      });
      const data = await response.json();
      if (data.succeed) {
        setAccounts(data.data || []);
      } else {
        toast.error('获取账号列表失败');
      }
    } catch (error) {
      console.error('Fetch accounts error:', error);
      toast.error('获取账号列表失败');
    }
  };

  // 添加账号
  const handleAddAccount = async () => {
    try {
      const response = await fetch('/api/v1/account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: newAccount.username,
          server: newAccount.server,
        }),
      });

      const data = await response.json();
      if (data.succeed) {
        toast.success('添加账号成功');
        setIsAddDialogOpen(false);
        setNewAccount({ username: '', server: '' });
        fetchAccounts();
      } else {
        toast.error(data.message || '添加账号失败');
      }
    } catch (error) {
      console.error('Add account error:', error);
      toast.error('添加账号失败');
    }
  };

  // 删除账号
  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('确定要删除这个账号吗？')) return;

    try {
      const response = await fetch('/api/v1/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id: accountId }),
      });

      const data = await response.json();
      if (data.succeed) {
        toast.success('删除账号成功');
        fetchAccounts();
      } else {
        toast.error(data.message || '删除账号失败');
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('删除账号失败');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAccounts();
    }
  }, [user?.id]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">游戏账号管理</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              添加账号
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>添加游戏账号</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username">账号</Label>
                <Input
                  id="username"
                  value={newAccount.username}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="server">服务器</Label>
                <Input
                  id="server"
                  value={newAccount.server}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, server: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddAccount}>添加</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>账号</TableHead>
              <TableHead>服务器</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.server}</TableCell>
                <TableCell>{account.status}</TableCell>
                <TableCell>
                  {new Date(account.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAccount(account.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}