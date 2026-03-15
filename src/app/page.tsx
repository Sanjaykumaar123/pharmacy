"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Lock, GitBranch, Database, Shield, FileCheck, UserCheck, Bot, ScanLine, Cpu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { motion, Variants } from 'framer-motion';

const quotes = [
    {
        quote: "The good physician treats the disease; the great physician treats the patient who has the disease.",
        author: "William Osler"
    },
    {
        quote: "Wherever the art of medicine is loved, there is also a love of humanity.",
        author: "Hippocrates"
    }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-full bg-background selection:bg-primary/20">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-background z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="z-10"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20 shadow-sm backdrop-blur-md">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">Verified Medical Ledger: Web3 + AI Secured</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground font-headline leading-tight">
                Trust Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Medicine</span>
              </motion.h1>
              
              <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
                PharmaTrack Lite fuses <strong className="text-foreground">Ethereum Smart Contracts</strong> with <strong className="text-foreground">AI Intelligence</strong> to build the ultimate transparent, counterfeit-proof medicine supply chain for the future.
              </motion.p>
              
              <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/medicines" passHref>
                  <Button size="lg" className="h-14 px-8 text-base font-semibold shadow-xl shadow-primary/25 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 rounded-full">
                    Enter Digital Pharmacy
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                 <Link href="/chat" passHref>
                  <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold transition-all duration-300 hover:scale-105 rounded-full border-2 border-primary/20 hover:border-primary/50 bg-background/50 backdrop-blur-sm">
                    Consult AI Assistant
                    <Bot className="ml-2 h-5 w-5 text-primary" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* 3D-Like Glassmorphic UI element for Visual Appeal */}
             <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="relative flex justify-center items-center perspective-[1000px]"
             >
                <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-full blur-3xl -z-10 animate-spin-slow"></div>
                <div className="w-full max-w-md transform-gpu transition-transform hover:rotate-y-12 hover:-rotate-x-12 duration-500">
                  <Card className="bg-background/40 border-primary/20 backdrop-blur-xl shadow-2xl p-2 rounded-3xl overflow-hidden ring-1 ring-white/10 relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-3xl"></div>
                      <CardContent className="flex flex-col h-64 items-center justify-center p-8 text-center relative z-10">
                          <Cpu className="w-16 h-16 text-primary mb-6 animate-pulse" />
                          <blockquote className="text-xl italic text-foreground/90 font-medium">
                              "Blockchain verification executed. Smart Contract synchronized. Medicine flow fully authenticated."
                          </blockquote>
                          <div className="flex items-center gap-2 mt-6 bg-green-500/10 text-green-500 px-4 py-1.5 rounded-full text-sm font-bold border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             Sepolia Network Active
                          </div>
                      </CardContent>
                  </Card>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

       <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/30 z-0"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-bold font-headline text-foreground tracking-tight">Enterprise Web3 Tech Stack</h2>
            <p className="mt-4 text-muted-foreground text-lg">
             Blending Next.js with Ethereum blockchain technology to stop counterfeit drugs permanently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Immutable Smart Contracts", desc: "Every inventory update is permanently written to the Ethereum blockchain, making falsification impossible.", icon: Lock, color: "text-blue-500", bg: "bg-blue-500/10" },
                { title: "AI-Powered Audit", desc: "Our built-in AI assistant actively scans inventory and tracks compliance, answering pharmaceutical queries instantly.", icon: Bot, color: "text-purple-500", bg: "bg-purple-500/10" },
                { title: "Decentralized Ledger", desc: "Visual multi-node simulation combined with real Web3 wallet integrations ensures zero single points of failure.", icon: Database, color: "text-primary", bg: "bg-primary/10" },
                { title: "End-to-End Traceability", desc: "Track every step of a pill's journey from Manufacturer dispatch to the Pharmacy shelf.", icon: GitBranch, color: "text-orange-500", bg: "bg-orange-500/10" },
                { title: "Fraud Detection", desc: "Cryptographic hashing reveals instant alerts if supply chain data gets compromised or manipulated.", icon: ShieldCheck, color: "text-green-500", bg: "bg-green-500/10" },
                { title: "Web3 Wallet Integration", desc: "Connect MetaMask directly to approve shipments and sign transactions as an authorized administrator.", icon: ScanLine, color: "text-pink-500", bg: "bg-pink-500/10" },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-background/60 backdrop-blur-sm border-muted hover:border-primary/30 group">
                    <CardHeader>
                      <div className={`p-4 rounded-2xl w-fit ${feature.bg} group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`h-8 w-8 ${feature.color}`} />
                      </div>
                      <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.desc}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center max-w-3xl mx-auto mb-16">
             <h2 className="text-4xl font-bold font-headline text-foreground tracking-tight">Experience The Future</h2>
            <p className="mt-4 text-muted-foreground text-lg">
             Interact directly with our core Hackathon modules.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Link href="/explorer" className="group">
              <Card className="h-full bg-gradient-to-br from-background to-primary/5 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-colors"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-primary text-primary-foreground rounded-xl shadow-lg">
                      <Database className="h-6 w-6"/>
                    </div>
                    Blockchain Explorer
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Dive into our simulated ledger map. Verify hashes, trace data mutations, and monitor live block validity directly on-chain.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors border-primary/20 font-semibold">
                      Launch Explorer
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
              </Card>
            </Link>
            
            <Link href="/chat" className="group">
              <Card className="h-full bg-gradient-to-br from-background to-blue-500/5 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mb-16 group-hover:bg-blue-500/20 transition-colors"></div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 bg-blue-500 text-white rounded-xl shadow-lg">
                      <Bot className="h-6 w-6"/>
                    </div>
                    AI Health Assistant
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Talk to our contextual AI. It understands the entire pharmacy database and can assist patients and doctors with complex queries instantly.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="outline" className="rounded-full group-hover:bg-blue-500 group-hover:border-blue-500 group-hover:text-white transition-colors border-blue-500/20 font-semibold">
                      Open AI Chat
                       <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </CardFooter>
              </Card>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
