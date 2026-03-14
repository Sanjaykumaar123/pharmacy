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
import { LogIn, Loader2, ShieldCheck, Factory, User, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmail, Role } from "@/lib/firebase/auth";
import { useAuthStore } from "@/hooks/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(["customer", "manufacturer", "admin"]),
});

type FormValues = z.infer<typeof formSchema>;

const roleOptions: { value: Role; label: string; icon: any; color: string; bg: string }[] = [
  { value: "customer", label: "Customer", icon: User, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50" },
  { value: "manufacturer", label: "Manufacturer", icon: Factory, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50" },
  { value: "admin", label: "Admin Node", icon: ShieldCheck, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20 hover:border-red-500/50" },
];

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "customer",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const user = await signInWithEmail(values.email, values.password, values.role as Role);
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email!,
          role: values.role as Role
        });

        toast({
          title: "Identity Verified",
          description: "Secure session established.",
        });

        // Redirect based on role
        if (values.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (values.role === 'manufacturer') {
          router.push('/manufacturer/dashboard');
        } else {
          router.push('/customer/dashboard');
        }
      }
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message || "Invalid credentials or authorization mismatch.",
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
              <LogIn className="h-8 w-8 text-primary" />
            </motion.div>
            
            <CardTitle className="text-3xl font-black uppercase tracking-tighter">
              System Access
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest mt-2 opacity-70">
              Authenticate to establish secure connection
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* ROLE SELECTION (Radio Cards) */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Select Node Type
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-3">
                          {roleOptions.map((opt) => {
                            const isSelected = field.value === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => field.onChange(opt.value)}
                                className={cn(
                                  "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300",
                                  isSelected ? cn(opt.bg, "scale-105 shadow-lg") : "bg-muted/30 border-transparent hover:bg-muted/50 text-muted-foreground scale-100 opacity-60 hover:opacity-100"
                                )}
                              >
                                <opt.icon className={cn("h-5 w-5", isSelected && opt.color)} />
                                <span className={cn("text-[9px] font-black uppercase tracking-widest", isSelected && opt.color)}>{opt.label.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Connection</FormLabel>
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
                            className="h-14 rounded-2xl bg-muted/20 border-primary/10 focus-visible:ring-primary/30 px-5 font-black text-lg tracking-widest"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)] transition-all group overflow-hidden relative" 
                  disabled={isLoading}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin h-5 w-5" /> 
                            Authenticating...
                        </>
                    ) : (
                        <>
                            Initialize Session
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
            Unregistered entity?{" "}
            <Link href="/signup" className="text-primary hover:text-primary/80 transition-colors ml-1">
              Initialize Profile
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
