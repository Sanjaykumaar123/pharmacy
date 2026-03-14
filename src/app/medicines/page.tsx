"use client";

import { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertCircle, Plus, LayoutGrid, List, ArrowUpDown, Edit, Database, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import type { Medicine } from '@/types/medicine';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { MedicineCard } from '@/components/MedicineCard';
import { isBefore, addDays, parseISO, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 12;

type SortKey = keyof Medicine | '';
type SortOrder = 'asc' | 'desc';

function MedicinesPageContent() {
  const { medicines, error, isInitialized } = useMedicineStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const filteredMedicines = useMemo(() => {
    if (!medicines) return [];
    
    let result = medicines.filter((med) => {
      const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            med.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    if (sortKey) {
      result = result.sort((a, b) => {
        const valA = a[sortKey] ?? '';
        const valB = b[sortKey] ?? '';
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [searchTerm, medicines, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredMedicines.length / ITEMS_PER_PAGE);
  const paginatedMedicines = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      return filteredMedicines.slice(startIndex, endIndex);
  }, [currentPage, filteredMedicines]);

  useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, sortKey, sortOrder]);


  if (!isInitialized) {
      return (
          <div className="flex h-[80vh] flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Synchronizing Global Inventory...</p>
          </div>
      )
  }

  if (error) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Alert variant="destructive" className="rounded-2xl border-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-black uppercase tracking-tight">Access Error</AlertTitle>
                <AlertDescription className="font-medium italic">{error}</AlertDescription>
            </Alert>
        </div>
    )
  }

  const isExpiringSoon = (dateStr: string) => {
    try {
      const expDate = parseISO(dateStr);
      const thirtyDaysFromNow = addDays(new Date(), 30);
      return isBefore(expDate, thirtyDaysFromNow);
    } catch {
      return false;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 space-y-12 max-w-7xl">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Badge variant="outline" className="mb-4 border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Distributed Ledger Assets</Badge>
                <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                    Digital <span className="text-primary italic">Pharmacy</span>
                </h1>
                <p className="text-muted-foreground mt-4 font-medium max-w-sm">
                    Access real-time inventory authenticated by multi-node consensus. Every batch is cryptographically secured.
                </p>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative group w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                    <Input
                        type="text"
                        placeholder="Scan ledger by name/batch..."
                        className="w-full h-14 pl-12 pr-4 bg-muted/30 border-2 border-primary/5 focus:border-primary/40 rounded-2xl font-bold transition-all placeholder:font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-muted/30 p-1.5 rounded-2xl border-2 border-primary/5 shrink-0 h-14">
                    <Button 
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-full w-12 rounded-xl"
                        onClick={() => setViewMode('grid')}
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Button>
                    <Button 
                        variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                        size="icon" 
                        className="h-full w-12 rounded-xl"
                        onClick={() => setViewMode('table')}
                    >
                        <List className="h-5 w-5" />
                    </Button>
                </div>
            </div>
      </div>
      
      <AnimatePresence mode="wait">
        {filteredMedicines.length > 0 ? (
          viewMode === 'table' ? (
            <motion.div 
                key="table"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="overflow-hidden rounded-[2.5rem] border-2 border-primary/5 shadow-2xl bg-background/50 backdrop-blur-xl"
            >
              <Table>
                <TableHeader className="bg-primary/5">
                  <TableRow className="hover:bg-transparent border-b-2 border-primary/5">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-8 py-5 text-primary cursor-pointer" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">Identity <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary cursor-pointer" onClick={() => handleSort('batchNo')}>
                      <div className="flex items-center gap-1">Protocol Tag <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary cursor-pointer" onClick={() => handleSort('quantity')}>
                      <div className="flex items-center gap-1">Inventory <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary cursor-pointer" onClick={() => handleSort('price')}>
                      <div className="flex items-center gap-1">Market Val <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary cursor-pointer" onClick={() => handleSort('expDate')}>
                      <div className="flex items-center gap-1">Termination <ArrowUpDown className="h-3 w-3" /></div>
                    </TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-primary text-right px-8">Audit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMedicines.map((med: Medicine) => {
                    const dyingSoon = isExpiringSoon(med.expDate);
                    return (
                      <TableRow key={med.id} className="hover:bg-primary/5 transition-all group border-b border-primary/5">
                        <TableCell className="px-8 py-5">
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-foreground text-sm">{med.name}</span>
                                {med.onChain && (
                                    <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse" title="Secured On-Chain"></div>
                                )}
                            </div>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground font-mono font-black tracking-widest uppercase">{med.batchNo}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                              "font-black uppercase text-[9px] px-2 py-0.5 rounded-md",
                              med.quantity < 20 ? "border-red-500/30 text-red-500 bg-red-500/5" : "border-green-500/30 text-green-500 bg-green-500/5"
                          )}>
                            {med.quantity} Units
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono font-bold text-xs">₹{med.price.toFixed(2)}</TableCell>
                        <TableCell>
                           <span className={cn(
                               "text-[10px] font-black uppercase tracking-tighter",
                               dyingSoon ? "text-red-500" : "text-muted-foreground"
                           )}>
                               {format(parseISO(med.expDate), 'MMM yyyy')}
                           </span>
                        </TableCell>
                        <TableCell className="text-right px-8">
                           <Link href={`/medicine/${med.id}`}>
                              <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl font-black uppercase tracking-tighter text-[10px] hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100">
                                 Deep Scan <ArrowRight className="ml-2 h-3 w-3" />
                              </Button>
                           </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </motion.div>
          ) : (
            <motion.div 
                key="grid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
                {paginatedMedicines.map((med: Medicine, idx: number) => (
                    <motion.div 
                        key={med.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <MedicineCard medicine={med} />
                    </motion.div>
                ))}
            </motion.div>
          )
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 px-6 bg-background/50 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-primary/20"
          >
            <div className="bg-primary/5 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
               <Database className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">Zero Nodes Found</h3>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto font-medium italic">
                No pharmaceutical records match your cryptographic query. Adjust your search parameters or synchronize your node.
            </p>
            <Button onClick={() => setSearchTerm('')} variant="outline" className="mt-8 rounded-xl font-black uppercase tracking-widest text-[10px] border-2">Clear Filter</Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-8 border-t border-primary/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
               Index: <span className="text-foreground">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}—{Math.min(currentPage * ITEMS_PER_PAGE, filteredMedicines.length)}</span> / {filteredMedicines.length} NODES
            </p>
            <div className="flex gap-4 items-center">
                <Button 
                    variant="outline" size="sm"
                    className="h-12 px-6 rounded-xl border-2 border-primary/5 font-black uppercase tracking-tighter text-[10px] active:scale-95 transition-all"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <div className="flex items-center px-4 font-black uppercase tracking-tighter text-xs">
                   {currentPage} / {totalPages}
                </div>
                <Button 
                    variant="outline" size="sm"
                    className="h-12 px-6 rounded-xl border-2 border-primary/5 font-black uppercase tracking-tighter text-[10px] active:scale-95 transition-all"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen flex-col items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-primary" /><p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Initial Consensus...</p></div>}>
      <MedicinesPageContent />
    </Suspense>
  )
}
