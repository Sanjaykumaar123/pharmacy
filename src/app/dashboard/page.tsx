"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Box, Database, Link as LinkIcon, AlertTriangle, Wallet, ArrowUpRight, ShieldCheck, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import localBlockchain from '@/blockchain/LocalChain';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useWeb3Store } from '@/hooks/useWeb3';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { medicines, isInitialized } = useMedicineStore();
  const { account, balance, isSepolia, isConnected, networkName } = useWeb3Store();
  const [chainValid, setChainValid] = useState(true);
  const [blocks, setBlocks] = useState<any[]>([]);

  useEffect(() => {
    // Validate chain on load
    const validation = localBlockchain.validateChain();
    setChainValid(validation.isValid);
    // Get recent blocks
    setBlocks([...localBlockchain.chain].reverse().slice(0, 5));
  }, []);

  const totalMedicines = medicines?.length || 0;
  const totalTransactions = localBlockchain.chain.length;

  const chartData = [
    { name: 'Mon', tx: 4, vol: 200 },
    { name: 'Tue', tx: 7, vol: 450 },
    { name: 'Wed', tx: 5, vol: 310 },
    { name: 'Thu', tx: 10, vol: 680 },
    { name: 'Fri', tx: totalTransactions, vol: 890 },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground font-headline uppercase">
            Enterprise <span className="text-primary italic">Intelligence</span>
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic tracking-tight">Cross-chain inventory audit & real-time cryptographic monitoring.</p>
        </div>
        
        {isConnected && (
            <div className="flex items-center gap-2 bg-primary/5 p-2 rounded-2xl border border-primary/10 backdrop-blur-md">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                    <Wallet className="h-5 w-5" />
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none">Verified Operator</p>
                    <p className="text-sm font-mono font-bold tracking-tighter">{account?.substring(0,6)}...{account?.substring(account.length-4)}</p>
                </div>
            </div>
        )}
      </div>

      {isConnected && !isSepolia && (
          <div className="bg-destructive/10 border-2 border-destructive/20 p-4 rounded-3xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="flex items-center gap-3">
                 <div className="h-12 w-12 rounded-2xl bg-destructive flex items-center justify-center text-white shadow-xl shadow-destructive/20">
                    <AlertTriangle className="h-6 w-6" />
                 </div>
                 <div>
                    <h3 className="font-black uppercase tracking-tight text-destructive">Network Mismatch Detected</h3>
                    <p className="text-sm text-destructive/80 font-medium">You are connected to <span className="font-bold underline">{networkName}</span>. Please switch to <span className="font-bold underline">Sepolia</span> to synchronize inventory.</p>
                 </div>
             </div>
             <Button variant="destructive" size="sm" className="rounded-xl font-bold px-6 shadow-lg shadow-destructive/20 active:scale-95 transition-all">Switch Network</Button>
          </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Pharmacy Stock</CardTitle>
            <Box className="h-5 w-5 text-primary group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter">{isInitialized ? totalMedicines : '...'}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Live SKU Count</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Chain Depth</CardTitle>
            <Activity className="h-5 w-5 text-blue-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-blue-500">{totalTransactions}</div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase mt-1">Immutable Blocks</p>
          </CardContent>
        </Card>

        <Card className="bg-background border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Wallet Power</CardTitle>
            <ShieldCheck className="h-5 w-5 text-green-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-green-500">
                {isConnected ? `${parseFloat(balance || '0').toFixed(3)}` : '0.00'} <span className="text-xl">ETH</span>
            </div>
            <Badge variant="outline" className="mt-2 border-green-500/20 bg-green-500/5 text-green-600 font-black text-[9px] uppercase tracking-tighter px-2 py-0">
               {isSepolia ? "Verified Gas" : "No Funds"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-background border-2 border-primary/10 shadow-xl shadow-primary/5 rounded-[2rem] overflow-hidden group hover:border-primary/30 transition-all duration-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cloud Status</CardTitle>
            <Globe className="h-5 w-5 text-orange-500 group-hover:scale-125 transition-transform" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tighter text-orange-500">Active</div>
            <div className="flex items-center gap-1 mt-1">
                <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Sepolia Testnet</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-2 border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-xl">
          <CardHeader className="pb-0 pt-8 px-8">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                        <Activity className="h-6 w-6 text-primary" />
                        Network Flux
                    </CardTitle>
                    <CardDescription className="font-medium">Inventory mutation frequency across the last 5 shifts.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full px-4 border-primary/20 bg-primary/5 text-primary font-bold">Real-time Feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTx" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted/30" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} className="text-[10px] font-black uppercase" dy={10} />
                  <YAxis axisLine={false} tickLine={false} className="text-[10px] font-black" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: 'hsl(var(--background))', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }} 
                    itemStyle={{ fontWeight: '900', color: 'hsl(var(--primary))' }}
                  />
                  <Area type="monotone" dataKey="tx" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorTx)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-2 border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-background/50 backdrop-blur-xl">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Database className="h-6 w-6 text-blue-500" />
                Ledger Logs
            </CardTitle>
            <CardDescription className="font-medium">Latest cryptographic anchors verified by consensus.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-4">
              {blocks.map((block, idx) => (
                <div key={block.hash} className="group relative flex items-center p-3 rounded-2xl bg-muted/20 border border-transparent hover:border-primary/20 hover:bg-muted/40 transition-all duration-300">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mr-4 shadow-inner transition-transform group-hover:scale-110 ${block.isTampered ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                    {block.isTampered ? <AlertTriangle className="h-6 w-6" /> : <Box className="h-6 w-6" />}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">
                            Shift #{block.index}
                        </p>
                        <span className="text-[10px] font-bold text-muted-foreground/60 whitespace-nowrap">
                            {new Date(block.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                    <p className="text-sm font-black leading-none truncate text-foreground py-1">
                      {block.transactionData.type}
                    </p>
                    <p className="text-[9px] font-mono text-muted-foreground truncate bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded w-fit">
                      0x...{block.hash.substring(block.hash.length - 12)}
                    </p>
                  </div>
                  
                  <div className="ml-2">
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                        <ArrowUpRight className="h-4 w-4" />
                     </Button>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4 rounded-2xl font-black uppercase tracking-widest text-[10px] h-11 border-2 border-primary/10 hover:border-primary/30 group">
                  View Full Chain Architecture
                  <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
