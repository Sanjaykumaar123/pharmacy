"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserPlus, Loader2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signUpWithEmail } from "@/lib/firebase/auth";
import { motion } from "framer-motion";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const user = await signUpWithEmail({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });

      if (user) {
        toast({
          title: "Profile Initialized",
          description: "New node successfully registered to the network.",
        });
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      toast({
        variant: "destructive",
        title: "Initialization Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[size:30px_30px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-2 border-primary/10 bg-background/60 backdrop-blur-2xl shadow-2xl overflow-hidden rounded-[2.5rem]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardHeader className="text-center pt-10 pb-6">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-3xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
            >
              <UserPlus className="h-8 w-8 text-primary ml-1" />
            </motion.div>
            
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              Node Registration
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest mt-2 opacity-70">
              Initialize your identity on the PhamaTrack network
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Given Name</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Alan" 
                                className="h-14 rounded-2xl bg-muted/20 border-primary/10 focus-visible:ring-primary/30 px-5 font-medium"
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Surname</FormLabel>
                        <FormControl>
                            <Input 
                                placeholder="Turing" 
                                className="h-14 rounded-2xl bg-muted/20 border-primary/10 focus-visible:ring-primary/30 px-5 font-medium"
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Communication Link</FormLabel>
                        <FormControl>
                            <Input
                            type="email"
                            placeholder="operator@pharmatrack.io"
                            className="h-14 rounded-2xl bg-muted/20 border-primary/10 focus-visible:ring-primary/30 px-5 font-medium"
                            {...field}
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Passkey</FormLabel>
                        <FormControl>
                            <Input 
                                type="password" 
                                placeholder="••••••••••"
                                className="h-14 rounded-2xl bg-muted/20 border-primary/10 focus-visible:ring-primary/30 px-5 font-black text-lg tracking-widest mb-2"
                                {...field} 
                            />
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all group overflow-hidden relative mt-4" 
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" /> 
                            Initializing...
                        </>
                    ) : (
                        <>
                            Create Identity
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </span>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            Identity already registered?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors ml-1">
              Establish Session
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
