"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { User, Home, Pill, ScanLine, Bot, ArrowRight, ShieldCheck, Heart, Sparkles, Command } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function CustomerDashboardPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
                    Safe Access Portal
                </Badge>
                <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Verified Identity</span>
                </div>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                Patient <span className="text-primary italic">Portal</span>
            </h1>
            <p className="text-muted-foreground mt-4 font-medium max-w-lg leading-relaxed">
                Welcome back. Access cryptographically verified medicines, track your wellness journey, and consult our decentralized AI network.
            </p>
        </motion.div>
        
        <Link href="/" passHref>
            <Button variant="outline" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tighter border-2 hover:bg-primary/5 group transition-all">
                <Home className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
                Return to Surface
            </Button>
        </Link>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <motion.div variants={item} className="lg:col-span-3">
          <Card className="border-2 border-primary/10 bg-gradient-to-br from-background to-primary/5 rounded-[3rem] overflow-hidden relative group p-10">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Heart className="h-64 w-64 text-primary" />
            </div>
            <div className="max-w-2xl relative z-10 space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                    <ShieldCheck className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl font-black tracking-tight uppercase leading-none">Your <span className="text-primary">Trusted</span> Wellness Hub</h3>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                    Browse medicines with the confidence that every dosage is anchored to an immutable ledger. Our zero-trust supply chain ensures your safety from manufacturing to delivery.
                </p>
                <div className="flex gap-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 rounded-lg px-3 py-1 font-bold">PRO-ACTIVE PROTECTION</Badge>
                    <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-0 rounded-lg px-3 py-1 font-bold">24/7 AI SUPPORT</Badge>
                </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="group">
          <Link href="/medicines">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-primary/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <Pill className="h-20 w-20 text-primary group-hover:rotate-12 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Digital Pharmacy</CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2 text-muted-foreground">Search and acquire verified medicines directly from the global distribution ledger.</CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter bg-primary group/btn">
                        Launch Pharmacy
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item} className="group">
          <Link href="/scanner">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-500/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <ScanLine className="h-20 w-20 text-blue-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Instant Verification</CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2 text-muted-foreground">Scan physical QR codes to check the cryptographic integrity and history of your batch.</CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter border-2 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5 group/btn">
                        Open Scanner
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>

        <motion.div variants={item} className="group">
          <Link href="/chat">
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl hover:border-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/5 transition-all flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-purple-500/10 to-transparent p-10 flex items-center justify-center relative overflow-hidden">
                    <Bot className="h-20 w-20 text-purple-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="p-10 pt-6 flex-grow">
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">AI Wellness Expert</CardTitle>
                    <CardDescription className="text-base font-medium leading-relaxed mt-2 text-muted-foreground">Consult our medical AI for insights, usage guidelines, and real-time interaction with the药房 inventory.</CardDescription>
                </CardHeader>
                <CardFooter className="p-10 pt-0">
                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase tracking-tighter border-2 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5 group/btn">
                        Consult AI
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                </CardFooter>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
