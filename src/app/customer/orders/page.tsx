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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, Clock, Package, Truck, ThumbsUp, MapPin, XCircle, Box, ArrowLeft } from 'lucide-react';
import type { OrderStatus } from '@/types/medicine';
import { useOrderStore } from '@/hooks/useOrderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; progress: number; desc: string }> = {
    'Pending': { icon: Clock, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', progress: 10, desc: 'Order received and awaiting verification' },
    'Processing': { icon: Package, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20', progress: 40, desc: 'Cryptographic checks and packaging in progress' },
    'Shipped': { icon: Truck, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', progress: 70, desc: 'Handed over to logistics carrier' },
    'Delivered': { icon: ThumbsUp, color: 'bg-green-500/10 text-green-500 border-green-500/20', progress: 100, desc: 'Successfully delivered to target coordinates' },
    'Cancelled': { icon: XCircle, color: 'bg-red-500/10 text-red-500 border-red-500/20', progress: 0, desc: 'Order execution terminated' },
}

export default function CustomerOrdersTrackingPage() {
  const { orders } = useOrderStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // Determine active orders (not delivered, not cancelled) vs history
  const activeOrders = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
  const pastOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-5xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Supply Monitor</Badge>
            <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                Active <span className="text-primary italic">Shipments</span>
            </h1>
            <p className="text-muted-foreground mt-4 font-medium max-w-sm">Track your verified medical supply deliveries in real-time.</p>
        </motion.div>
        <Link href="/customer/dashboard" passHref>
            <Button variant="ghost" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tighter hover:bg-primary/5 group transition-all">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Return to Hub
            </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
          <Card className="border-2 border-dashed border-primary/20 bg-background/50 rounded-[2.5rem] py-20 flex flex-col items-center justify-center text-center">
              <Box className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
              <CardTitle className="text-xl font-black uppercase tracking-widest text-muted-foreground">No Shipments Found</CardTitle>
              <CardDescription className="max-w-xs mt-2 font-medium">You have not initiated any medicine acquisitions on this node.</CardDescription>
              <Link href="/medicines" className="mt-6">
                <Button className="rounded-xl font-black uppercase tracking-widest text-[10px] h-12 shadow-xl hover:scale-105 transition-all">Launch Digital Pharmacy</Button>
              </Link>
          </Card>
      ) : (
        <div className="space-y-12">
            {/* IN PROGRESS SHIPMENTS */}
            {activeOrders.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        In-Transit Nodes
                    </h3>
                    <AnimatePresence>
                        {activeOrders.map((order) => {
                            const statusData = statusConfig[order.status];
                            const StatusIcon = statusData.icon;
                            
                            return (
                                <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                                    <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-background shadow-2xl overflow-hidden relative group">
                                        <div className="absolute top-0 left-0 w-2 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:items-center justify-between pl-10 sm:pl-12">
                                            
                                            {/* LEFT: Info */}
                                            <div className="space-y-4 max-w-sm">
                                                <div>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(order.orderDate).toLocaleDateString()}</p>
                                                    <h4 className="text-xl font-black tracking-tight uppercase leading-none mt-1">{order.id}</h4>
                                                </div>
                                                <div className="flex items-start gap-3 bg-muted/40 p-4 rounded-2xl border border-primary/5">
                                                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                                    <p className="text-xs font-bold leading-relaxed">{order.shippingAddress}</p>
                                                </div>
                                                <ul className="space-y-2 mt-4">
                                                    {order.items.map((item, i) => (
                                                        <li key={i} className="flex justify-between text-sm font-medium border-b border-primary/5 pb-2">
                                                            <span><span className="text-primary font-black mr-2">{item.quantity}x</span> {item.name}</span>
                                                            <span className="opacity-70">₹{(item.price * item.quantity).toFixed(2)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="flex justify-between font-black uppercase text-sm pt-2">
                                                    <span>Total Value</span>
                                                    <span className="text-primary italic text-lg tracking-tighter">₹{order.total.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            {/* RIGHT: Progress */}
                                            <div className="flex-1 bg-muted/10 p-6 sm:p-8 rounded-[2rem] border-2 border-primary/5 relative overflow-hidden h-full flex flex-col justify-center">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-white/10 shadow-xl", statusData.color, "bg-background")}>
                                                        <StatusIcon className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h5 className={cn("text-2xl font-black uppercase tracking-tighter leading-none mb-1", `text-[${statusData.color.split(' ')[1]}]`)}>{order.status}</h5>
                                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{statusData.desc}</p>
                                                    </div>
                                                </div>

                                                <div className="relative h-2 bg-primary/10 rounded-full overflow-hidden">
                                                    <motion.div 
                                                        className={cn("absolute top-0 left-0 h-full", order.status === 'Cancelled' ? 'bg-red-500' : 'bg-primary')}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${statusData.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-3">
                                                    <span className={order.status !== 'Cancelled' ? 'text-primary' : ''}>Verified</span>
                                                    <span className={statusData.progress >= 40 ? 'text-primary' : ''}>Processing</span>
                                                    <span className={statusData.progress >= 70 ? 'text-primary' : ''}>Transit</span>
                                                    <span className={statusData.progress === 100 ? 'text-primary' : ''}>Delivered</span>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            {/* PAST ORDERS */}
            {pastOrders.length > 0 && (
                <div className="space-y-6 opacity-70">
                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] flex items-center gap-2">
                        <Box className="h-3 w-3" />
                        Archived Ledgers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pastOrders.map(order => {
                            const isDelivered = order.status === 'Delivered';
                            return (
                            <Card key={order.id} className="rounded-3xl border-2 border-primary/5 bg-background shadow-lg hover:border-primary/20 transition-all">
                                <CardHeader className="p-5 border-b border-primary/5 pb-4 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-sm font-black uppercase tracking-tighter">{order.id}</CardTitle>
                                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{new Date(order.orderDate).toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge variant="outline" className={cn("text-[9px] font-black uppercase px-2 py-0.5", isDelivered ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-red-500/10 text-red-500 border-red-500/20")}>
                                        {order.status}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="p-5">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Payload Volume</p>
                                            <p className="font-bold text-sm tracking-tight">{order.items.length} Secure Items</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Valuation</p>
                                            <p className="font-black italic text-lg tracking-tighter">₹{order.total.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
