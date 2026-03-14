"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Medicine } from '@/types/medicine';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/hooks/useCartStore';
import { useToast } from '@/hooks/use-toast';
import { CheckoutDialog } from './CheckoutDialog';

// 🔥 IMPORT AUTH + ROUTER
import { useAuthStore } from "@/hooks/useAuthStore";
import { useRouter } from "next/navigation";

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  const isOutOfStock = medicine.stockStatus === 'Out of Stock';
  const { addItem } = useCartStore();
  const { toast } = useToast();
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // 🔥 AUTH + ROUTER
  const { user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔒 If not logged in → redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    addItem({ id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 });
    toast({
      title: "Added to Cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 🔒 If not logged in → redirect to login
    if (!user) {
      router.push("/login");
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <>
    <Card className={cn(
      "h-full flex flex-col transition-all duration-500 ease-out group relative overflow-hidden",
      "border-2 border-primary/5 bg-background/50 backdrop-blur-xl rounded-[2rem]",
      "hover:border-primary/40 hover:shadow-[0_0_40px_rgba(var(--primary-rgb),0.15)] hover:-translate-y-2",
      isOutOfStock && "opacity-60 saturate-50 grayscale-[0.3]"
    )}>
      {/* Decorative Gradient Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

      <CardHeader className="p-6 pb-2">
        <Link href={`/medicine/${medicine.id}`} className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors leading-none">
                  {medicine.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        Batch: {medicine.batchNo}
                    </span>
                </div>
              </div>
              <Badge className={cn(
                  "shrink-0 border-2 font-black text-[9px] uppercase px-2 py-0.5 rounded-lg shadow-sm transition-all duration-500", 
                  medicine.onChain 
                    ? "bg-green-500/10 text-green-500 border-green-500/20 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]" 
                    : "bg-muted text-muted-foreground border-muted"
                )}>
                  {medicine.onChain ? <ShieldCheck className="h-3 w-3 mr-1" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground mr-1.5" />}
                  {medicine.onChain ? 'Verified' : 'Local'}
              </Badge>
            </div>
        </Link>
      </CardHeader>
      
      <CardContent className="p-6 pt-2 flex-grow">
          <Link href={`/medicine/${medicine.id}`} className="block space-y-4">
              <div className="flex items-baseline gap-1">
                 <span className="text-sm font-bold opacity-40">₹</span>
                 <span className="text-4xl font-black tracking-tighter text-foreground">{medicine.price.toFixed(0)}</span>
                 <span className="text-sm font-bold opacity-40">.{medicine.price.toFixed(2).split('.')[1]}</span>
              </div>
              
              <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground border-b border-primary/5 pb-2">
                      <span>Inventory</span>
                      <span className={cn(
                          "transition-colors",
                          medicine.stockStatus === 'In Stock' && 'text-green-500',
                          medicine.stockStatus === 'Low Stock' && 'text-amber-500',
                          medicine.stockStatus === 'Out of Stock' && 'text-red-500'
                      )}>{medicine.quantity} UNITS</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest text-muted-foreground">
                      <span>Status</span>
                      <span className={cn(
                          "transition-colors",
                          medicine.stockStatus === 'In Stock' && 'text-green-500',
                          medicine.stockStatus === 'Low Stock' && 'text-amber-500',
                          medicine.stockStatus === 'Out of Stock' && 'text-red-500'
                      )}>{medicine.stockStatus}</span>
                  </div>
              </div>
          </Link>

          {medicine.onChain && medicine.txHash && (
             <a 
               href={`https://sepolia.etherscan.io/tx/${medicine.txHash}`} 
               target="_blank" 
               rel="noopener noreferrer"
               className="mt-6 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/5 border border-primary/10 text-[9px] font-black text-primary/70 hover:text-primary hover:bg-primary/10 transition-all uppercase tracking-widest"
               onClick={(e) => e.stopPropagation()}
             >
                <ExternalLink className="h-3 w-3" /> Etherscan Ledger
             </a>
          )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAddToCart} 
            size="lg" 
            variant="ghost" 
            className="w-full rounded-xl font-black uppercase tracking-tighter text-[11px] h-12 border border-primary/10 hover:bg-primary/5" 
            disabled={isOutOfStock}
          >
              <ShoppingCart className="mr-2 h-4 w-4"/> Add to Cart
          </Button>
          <Button 
            onClick={handleBuyNow} 
            size="lg" 
            className="w-full rounded-xl font-black uppercase tracking-tighter text-[11px] h-12 bg-foreground text-background shadow-xl hover:scale-[1.02] active:scale-95 transition-all" 
            disabled={isOutOfStock}
          >
              Acquire
          </Button>
      </CardFooter>
    </Card>

    <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[{ ...medicine, quantity: 1 }]}
      />
    </>
  );
}
