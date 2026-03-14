"use client";

import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types/medicine';
import { notFound, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SideEffects from '@/components/SideEffects';
import { Calendar, Factory, Package, Pill, Boxes, Loader2, CheckCircle, Clock, History, ShoppingCart, ShieldCheck, Sparkles, ExternalLink, Zap, Lock, FileCheck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/hooks/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CheckoutDialog } from '@/components/CheckoutDialog';

export default function MedicineDetailPage() {
  const { medicines, isInitialized } = useMedicineStore();
  const [medicine, setMedicine] = useState<Medicine | null | undefined>(undefined); 
  const params = useParams();
  const id = params.id as string;
  const { toast } = useToast();
  const router = useRouter();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);

  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!medicine) return;
    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = () => {
    if (!medicine) return;
    setIsCheckoutOpen(true);
  };

  const simulateMint = () => {
    if (!medicine) return;
    setIsMinting(true);
    setTimeout(() => {
        setIsMinting(false);
        setNftMinted(true);
        
        // Persist to localStorage so it survives page reloads
        const mintedCards = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
        if (!mintedCards.includes(medicine.id)) {
            mintedCards.push(medicine.id);
            localStorage.setItem('minted_nfts', JSON.stringify(mintedCards));
        }
        
        toast({
            title: "Authenticity NFT Minted",
            description: "A cryptographic proof of ownership has been anchored to the block.",
        });
    }, 2500);
  };
  
  useEffect(() => {
    const findMedicine = () => {
      if (medicines.length > 0) {
        const found = medicines.find((m) => m.id === id);
        setMedicine(found || null);
        
        // Check if the user has already minted this one
        if (found) {
            const mintedCards = JSON.parse(localStorage.getItem('minted_nfts') || '[]');
            if (mintedCards.includes(found.id)) {
                setNftMinted(true);
            }
        }
      }
    };

    if (isInitialized) {
      findMedicine();
    }
  }, [id, isInitialized, medicines]);


  if (medicine === undefined || !isInitialized) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-lg font-bold">Synchronizing Node Data...</p>
        </div>
    )
  }
  
  if (medicine === null) {
      notFound();
  }

  const isExpired = new Date(medicine.expDate) < new Date();
  const isVerified = medicine.onChain && medicine.listingStatus === 'Approved';

  return (
    <>
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 space-y-8">
            <Card className="overflow-hidden border-2 border-primary/10 shadow-2xl rounded-[2.5rem] bg-background/50 backdrop-blur-xl">
              <CardHeader className="bg-primary/5 p-8 border-b border-primary/10 flex flex-row justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-[2rem] bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Pill className="h-10 w-10" />
                    </div>
                    <div>
                        <CardTitle className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
                            {medicine.name}
                        </CardTitle>
                        <CardDescription className="text-lg font-medium italic mt-2">
                            {medicine.description}
                        </CardDescription>
                    </div>
                </div>
                <div className="text-4xl font-black text-primary tracking-tighter italic">
                    ₹{medicine.price.toFixed(2)}
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-primary/5">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <Factory className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Manufacturer</p>
                                <p className="font-bold">{medicine.manufacturer}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-primary/5">
                            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Batch Number</p>
                                <p className="font-mono font-bold tracking-tight">{medicine.batchNo}</p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-primary/5">
                            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Expiry Date</p>
                                <p className={cn("font-bold", isExpired && "text-red-500")}>
                                    {new Date(medicine.expDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                    {isExpired && " (Expired)"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-primary/5">
                            <div className="h-12 w-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                                <Boxes className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Global Inventory</p>
                                <p className="font-bold">{medicine.quantity} units available</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 p-8 rounded-[2rem] bg-slate-950 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                        <Sparkles className="h-20 w-20 text-primary" />
                    </div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-4">Integrity Validation Protocol</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm font-medium opacity-60">Listing Status</span>
                            <Badge className={cn(
                                "rounded-lg font-black uppercase text-[10px] px-3",
                                medicine.listingStatus === 'Approved' ? "bg-green-500" : "bg-yellow-500"
                            )}>
                                {medicine.listingStatus}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-sm font-medium opacity-60">Supply Chain Stage</span>
                            <span className="text-sm font-black uppercase tracking-tighter text-blue-400 italic">
                                {medicine.supplyChainStatus}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium opacity-60">Cryptographic Seal</span>
                            <Badge variant="outline" className="border-primary/40 text-primary font-black uppercase text-[9px] bg-primary/5">
                                {isVerified ? "SHA-256 Verified" : "Verification Pending"}
                            </Badge>
                        </div>
                    </div>
                </div>
              </CardContent>

              <CardFooter className="bg-muted/10 p-8 flex gap-4">
                <Button onClick={handleAddToCart} size="lg" variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-tight border-2 hover:bg-primary/5 group">
                   <ShoppingCart className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" /> Add to Cart
                </Button>
                <Button onClick={handleBuyNow} size="lg" className="flex-[1.5] h-14 rounded-2xl font-black uppercase tracking-tight bg-gradient-to-r from-primary to-blue-600 shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all">
                   Acquire via Web3
                </Button>
              </CardFooter>
            </Card>

            <SideEffects medicineName={medicine.name} />
          </div>

          <div className="md:col-span-4 flex flex-col gap-8">
             {/* WEB3 PREMIUM CARD: Digital Twin */}
             <Card className="border-2 border-primary/20 bg-background shadow-2xl rounded-[2.5rem] overflow-hidden shrink-0">
                <div className="aspect-square relative flex items-center justify-center p-12 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
                    <motion.div 
                        animate={isVerified ? { 
                            rotateY: [0, 180, 360], 
                            y: [0, -10, 0],
                            scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10"
                    >
                        <div className={cn(
                            "h-44 w-32 bg-white/10 backdrop-blur-md border-4 rounded-2xl flex flex-col p-4 justify-between group overflow-hidden transition-all duration-500",
                            isVerified ? "border-primary/30 shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]" : "border-muted/30 grayscale"
                        )}>
                           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                           <div className="h-8 w-full bg-primary/20 rounded-md"></div>
                           <div className="space-y-2">
                               <div className="h-1 w-3/4 bg-white/20 rounded"></div>
                               <div className="h-1 w-full bg-white/20 rounded"></div>
                               <div className="h-1 w-1/2 bg-white/20 rounded"></div>
                           </div>
                           <div className="h-10 w-10 rounded-full border-2 border-primary/30 flex items-center justify-center self-end">
                               {isVerified ? <ShieldCheck className="h-6 w-6 text-primary" /> : <ShieldAlert className="h-6 w-6 text-muted-foreground" />}
                           </div>
                        </div>
                    </motion.div>
                    
                    <div className="absolute inset-x-0 bottom-0 p-8 text-center bg-gradient-to-t from-background to-transparent">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Web3 Digital Twin</p>
                        <p className="text-xs font-medium text-muted-foreground mt-1 italic">
                            {isVerified ? "Immutable Batch Identity Card" : "Identity Data Locked"}
                        </p>
                    </div>
                </div>

                <CardContent className="p-8 pt-6 space-y-6">
                    {isVerified ? (
                        <>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-muted/40 border border-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase">Gas Status</span>
                                    </div>
                                    <span className="text-xs font-bold text-green-500 uppercase">Optimal</span>
                                </div>
                                
                                <div className="p-4 rounded-2xl bg-muted/40 border border-primary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-blue-500" />
                                        <span className="text-[10px] font-black uppercase">Consensus</span>
                                    </div>
                                    <span className="text-xs font-bold font-mono">SEPOLIA</span>
                                </div>
                            </div>

                            <Button 
                                onClick={simulateMint}
                                disabled={isMinting || nftMinted}
                                className={cn(
                                    "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all duration-500",
                                    nftMinted 
                                        ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default opacity-80" 
                                        : "bg-foreground text-background hover:scale-[1.02] shadow-xl shadow-foreground/10"
                                )}
                            >
                                {isMinting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (nftMinted ? <CheckCircle className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />)}
                                {isMinting ? "Securing Proof..." : (nftMinted ? "Authenticity Secured" : "Mint Proof of Authenticity")}
                            </Button>

                            {medicine.txHash && (
                                <div className="pt-4 border-t border-muted">
                                    <a 
                                        href={`https://sepolia.etherscan.io/tx/${medicine.txHash}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center gap-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest"
                                    >
                                        <ExternalLink className="h-3 w-3" /> External Ledger Link
                                    </a>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-6 text-center space-y-4">
                            <div className="h-16 w-16 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                                <Lock className="h-8 w-8" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-black uppercase tracking-tighter">Verification Required</p>
                                <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                                    On-chain data and cryptographic proofs are locked until administrative anchoring is complete.
                                </p>
                            </div>
                            <Badge variant="outline" className="border-amber-500/50 text-amber-600 bg-amber-50/50 text-[9px] font-black uppercase">
                                Node Review Pending
                            </Badge>
                        </div>
                    )}
                </CardContent>
             </Card>

             {isVerified ? (
                <Card className="border-2 border-primary/5 bg-muted/10 rounded-[2rem]">
                    <CardHeader className="p-6 pb-2">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
                            <History className="h-4 w-4 text-primary" />
                            Provenance Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        {medicine.history?.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex gap-4 relative">
                                {i < (medicine.history?.length || 0) - 1 && <div className="absolute left-2.5 top-5 w-0.5 h-full bg-primary/10"></div>}
                                <div className="h-5 w-5 rounded-full bg-primary/10 border-2 border-primary/20 z-10 flex items-center justify-center bg-background">
                                    <div className="h-1.5 w-1.5 bg-primary rounded-full"></div>
                                </div>
                                <div className="pb-4">
                                    <p className="text-xs font-black uppercase text-primary leading-none">{h.action}</p>
                                    <p className="text-[10px] text-muted-foreground font-medium mt-1">{new Date(h.timestamp).toLocaleDateString()}</p>
                                    <p className="text-[10px] font-bold mt-1 text-foreground/80">{h.changes}</p>
                                </div>
                            </div>
                        ))}
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest hover:bg-primary/5">Full Sequence Audit</Button>
                    </CardContent>
                </Card>
             ) : (
                <Card className="border-2 border-dashed border-muted bg-muted/5 rounded-[2rem]">
                    <CardContent className="p-12 text-center flex flex-col items-center gap-4">
                        <History className="h-10 w-10 text-muted-foreground opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Immutable History Locked</p>
                    </CardContent>
                </Card>
             )}
          </div>
        </div>
    </div>

    {medicine && (
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[{ ...medicine, id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 } as any]}
      />
    )}
    </>
  );
}
