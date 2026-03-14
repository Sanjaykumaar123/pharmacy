
"use client";

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, LineChart, IndianRupee, Package, ShoppingCart, Loader2, TrendingUp, Activity } from 'lucide-react';
import { ChartContainer, ChartConfig, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useOrderStore } from '@/hooks/useOrderStore';
import { motion } from 'framer-motion';
import type { Medicine } from '@/types/medicine';

const stockStatusConfig = {
  'In Stock': { label: 'In Stock', color: 'hsl(var(--chart-2))' },
  'Low Stock': { label: 'Low Stock', color: 'hsl(var(--chart-4))' },
  'Out of Stock': { label: 'Out of Stock', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const supplyChainConfig = {
    'At Manufacturer': { label: 'At Manufacturer', color: 'hsl(var(--chart-1))' },
    'In Transit': { label: 'In Transit', color: 'hsl(var(--chart-3))' },
    'At Pharmacy': { label: 'At Pharmacy', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const AnalyticsPage = () => {
    const { medicines, isInitialized: isMedicinesInitialized } = useMedicineStore();
    const { orders } = useOrderStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => { setIsClient(true); }, []);

    const analytics = useMemo(() => {
        if (!isClient || !isMedicinesInitialized) return null;

        const totalMedicines = medicines.length;
        const totalOrders = orders.length;
        const totalRevenue = orders
            .filter(o => o.status === 'Delivered')
            .reduce((sum, order) => sum + order.total, 0);

        const stockStatusData = Object.entries(
            medicines.reduce((acc, med) => {
                acc[med.stockStatus] = (acc[med.stockStatus] || 0) + 1;
                return acc;
            }, {} as Record<Medicine['stockStatus'], number>)
        ).map(([name, value]) => ({ name, value, fill: stockStatusConfig[name as keyof typeof stockStatusConfig].color }));

        const supplyChainData = Object.entries(
             medicines.reduce((acc, med) => {
                acc[med.supplyChainStatus] = (acc[med.supplyChainStatus] || 0) + 1;
                return acc;
            }, {} as Record<Medicine['supplyChainStatus'], number>)
        ).map(([name, value]) => ({ name, value, fill: supplyChainConfig[name as keyof typeof supplyChainConfig].color }));

        const topSellingProducts = orders
            .flatMap(o => o.items)
            .reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + item.quantity;
                return acc;
            }, {} as Record<string, number>);

        const sortedTopProducts = Object.entries(topSellingProducts)
            .sort(([,a],[,b]) => b - a)
            .slice(0, 5)
            .map(([name, quantity]) => ({name, quantity}));

        return { totalMedicines, totalOrders, totalRevenue, stockStatusData, supplyChainData, sortedTopProducts };
    }, [isClient, isMedicinesInitialized, medicines, orders]);
    
    if (!isClient || !analytics) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-2 border-primary/20 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Loading Analytics...</p>
            </div>
        );
    }

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₹${analytics.totalRevenue.toFixed(2)}`,
            sub: 'From delivered orders',
            icon: IndianRupee,
            color: 'text-green-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
        },
        {
            label: 'Total Orders',
            value: analytics.totalOrders.toString(),
            sub: 'All time',
            icon: ShoppingCart,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
        },
        {
            label: 'Total Medicines',
            value: analytics.totalMedicines.toString(),
            sub: 'Unique batches registered',
            icon: Package,
            color: 'text-primary',
            bg: 'bg-primary/10',
            border: 'border-primary/20',
        },
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-10 max-w-7xl space-y-10">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 relative">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-3">
                        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">
                            System Intelligence
                        </Badge>
                        <div className="flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Live Data</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                        System <span className="text-primary italic">Analytics</span>
                    </h1>
                    <p className="text-muted-foreground mt-3 font-medium max-w-lg">
                        Real-time overview of inventory, supply chain, and sales performance.
                    </p>
                </motion.div>
                <Link href="/admin/dashboard" passHref>
                    <Button variant="outline" className="rounded-2xl h-12 px-6 font-black uppercase tracking-tighter border-2 hover:bg-primary/5 group transition-all">
                        <Home className="mr-2 h-4 w-4 group-hover:-translate-y-1 transition-transform" />
                        Admin Dashboard
                    </Button>
                </Link>
            </div>

            {/* STAT CARDS */}
            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-5 md:grid-cols-3">
                {statCards.map((stat) => (
                    <motion.div key={stat.label} variants={item}>
                        <Card className="border-2 border-primary/5 bg-background/50 backdrop-blur-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CardHeader className="flex flex-row items-center justify-between pb-2 p-6">
                                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</CardTitle>
                                <div className={`h-10 w-10 rounded-2xl ${stat.bg} border ${stat.border} flex items-center justify-center`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-0">
                                <div className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-2">{stat.sub}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* CHARTS ROW */}
            <motion.div
                variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 lg:grid-cols-5 gap-6"
            >
                {/* PIE CHART */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="border-2 border-primary/5 bg-background/50 backdrop-blur-xl rounded-3xl h-full">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Stock Status</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Distribution by stock level</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <ChartContainer config={stockStatusConfig} className="mx-auto aspect-square h-[220px]">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                    <Pie data={analytics.stockStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} label>
                                        {analytics.stockStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                            <div className="flex flex-wrap justify-center gap-3 mt-4">
                                {analytics.stockStatusData.map(s => (
                                    <div key={s.name} className="flex items-center gap-1.5">
                                        <div className="h-2 w-2 rounded-full" style={{ background: s.fill }} />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* BAR CHART */}
                <motion.div variants={item} className="lg:col-span-3">
                    <Card className="border-2 border-primary/5 bg-background/50 backdrop-blur-xl rounded-3xl h-full">
                        <CardHeader className="p-6 pb-2">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Supply Chain</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Current location of medicine batches</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <ChartContainer config={supplyChainConfig} className="h-[250px] w-full">
                                <BarChart data={analytics.supplyChainData} barSize={36}>
                                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }} />
                                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 800, fill: 'hsl(var(--muted-foreground))' }} />
                                    <ChartTooltip cursor={{ fill: 'hsl(var(--primary)/0.05)' }} content={<ChartTooltipContent hideLabel />} />
                                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                        {analytics.supplyChainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* TOP PRODUCTS */}
                <motion.div variants={item} className="lg:col-span-5">
                    <Card className="border-2 border-primary/5 bg-background/50 backdrop-blur-xl rounded-3xl">
                        <CardHeader className="p-6 pb-4">
                            <div className="flex items-center gap-2">
                                <LineChart className="h-4 w-4 text-primary" />
                                <CardTitle className="text-sm font-black uppercase tracking-widest">Top Selling Products</CardTitle>
                            </div>
                            <CardDescription className="text-[10px] uppercase tracking-widest font-bold">Most frequently ordered medicines</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            {analytics.sortedTopProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-3">
                                    <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
                                        <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No order data available yet</p>
                                </div>
                            ) : (
                                <ul className="space-y-3">
                                    {analytics.sortedTopProducts.map((item, i) => (
                                        <li key={item.name} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-primary/5 hover:border-primary/20 transition-all group">
                                            <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-[10px] font-black text-primary">#{i + 1}</span>
                                            </div>
                                            <span className="font-black uppercase tracking-tighter text-sm flex-1">{item.name}</span>
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black text-[10px] uppercase tracking-widest">
                                                {item.quantity} units sold
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AnalyticsPage;
