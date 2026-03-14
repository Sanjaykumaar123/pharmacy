
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, MoreHorizontal, Users, Loader2, Factory, ShieldCheck, User } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import type { Role } from '@/lib/firebase/auth';
import { cn } from '@/lib/utils';
import { getUsers, updateUserRole, type AppUser } from '@/lib/firebase/users';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const roleConfig: Record<Role, { icon: React.ElementType; color: string; border: string; dotColor: string; label: string }> = {
  customer: { icon: User, color: 'text-blue-500', border: 'border-blue-500/20 bg-blue-500/10', dotColor: 'bg-blue-500', label: 'Customer' },
  manufacturer: { icon: Factory, color: 'text-purple-500', border: 'border-purple-500/20 bg-purple-500/10', dotColor: 'bg-purple-500', label: 'Manufacturer' },
  admin: { icon: ShieldCheck, color: 'text-red-500', border: 'border-red-500/20 bg-red-500/10', dotColor: 'bg-red-500', label: 'Admin' },
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const item = {
  hidden: { y: 12, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const userList = await getUsers();
        setUsers(userList);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to load users',
          description: 'There was a problem fetching the user list. Please try again later.',
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [toast]);

  const handleRoleChange = async (uid: string, newRole: Role) => {
    try {
      await updateUserRole(uid, newRole);
      setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role: newRole } : u)));
      toast({ title: 'Role Updated', description: `User role changed to ${newRole}.` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to update role', description: 'Please try again.' });
      console.error(error);
    }
  };

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10 max-w-7xl space-y-10">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">
              Identity Registry
            </Badge>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">{users.length} Active Nodes</span>
            </div>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
            User <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-medium max-w-lg">
            View and manage all registered identities, roles, and system permissions.
          </p>
        </motion.div>
        <Link href="/admin/dashboard" passHref>
          <Button variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase tracking-tighter border-2 hover:bg-primary/5 group transition-all">
            <Home className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
            Admin Dashboard
          </Button>
        </Link>
      </div>

      {/* ROLE STAT PILLS */}
      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-4">
        {(Object.keys(roleConfig) as Role[]).map((role) => {
          const cfg = roleConfig[role];
          return (
            <motion.div key={role} variants={item}>
              <div className={cn('flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-black text-[11px] uppercase tracking-widest', cfg.border, cfg.color)}>
                <cfg.icon className="h-3.5 w-3.5" />
                {cfg.label}
                <span className="ml-1 px-1.5 py-0.5 rounded-md bg-black/10 text-[10px]">{roleCounts[role] || 0}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* USERS TABLE */}
      <Card className="border-2 border-primary/5 bg-background/50 backdrop-blur-xl rounded-3xl overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-primary/5">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-black uppercase tracking-widest">All System Users</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase tracking-widest font-bold">
            Complete registry of all users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="relative">
                <div className="h-14 w-14 rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fetching user registry...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No users found in registry</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-primary/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground p-5">Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Joined</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right pr-5">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const cfg = roleConfig[user.role] || roleConfig.customer;
                  const Icon = cfg.icon;
                  return (
                    <TableRow key={user.uid} className="border-primary/5 hover:bg-primary/2 transition-colors">
                      <TableCell className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={cn('h-9 w-9 rounded-2xl border-2 flex items-center justify-center shrink-0', cfg.border)}>
                            <Icon className={cn('h-4 w-4', cfg.color)} />
                          </div>
                          <div>
                            <p className="font-black text-sm tracking-tight">
                              {user.firstName || 'Unknown'} {user.lastName || ''}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{user.uid.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{user.email || 'No email'}</TableCell>
                      <TableCell>
                        <Badge className={cn('border font-black text-[10px] uppercase tracking-widest rounded-xl px-2 py-0.5', cfg.border, cfg.color)}>
                          <div className={cn('h-1.5 w-1.5 rounded-full mr-1.5', cfg.dotColor)} />
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-medium">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right pr-5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-primary/10">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl border-primary/10">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Change Role</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {(Object.keys(roleConfig) as Role[]).map((role) => (
                              <DropdownMenuItem
                                key={role}
                                disabled={user.role === role}
                                onClick={() => handleRoleChange(user.uid, role)}
                                className="font-bold text-sm rounded-xl"
                              >
                                <roleConfig[role].icon className={cn('mr-2 h-4 w-4', roleConfig[role].color)} />
                                {roleConfig[role].label}
                                {user.role === role && <span className="ml-auto text-[10px] text-muted-foreground">Current</span>}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
