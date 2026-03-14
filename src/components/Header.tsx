
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { LayoutDashboard, BrainCircuit, LogIn, UserPlus, LogOut, User, Factory, ShieldCheck, Loader2, Moon, Sun, ShoppingCart, Database, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { Badge } from './ui/badge';
import { useAuthStore } from '@/hooks/useAuthStore';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useWeb3Store } from '@/hooks/useWeb3';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const PillIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.337 2.012a9.75 9.75 0 0 0-9.325 9.325 9.75 9.75 0 0 0 9.325 9.325 9.75 9.75 0 0 0 9.325-9.325A9.75 9.75 0 0 0 12.337 2.012ZM11.25 8.637a.75.75 0 0 1 .75-.75h.75a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75h-3v3a.75.75 0 0 1-.75.75h-.75a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75v-.75a.75.75 0 0 1 .75-.75h3v-3Z" />
  </svg>
);

const roleConfig = {
    admin: {
        icon: ShieldCheck,
        dashboard: '/admin/dashboard',
        label: 'Admin'
    },
    manufacturer: {
        icon: Factory,
        dashboard: '/manufacturer/dashboard',
        label: 'Manufacturer'
    },
    customer: {
        icon: User,
        dashboard: '/customer/dashboard',
        label: 'Customer'
    }
}

function ThemeToggle() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light';
        setTheme(storedTheme);
        if (typeof window !== 'undefined') {
          document.documentElement.classList.toggle('dark', storedTheme === 'dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

function CartButton() {
    const { items } = useCartStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, [])

    const itemCount = isClient ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

    return (
        <Link href="/cart" passHref>
            <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">{itemCount}</Badge>
                )}
            </Button>
        </Link>
    )
}

function WalletConnectButton() {
    const { account, isConnected, connectWallet, disconnectWallet, balance, isSepolia, networkName } = useWeb3Store();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    if (isConnected && account) {
        return (
            <div className="flex items-center gap-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge 
                                variant={isSepolia ? "outline" : "destructive"} 
                                className={`hidden sm:flex items-center gap-1.5 px-3 py-1 border-2 transition-all duration-300 ${isSepolia ? 'border-primary/20 bg-primary/5 text-primary' : 'animate-pulse'}`}
                            >
                                <div className={`h-2 w-2 rounded-full ${isSepolia ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
                                <span className="font-bold text-[10px] tracking-tighter uppercase whitespace-nowrap">
                                    {isSepolia ? "Sepolia" : "Wrong Network"}
                                </span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p className="text-xs">{isSepolia ? "Connected to Verified Network" : `Switch to Sepolia (Connected to ${networkName || 'Unknown'})`}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="flex items-center rounded-xl bg-muted/30 border-2 border-primary/10 pl-3 pr-1 py-1 group hover:border-primary/30 transition-all shadow-sm backdrop-blur-md">
                    <div className="flex flex-col pr-3 border-r border-primary/10">
                        <span className="text-[10px] leading-tight text-muted-foreground font-bold uppercase tracking-tight">Balance</span>
                        <span className="text-xs font-black tracking-tighter text-foreground">
                            {balance ? parseFloat(balance).toFixed(4) : '0.000'} ETH
                        </span>
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={disconnectWallet} 
                        className="ml-2 h-9 px-3 flex items-center gap-2 font-mono text-xs font-bold bg-background/50 hover:bg-primary/10 text-primary border-0 rounded-lg group-hover:shadow-lg transition-all"
                    >
                        <Wallet className="h-3.5 w-3.5" />
                        {account.substring(0, 4)}...{account.substring(account.length - 4)}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <Button 
            variant="default" 
            size="sm" 
            onClick={connectWallet} 
            className="rounded-xl h-10 px-6 bg-gradient-to-r from-primary to-blue-600 hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold tracking-tight gap-2"
        >
           <Wallet className="h-4 w-4" /> Connect Wallet
        </Button>
    );
}


export default function Header() {
  const { user, loading, clearUser } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
        await signOutUser();
        clearUser();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out."
        })
        router.push('/login');
    } catch (error) {
        console.error("Logout failed:", error);
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "There was an error logging you out. Please try again."
        })
    }
  };

  const roleKey = user?.role as keyof typeof roleConfig;
  const currentRole = user ? roleConfig[roleKey] : null;
  const RoleIcon = currentRole?.icon;


  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <PillIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground font-headline hidden sm:inline-block">
              PharmaTrack Lite
            </span>
          </Link>

          <div className="flex items-center gap-2">
             <nav className="hidden md:flex items-center gap-2">
              <Link href="/dashboard" passHref>
                <Button variant="ghost">
                  <LayoutDashboard className="mr-2 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/medicines" passHref>
                <Button variant="ghost">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Pharmacy
                </Button>
              </Link>
              <Link href="/explorer" passHref>
                <Button variant="ghost">
                  <Database className="mr-2 h-5 w-5" />
                  Explorer
                </Button>
              </Link>
              <Link href="/chat" passHref>
                <Button variant="ghost">
                  <BrainCircuit className="mr-2 h-5 w-5" />
                  AI Assistant
                </Button>
              </Link>
            </nav>
            <div className="w-px h-6 bg-border mx-2 hidden md:block" />
            <div className="flex items-center gap-2">
                {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : user && currentRole && RoleIcon ? (
                     <>
                        <Link href={currentRole.dashboard} passHref>
                            <Button variant="outline">
                                <RoleIcon className="mr-2 h-5 w-5" />
                                {currentRole.label} Dashboard
                            </Button>
                        </Link>
                        <Button onClick={handleLogout}>
                            <LogOut className="mr-2 h-5 w-5" />
                            Logout
                        </Button>
                     </>
                ) : (
                    <>
                        <Link href="/login" passHref>
                            <Button variant="ghost">
                                <LogIn className="mr-2 h-5 w-5" />
                                Login
                            </Button>
                        </Link>
                        <Link href="/signup" passHref>
                            <Button>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}
                 <WalletConnectButton />
                 <CartButton />
                 <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
