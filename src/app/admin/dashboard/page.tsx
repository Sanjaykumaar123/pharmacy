"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Home, 
  Warehouse, 
  ArrowRight, 
  Users, 
  LineChart, 
  ShoppingCart, 
  Zap, 
  Globe, 
  Lock, 
  Activity,
  Cpu,
  Fingerprint
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-7xl space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">
                    System Authority v4.2
                </Badge>
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-ping"></div>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Live Node</span>
                </div>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                Admin <span className="text-primary italic">Command</span>
            </h1>
            <p className="text-muted-foreground mt-4 font-medium max-w-lg leading-relaxed">
                Central nerve center for PharmaTrack. Oversee global inventory, authorize blockchain anchors, and manage network participants.
            </p>
        </motion.div>
        
        <Link href="/" passHref>
            <Button variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tighter border-2 hover:bg-primary/5 group transition-all">
                <Home className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Back to Surface
            </Button>
        </Link>
      </div>

      {/* QUICK STATS AREA */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
              { label: "Network Integrity", val: "99.9%", icon: ShieldCheck, color: "text-green-500" },
              { label: "Active Nodes", val: "128", icon: Globe, color: "text-blue-500" },
              { label: "Pending Anchors", val: "04", icon: Zap, color: "text-amber-500" },
              { label: "Sync Latency", val: "24ms", icon: Activity, color: "text-primary" }
          ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[2rem] bg-background/50 border-2 border-primary/5 backdrop-blur-xl flex items-center justify-between group hover:border-primary/20 transition-all cursor-default"
              >
                  <div>
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black mt-1 tracking-tighter">{stat.val}</p>
                  </div>
                  <div className={cn("h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center transition-all group-hover:scale-110", stat.color)}>
                      <stat.icon className="h-6 w-6" />
                  </div>
              </motion.div>
          ))}
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {/* OVERVIEW CARD */}
        <motion.div variants={item} className="lg:col-span-3">
            <Card className="border-2 border-primary/10 bg-slate-950 text-white rounded-[3rem] overflow-hidden relative group shadow-2xl shadow-primary/10">
                {/* ADVANCED TERMINAL EFFECTS */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent)] pointer-events-none"></div>
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px] pointer-events-none"></div>
                
                {/* SCAN LINE EFFECT */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.5)] animate-scan-fast pointer-events-none"></div>
                
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                    <Cpu className="h-64 w-64" />
                </div>

                <CardHeader className="p-12 pb-6 relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                            <Lock className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-black uppercase tracking-[0.3em] w-fit px-3 py-1">
                                Master Authority Access
                            </Badge>
                            <span className="text-[8px] font-mono text-primary/40 mt-1 uppercase tracking-widest font-bold">SESSION_ID: PHX-772-LITE</span>
                        </div>
                    </div>
                    <CardTitle className="text-5xl font-black tracking-tighter uppercase leading-none">
                        Welcome to the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Ledger Control</span>
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-12 pt-0 max-w-2xl relative z-10">
                    <p className="text-slate-400 font-medium text-lg leading-relaxed border-l-4 border-primary/20 pl-6 italic">
                        You are operating with Level 5 administrative privileges. Every action taken within this terminal is cryptographically anchored and broadcast across the decentralized pharmaceutical mesh.
                    </p>
                </CardContent>
                
                <div className="absolute bottom-10 right-12 flex items-center gap-2 opacity-30">
                    <Fingerprint className="h-6 w-6" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Biometric Verified</span>
                </div>
            </Card>
        </motion.div>
        
        {/* ACTION CARDS */}
        <motion.div variants={item} className="group">
          <Link href="/admin/stock">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                    <Warehouse className="h-20 w-20 text-primary group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        Inventory & Anchors
                        <Zap className="h-5 w-5 text-amber-500 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2">
                        Oversee the entire medicine inventory and selectively anchor batches to Ethereum.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter bg-primary group/btn">
                        Go to Stock Control
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item} className="group">
          <Link href="/admin/orders">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-500/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                    <ShoppingCart className="h-20 w-20 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Order Lifecycle</CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2">
                        View, fulfill, and track customer orders throughout the pharmaceutical pipeline.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter border-2 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5 group/btn">
                        Manage Orders
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>
        
        <motion.div variants={item} className="group">
          <Link href="/admin/users">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-green-500/40 hover:shadow-2xl hover:shadow-green-500/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-green-500/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>
                    <Users className="h-20 w-20 text-green-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Personnel Directory</CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2">
                        Manage roles for Manufacturers and Customers. Control biometric and cryptographic access.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter border-2 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/5 group/btn">
                        User Management
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-3 group">
          <Link href="/admin/analytics">
            <Card className="border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-primary/40 transition-all rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row items-center">
                <div className="p-12 md:w-2/3">
                    <div className="flex items-center gap-3 mb-6">
                        <LineChart className="h-8 w-8 text-primary" />
                        <h3 className="text-3xl font-black uppercase tracking-tighter">Visual Intelligence</h3>
                    </div>
                    <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-8">
                        Access deep-dive analytics on stock turnover, manufacturer performance, and supply chain bottlenecks. Powered by high-fidelity tracking data.
                    </p>
                    <Button className="h-14 px-12 rounded-2xl font-black uppercase tracking-tighter bg-gradient-to-r from-primary to-blue-600">
                        Enter Analytics Suite
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                <div className="md:w-1/3 w-full bg-primary/5 p-12 flex items-center justify-center border-l border-primary/5 h-full">
                    <div className="relative group/dna">
                        <Fingerprint className="h-40 w-40 text-primary/20 group-hover/dna:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Activity className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                    </div>
                </div>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
