"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PackagePlus, ArrowLeft, Loader2, Sparkles, ShieldCheck, Zap, Globe, ClipboardCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useMedicineStore } from '@/hooks/useMedicineStore';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import type { NewMedicine } from '@/types/medicine';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  manufacturer: z.string().min(2, { message: 'Manufacturer must be at least 2 characters.' }),
  batchNo: z.string().min(1, { message: 'Batch number is required.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  mfgDate: z.date({ required_error: 'A manufacturing date is required.' }),
  expDate: z.date({ required_error: 'An expiry date is required.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantity cannot be negative.' }),
  price: z.coerce.number().min(0, { message: 'Price cannot be negative.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddMedicinePage() {
  const router = useRouter();
  const { addMedicine, loading } = useMedicineStore();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      manufacturer: '',
      batchNo: '',
      description: '',
      mfgDate: new Date(),
      expDate: new Date(Date.now() + 31536000000), // +1 year
      quantity: 0,
      price: 0,
    },
  });

  const onSubmit = async (values: FormValues) => {
    const newMedicine: NewMedicine = {
        ...values,
        mfgDate: format(values.mfgDate, 'yyyy-MM-dd'),
        expDate: format(values.expDate, 'yyyy-MM-dd'),
    };
    
    const created = await addMedicine(newMedicine);

    if(created) {
      toast({
        title: 'Batch Registered Locally',
        description: `${created.name} has been submitted for cryptographic anchoring and admin approval.`,
      });
      router.push('/manufacturer/dashboard');
    } else {
        toast({
            variant: "destructive",
            title: 'Registration Failed',
            description: `Verify your network connection and retry.`,
        });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-5xl space-y-12">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <Link href="/manufacturer/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group">
                   <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Return to Command Center</span>
                </Link>
                <div className="flex items-center gap-4 mb-2">
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1">Direct Node Submit v3.0</Badge>
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/20 text-[10px] font-black uppercase tracking-widest px-3 py-1">Local Ledger Mode</Badge>
                </div>
                <h1 className="text-5xl font-black tracking-tighter text-foreground font-headline uppercase leading-none">
                    Register <span className="text-primary italic">Batch</span>
                </h1>
                <p className="text-muted-foreground mt-4 font-medium max-w-md">
                    Manufacturers provide the batch data. An administrator will review and cryptographically anchor this to the blockchain.
                </p>
            </motion.div>
        </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-primary/10 bg-background/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Globe className="h-40 w-40 text-primary" />
            </div>
          <CardHeader className="p-10 pb-4 border-b border-primary/5 bg-primary/5">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                    <PackagePlus className="h-6 w-6" />
                </div>
                <div>
                   <CardTitle className="text-2xl font-black uppercase tracking-tighter">Batch Information</CardTitle>
                   <CardDescription className="font-medium italic">Define the details of the produced medicine batch.</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medicine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Paracetamol 500mg" {...field} className="h-14 rounded-2xl bg-muted/30 border-2 border-primary/5 focus:border-primary/40 transition-all font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Manufacturing Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Pharma Inc." {...field} className="h-14 rounded-2xl bg-muted/30 border-2 border-primary/5 focus:border-primary/40 transition-all font-bold" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Product Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Define batch composition and storage instructions..." {...field} className="min-h-[120px] rounded-2xl bg-muted/30 border-2 border-primary/5 focus:border-primary/40 transition-all font-medium leading-relaxed" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 p-8 rounded-[2rem] bg-muted/20 border-2 border-primary/5">
                    <FormField
                      control={form.control}
                      name="batchNo"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Batch Number</FormLabel>
                          <FormControl>
                              <Input placeholder="BATCH-6782-2026" {...field} className="h-14 rounded-xl bg-background border-2 border-primary/10 font-mono font-bold tracking-tighter" />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">Unit Count</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="0" {...field} className="h-14 rounded-xl bg-background border-2 border-primary/10 font-black" />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase tracking-widest text-primary">MRP (₹)</FormLabel>
                          <FormControl>
                              <Input type="number" placeholder="0.00" {...field} className="h-14 rounded-xl bg-background border-2 border-primary/10 font-black" />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormField
                    control={form.control}
                    name="mfgDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Manufacturing Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-14 rounded-2xl bg-muted/30 border-2 border-primary/5 text-left font-bold pl-5",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Select Date</span>}
                                <CalendarIcon className="ml-auto h-5 w-5 opacity-40" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Expiry Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "h-14 rounded-2xl bg-muted/30 border-2 border-primary/5 text-left font-bold pl-5",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? format(field.value, "PPP") : <span>Select Date</span>}
                                <CalendarIcon className="ml-auto h-5 w-5 opacity-40" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden border-2 border-primary/10 shadow-2xl" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-10 flex flex-col sm:flex-row justify-end gap-6 border-t border-primary/5">
                   <Link href="/manufacturer/dashboard" className="w-full sm:w-auto order-2 sm:order-1">
                      <Button type="button" variant="ghost" className="w-full h-16 px-10 rounded-[1.5rem] font-black uppercase tracking-tighter text-sm">
                          Cancel
                      </Button>
                   </Link>
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className={cn(
                        "w-full sm:w-auto h-16 px-12 rounded-[1.5rem] font-black uppercase tracking-tighter text-sm transition-all active:scale-95 shadow-2xl order-1 sm:order-2 bg-gradient-to-br from-primary to-blue-600 shadow-primary/20 hover:shadow-primary/40"
                    )}
                  >
                    {loading ? (
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    ) : (
                       <ClipboardCheck className="mr-3 h-6 w-6" />
                    )}
                    {loading ? "Submitting..." : "Submit for Approval"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
