"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, MoreHorizontal, Clock, Package, Truck, ThumbsUp, MapPin, Phone, Database, Filter, Search, ArrowLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Order } from '@/types/medicine';
import { cn } from '@/lib/utils';
import { useOrderStore } from '@/hooks/useOrderStore';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
    'Pending': { icon: Clock, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
    'Processing': { icon: Package, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    'Shipped': { icon: Truck, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    'Delivered': { icon: ThumbsUp, color: 'bg-green-500/10 text-green-500 border-green-500/20' },
    'Cancelled': { icon: Clock, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

export default function OrderManagementPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-7xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Logistics Monitor</Badge>
            <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                Order <span className="text-primary italic">Lifecycle</span>
            </h1>
            <p className="text-muted-foreground mt-4 font-medium max-w-sm">Global visibility into pharmaceutical demand and fulfilment stages.</p>
        </motion.div>
        <Link href="/admin/dashboard" passHref>
            <Button variant="ghost" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tighter hover:bg-primary/5 group transition-all">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Return to Command
            </Button>
        </Link>
      </div>

      <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-background shadow-2xl overflow-hidden">
        <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                Live Order Mesh <span className="text-muted-foreground opacity-50 font-mono text-sm">[{orders.length}]</span>
            </CardTitle>
            <div className="flex gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input className="bg-muted/50 border-0 rounded-xl h-10 pl-10 pr-4 text-xs font-bold w-64 focus:ring-2 ring-primary/20 outline-none" placeholder="Search orders..." />
                </div>
                <Button variant="outline" size="sm" className="h-10 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest px-4">
                    <Filter className="h-3.5 w-3.5 mr-2" /> Filter
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted/10 h-14">
                <TableRow className="hover:bg-transparent border-b border-primary/5">
                    <TableHead className="pl-8 font-black uppercase tracking-widest text-[10px]">Reference</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Personnel</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Supply Vector</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Chronosome</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Payload</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Market Val</TableHead>
                    <TableHead className="font-black uppercase tracking-widest text-[10px]">Status</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px]">Override</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                <AnimatePresence mode="popLayout">
                {orders.map((order) => {
                    const config = statusConfig[order.status];
                    const Icon = config.icon;
                    return (
                    <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group border-b border-primary/5 hover:bg-primary/5 transition-colors"
                    >
                        <TableCell className="pl-8 py-8 font-mono text-[10px] font-black group-hover:text-primary transition-colors">#{order.id.split('-')[1].toUpperCase()}</TableCell>
                        <TableCell className="font-black uppercase tracking-tight text-sm">{order.customerName}</TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1.5 max-w-[200px]">
                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-60">
                                    <MapPin className="h-3 w-3 shrink-0"/>
                                    <span className="truncate">{order.shippingAddress}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold opacity-40">
                                    <Phone className="h-3 w-3 shrink-0"/>
                                    <span>{order.mobileNumber}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold opacity-60">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-0 rounded-lg font-black text-[9px] px-2 py-0.5">
                                {order.items.length} BATCHES
                            </Badge>
                        </TableCell>
                        <TableCell className="font-black text-lg tracking-tighter whitespace-nowrap">₹{order.total.toFixed(0)}<span className="text-xs opacity-40">.{order.total.toFixed(2).split('.')[1]}</span></TableCell>
                        <TableCell>
                        <Badge variant="outline" className={cn("font-black uppercase tracking-widest text-[9px] px-3 py-1 rounded-xl shadow-sm transition-all border-2", config.color)}>
                            <Icon className="h-3 w-3 mr-2" />
                            {order.status}
                        </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-white/10 group-hover:bg-primary/10 transition-all">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="p-2 rounded-2xl bg-background border-2 border-primary/5 shadow-2xl min-w-[200px]">
                                <div className="px-3 py-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 border-b border-primary/5">State Transition</div>
                                {Object.keys(statusConfig).map((status) => (
                                    <DropdownMenuItem 
                                        key={status} 
                                        onClick={() => updateOrderStatus(order.id, status as Order['status'])}
                                        className="rounded-xl font-bold py-3 hover:bg-primary/5 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-2 w-2 rounded-full", statusConfig[status as keyof typeof statusConfig].color.split(' ')[1])} />
                                            {status}
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        </TableCell>
                    </motion.tr>
                    );
                })}
                </AnimatePresence>
                </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex items-center justify-center gap-4 py-8 opacity-20 group">
          <Database className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Synchronized with Multi-Hub Logistics Ledger v2.1</span>
      </div>
    </div>
  );
}
