"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/hooks/useCartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Minus, Plus, ShoppingCart, Trash2, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { CheckoutDialog } from '@/components/CheckoutDialog';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const [isClient, setIsClient] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const total = isClient ? items.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
  const tax = total * 0.05; // 5% tax
  const finalTotal = total + tax;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckoutOpen(true);
  };

  if (!isClient) {
    return null;
  }
  
  return (
    <>
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-7xl space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Secure Transaction</Badge>
            <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                Your <span className="text-primary italic">Selection</span>
            </h1>
            <p className="text-muted-foreground mt-4 font-medium max-w-sm">Review your pharmaceutical order before finalizing the cryptographic transaction.</p>
        </motion.div>
        <Link href="/medicines" passHref>
            <Button variant="ghost" className="rounded-2xl h-14 px-8 font-black uppercase tracking-tighter hover:bg-primary/5 group transition-all">
                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                Back to Pharmacy
            </Button>
        </Link>
      </div>

      {items.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-2 border-dashed border-primary/20 bg-background/50 backdrop-blur-xl rounded-[3rem] overflow-hidden">
            <CardContent className="p-20 text-center">
                <div className="bg-primary/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                    <ShoppingCart className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Cart is Vacant</h3>
                <p className="text-muted-foreground mt-4 max-w-md mx-auto font-medium italic">Your digital basket contains zero authenticated batches. Begin your health journey today.</p>
                <Button asChild className="mt-10 h-14 px-10 rounded-2xl font-black uppercase tracking-tighter bg-primary shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                <Link href="/medicines">Initialize Shopping</Link>
                </Button>
            </CardContent>
            </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-background shadow-2xl overflow-hidden">
              <CardHeader className="p-8 border-b border-primary/5 bg-primary/5">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                    Batch Repository <span className="text-muted-foreground opacity-50 font-mono text-sm">[{items.length}]</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/10 h-14">
                    <TableRow className="hover:bg-transparent border-b border-primary/5">
                      <TableHead className="pl-8 font-black uppercase tracking-widest text-[10px]">Product Identity</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Market Val</TableHead>
                      <TableHead className="font-black uppercase tracking-widest text-[10px]">Dosage Count</TableHead>
                      <TableHead className="text-right pr-8 font-black uppercase tracking-widest text-[10px]">Net Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id} className="group hover:bg-primary/5 transition-colors border-b border-primary/5">
                        <TableCell className="pl-8 py-8">
                            <span className="text-lg font-black tracking-tighter uppercase group-hover:text-primary transition-colors">{item.name}</span>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-sm">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3 bg-muted/30 w-fit p-1 rounded-xl border border-primary/5">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-black text-xs">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 font-black text-lg tracking-tight">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell className="pr-8">
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-slate-950 text-white p-10 overflow-hidden relative shadow-2xl">
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20 animate-scan-fast"></div>
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]"></div>

              <CardHeader className="p-0 mb-10 relative z-10">
                <CardTitle className="text-2xl font-black uppercase tracking-tighter">Order Physics</CardTitle>
                <CardDescription className="text-[10px] uppercase font-black tracking-[0.2em] text-primary mt-2">Final Protocol Estimation</CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6 relative z-10">
                <div className="flex justify-between items-center text-sm font-bold opacity-60">
                  <span className="uppercase tracking-widest">SUB_TOTAL</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold opacity-60">
                  <span className="uppercase tracking-widest">NETWORK_GAS</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Grand_Total</span>
                  <span className="text-4xl font-black tracking-tighter">₹{finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-0 pt-10 flex flex-col gap-4 relative z-10">
                <Button size="lg" className="w-full h-16 rounded-2xl font-black uppercase tracking-tighter bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all" onClick={handleCheckout}>
                  Execute Acquisition
                  <CreditCard className="ml-3 h-5 w-5" />
                </Button>
                <div className="flex items-center justify-center gap-2 opacity-30 mt-2">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">SECURE_CHANNEL_ACTIVE</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
    <CheckoutDialog 
      isOpen={isCheckoutOpen}
      onClose={() => setIsCheckoutOpen(false)}
      items={items}
    />
    </>
  );
}
