"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Link as LinkIcon, ShieldCheck, ShieldAlert, ArrowDown, Activity, RefreshCw, Globe, MapPin, Zap, Lock, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import localBlockchain, { Block } from '@/blockchain/LocalChain';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeb3Store } from '@/hooks/useWeb3';

export default function ExplorerPage() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [chainValid, setChainValid] = useState(true);
  const [compromisedBlocks, setCompromisedBlocks] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Initial load
    setBlocks([...localBlockchain.chain]);
    const validation = localBlockchain.validateChain();
    setChainValid(validation.isValid);
    setCompromisedBlocks(validation.compromisedBlocks);
  }, []);

  const verifyBlockchain = () => {
    setIsValidating(true);
    setTimeout(() => {
      const validation = localBlockchain.validateChain();
      setChainValid(validation.isValid);
      setCompromisedBlocks(validation.compromisedBlocks);
      setBlocks([...localBlockchain.chain]); // Refresh state
      setIsValidating(false);

      if (validation.isValid) {
        toast({
          title: "Blockchain Verified",
          description: "All blocks match their hashes. No tampering detected.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Integrity Compromised",
          description: `Tampering detected at block(s): ${validation.compromisedBlocks.join(", ")}`,
        });
      }
    }, 800);
  };

  const simulateTamper = (index: number) => {
    localBlockchain.tamperBlockData(index, "TAMPERED DATA");
    setBlocks([...localBlockchain.chain]);
    toast({
      title: "Data Modified",
      description: `Block ${index}'s data was artificially altered. Verify chain to see effects.`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-12 max-w-6xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Secure Network Layer</Badge>
          <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
            Ledger <span className="text-primary italic">Deep-Scan</span>
          </h1>
          <p className="text-muted-foreground mt-4 font-medium max-w-md">
            Visualizing the pharmaceutical immutable pipeline. Every block represents a unique cryptographic anchor in the supply chain.
          </p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Button onClick={verifyBlockchain} disabled={isValidating} size="lg" className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all font-black uppercase tracking-tighter">
                {isValidating ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                {isValidating ? "Scanning Protocol..." : "Verify Integrity"}
              </Button>
            </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Network Map / Global Nodes (Premium Visual) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4 h-full"
        >
            <Card className="h-full border-2 border-primary/10 bg-background/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent"></div>
                <CardHeader className="relative z-10 px-8 pt-8">
                    <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary animate-spin-slow" />
                        Global Nodes
                    </CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Decentralized Distribution</CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 px-8 py-10">
                    <div className="relative h-48 w-full bg-slate-900/10 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                        {/* Simulation of Map Pins */}
                        {[
                            { t: '15%', l: '20%', n: 'London' },
                            { t: '40%', l: '60%', n: 'Delhi' },
                            { t: '25%', l: '80%', n: 'Tokyo' },
                            { t: '60%', l: '30%', n: 'New York' },
                        ].map((pin, pidx) => (
                            <motion.div 
                                key={pidx}
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 + pidx }}
                                className="absolute flex flex-col items-center gap-1"
                                style={{ top: pin.t, left: pin.l }}
                            >
                                <MapPin className="h-4 w-4 text-primary fill-primary/20" />
                                <span className="text-[8px] font-black text-white/50 bg-black/50 px-1 rounded uppercase">{pin.n}</span>
                            </motion.div>
                        ))}
                    </div>
                    
                    <div className="mt-8 space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-primary/5 border border-primary/10">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Latency</span>
                            </div>
                            <span className="font-mono text-xs font-black">24ms</span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                            <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Protocol</span>
                            </div>
                            <span className="font-mono text-xs font-black">PoS/Sepolia</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {/* Status Card */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className={`border-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden transition-all duration-700 ${chainValid ? 'border-primary/20' : 'border-red-500/50 -rotate-1 shadow-red-500/10'}`}>
              <CardHeader className={`px-8 pt-8 ${chainValid ? 'bg-primary/5 border-b border-primary/10' : 'bg-red-500/10 border-b border-red-500/20'}`}>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                    <Activity className={`h-6 w-6 ${chainValid ? 'text-primary' : 'text-red-500 animate-pulse'}`} />
                    System State: {chainValid ? "Synchronized" : "Breach Detected"}
                  </CardTitle>
                  {chainValid ? (
                    <Badge className="bg-green-500 hover:bg-green-600 font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-green-500/30">
                      ✔ Verified Intact
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="font-black px-6 py-2 rounded-xl text-[10px] uppercase tracking-widest animate-bounce shadow-xl shadow-red-500/30">
                      ✖ Integrity Failure
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {chainValid ? (
                   <p className="text-muted-foreground font-medium leading-relaxed italic">
                      "All hashes are mathematically consistent. The medicine pipeline is secured with multi-node consensus. No tampering detected in the current audit window."
                   </p>
                ) : (
                   <div className="space-y-4">
                      <p className="text-red-600 font-black uppercase tracking-tight text-lg">Cryptographic collision detected.</p>
                      <p className="text-muted-foreground font-medium leading-relaxed bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                         The following anchors have been artificially modified without cryptographic validation: <span className="font-mono text-red-500 font-bold">{compromisedBlocks.join(", ")}</span>. Emergency audit recommended.
                      </p>
                   </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
          
          <div className="space-y-6">
            <AnimatePresence>
            {blocks.map((block, i) => {
          const isCompromised = block.isTampered;
          return (
            <motion.div 
              key={block.index} 
              initial={{ opacity: 0, y: 50, rotateX: 30 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {i > 0 && <ArrowDown className={`h-10 w-10 my-4 ${isCompromised ? 'text-red-500 animate-bounce' : 'text-primary/40'}`} />}
              
              <Card className={`w-full transition-all duration-500 border-2 rounded-[2rem] overflow-hidden ${isCompromised ? 'border-red-500 bg-red-500/5 ring-4 ring-red-500/10 shadow-2xl shadow-red-500/20' : 'border-primary/10 hover:border-primary/40 shadow-xl shadow-primary/5'}`}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`block-${block.index}`} className="border-none">
                    <CardHeader className="py-6 px-8">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                        <AccordionTrigger className="hover:no-underline py-0 flex-1 hover:opacity-80 transition-opacity">
                          <div className="flex items-center gap-6 text-left">
                            <div className={`h-16 w-16 rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isCompromised ? 'bg-red-500 text-white shadow-red-500/40' : 'bg-primary text-primary-foreground shadow-primary/30'}`}>
                                {isCompromised ? <ShieldAlert className="h-8 w-8" /> : <Cpu className="h-8 w-8 animate-pulse" />}
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Anchor #{block.index}</CardTitle>
                                <CardDescription className="font-mono text-[10px] mt-1 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded w-fit uppercase font-bold tracking-widest">
                                  {new Date(block.timestamp).toLocaleString()}
                                </CardDescription>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <div className="flex gap-4 items-center flex-shrink-0">
                          {isCompromised ? (
                             <Badge variant="destructive" className="font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-tighter">Tamper Detected</Badge>
                          ) : (
                             <Badge variant="outline" className="text-green-600 bg-green-500/5 border-green-500/20 font-black px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-tighter">Cryptographically Sound</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <AccordionContent className="px-8 pb-8 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-muted/30 p-4 rounded-2xl border-2 border-primary/5">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Previous Hash Link</p>
                                <p className={`text-xs font-mono break-all leading-relaxed ${isCompromised ? 'text-red-500 font-black' : 'text-foreground'}`}>
                                    {block.previousHash === "0" ? "0000000000000000 GENESIS" : block.previousHash}
                                </p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-2xl border-2 border-primary/5">
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-2">Current Hash Anchor</p>
                                <p className="text-xs font-mono break-all leading-relaxed text-primary font-bold">{block.hash}</p>
                            </div>
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-black uppercase text-muted-foreground">Nonce Complexity: {block.nonce}</span>
                                {block.index !== 0 && (
                                    <Button size="sm" variant="destructive" className="h-9 px-4 rounded-xl font-bold uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/10 active:scale-95 transition-all" onClick={() => simulateTamper(block.index)}>
                                        Inject Malware
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-slate-950 p-6 rounded-2xl border-2 border-white/5 relative overflow-hidden shadow-inner group">
                           <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                               <Zap className="h-4 w-4 text-primary" />
                           </div>
                           <p className="text-[10px] text-primary/80 uppercase font-black tracking-widest mb-4">Payload Data Structure</p>
                           <pre className="text-[10px] font-mono text-green-400 overflow-x-auto selection:bg-green-500/30">
                              {JSON.stringify(block.transactionData, null, 2)}
                           </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>
          );
        })}
        </AnimatePresence>
      </div>
    </div>
  </div>
</div>
  );
}
