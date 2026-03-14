"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Factory, Home, PackagePlus, GitBranch, ArrowRight, ShieldCheck, Zap, Activity, Globe, Box, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useWeb3Store } from '@/hooks/useWeb3';

export default function ManufacturerDashboardPage() {
  const { isConnected, account } = useWeb3Store();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 space-y-12">
       {/* Header Section */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center gap-4 mb-3">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Manufacturing Node #042</Badge>
                    {isConnected ? (
                        <Badge className="bg-green-500/20 text-green-500 border-green-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">Node Synchronized</Badge>
                    ) : (
                        <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1 animate-pulse">Offline Warning</Badge>
                    )}
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                    Command <span className="text-primary italic">Center</span>
                </h1>
                <p className="text-muted-foreground mt-4 font-medium max-w-md">
                    Orchestrate your pharmaceutical supply chain. Monitor batch integrity and initialize on-chain payloads.
                </p>
            </motion.div>

            <div className="flex gap-4">
                <Link href="/" passHref>
                    <Button variant="outline" className="h-12 px-6 rounded-xl border-2 border-primary/10 hover:bg-primary/5 font-black uppercase tracking-tighter text-[10px]">
                        <Home className="mr-2 h-4 w-4" />
                        System Exit
                    </Button>
                </Link>
            </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-background/50 backdrop-blur-xl border-2 border-primary/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                        <Activity className="h-6 w-6 text-primary" />
                        <span className="text-[10px] font-black text-green-500 uppercase">Live</span>
                    </div>
                    <p className="text-3xl font-black mt-4">124</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Batches Produced</p>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-background/50 backdrop-blur-xl border-2 border-primary/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                        <Zap className="h-6 w-6 text-orange-500" />
                        <span className="text-[10px] font-black text-primary uppercase">Optimized</span>
                    </div>
                    <p className="text-3xl font-black mt-4">2.4ms</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Average Tx Latency</p>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-background/50 backdrop-blur-xl border-2 border-primary/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                        <ShieldCheck className="h-6 w-6 text-green-500" />
                        <span className="text-[10px] font-black text-green-500 uppercase">Secured</span>
                    </div>
                    <p className="text-3xl font-black mt-4">1.2k</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Blockchain Verifications</p>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-background/50 backdrop-blur-xl border-2 border-primary/10 p-6 rounded-3xl group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                        <Globe className="h-6 w-6 text-blue-500" />
                        <span className="text-[10px] font-black text-blue-500 uppercase">Global</span>
                    </div>
                    <p className="text-3xl font-black mt-4">12</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Active Smart Nodes</p>
                </Card>
            </motion.div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
        {/* Main Action Card */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.5 }}
            className="lg:col-span-8"
        >
            <Link href="/manufacturer/add-medicine" className="group block h-full">
                <Card className="h-full border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/5 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-primary transition-all relative group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-0 right-0 p-12 opacity-5 translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                        <PackagePlus className="h-64 w-64 text-primary" />
                    </div>
                    
                    <CardHeader className="p-12 pb-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
                            <PackagePlus className="h-8 w-8" />
                        </div>
                        <CardTitle className="text-4xl font-black mt-8 uppercase tracking-tighter">Initialize New Payload</CardTitle>
                        <CardDescription className="text-lg font-medium mt-4 max-w-xl leading-relaxed italic">
                            Anchor a new pharmaceutical batch to the decentralized ledger. Assign immutable identifiers and begin the lifecycle audit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-12 pb-12">
                         <div className="flex items-center gap-6 mt-8">
                             <div className="flex -space-x-3">
                                 {[1,2,3,4].map(i => (
                                     <div key={i} className="h-10 w-10 rounded-full border-4 border-background bg-muted flex items-center justify-center">
                                         <Box className="h-4 w-4 text-primary/40" />
                                     </div>
                                 ))}
                             </div>
                             <p className="text-xs font-black uppercase tracking-widest text-primary">Join 124+ Active Batch Sequences</p>
                         </div>
                    </CardContent>
                    <CardFooter className="px-12 pb-12">
                        <Button className="h-16 px-10 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-xs group-hover:bg-primary group-hover:text-white transition-colors">
                            Enter Registration Protocol
                            <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
        
        {/* Support Cards */}
        <div className="lg:col-span-4 space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="bg-muted/30 border-2 border-primary/5 rounded-[2rem] p-8 hover:border-primary/20 transition-all opacity-60">
                    <GitBranch className="h-10 w-10 text-primary mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-tighter">Supply Route Trace</h3>
                    <p className="text-sm font-medium mt-2 leading-relaxed italic">Real-time geospatial tracking of all active payloads across distribution hubs.</p>
                    <Badge variant="outline" className="mt-6 border-primary/20 text-primary font-black uppercase text-[10px]">L4 Protocol Pending</Badge>
                </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                <Card className="bg-slate-900 border-2 border-white/5 rounded-[2rem] p-8 hover:border-primary/20 transition-all relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                       <Activity className="h-4 w-4 text-primary animate-pulse" />
                    </div>
                    <CheckCircle className="h-10 w-10 text-primary mb-6" />
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">Trust Reports</h3>
                    <p className="text-sm font-medium mt-2 leading-relaxed italic text-white/60">Generate cryptographically signed audit logs for regulatory compliance.</p>
                    <Button variant="ghost" className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary p-0 hover:bg-transparent hover:translate-x-1 transition-transform">
                       Access Vault <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                </Card>
            </motion.div>
        </div>
      </div>
    </div>
  );
}
