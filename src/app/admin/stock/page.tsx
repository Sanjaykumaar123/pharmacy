"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Loader2,
  CheckCircle,
  Clock,
  PackageCheck,
  AlertTriangle,
  PackageX,
  Factory,
  Truck,
  Building,
  PlusCircle,
  Pencil,
  ThumbsUp,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  Trash2,
  Search,
  Filter
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import type {
  Medicine,
  SupplyChainStatus,
  ListingStatus,
} from "@/types/medicine";

import { cn } from "@/lib/utils";
import { useMedicineStore } from "@/hooks/useMedicineStore";
import { AddEditMedicineDialog } from "@/components/AddEditMedicineDialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type SortKey = keyof Pick<
  Medicine,
  "name" | "manufacturer" | "expDate" | "quantity" | "supplyChainStatus"
>;

const chartConfig = {
  quantity: { label: "Quantity", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

const statusConfig: Record<
  StockStatus,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "In Stock": { icon: PackageCheck, color: "text-green-600", bg: "bg-green-500/10" },
  "Low Stock": { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  "Out of Stock": { icon: PackageX, color: "text-red-600", bg: "bg-red-500/10" },
};

const supplyChainStatusConfig: Record<
  SupplyChainStatus,
  { icon: React.ElementType; label: string }
> = {
  "At Manufacturer": { icon: Factory, label: "Manufacturer" },
  "In Transit": { icon: Truck, label: "Transit" },
  "At Pharmacy": { icon: Building, label: "Pharmacy" },
};

const listingStatusConfig: Record<
  ListingStatus,
  { icon: React.ElementType; label: string; color: string }
> = {
  Pending: {
    icon: Clock,
    label: "Pending",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  Approved: {
    icon: CheckCircle,
    label: "Approved",
    color: "bg-green-500/10 text-green-600 border-green-500/20",
  },
};

const getUIStockStatus = (qty: number): StockStatus => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 50) return "Low Stock";
  return "In Stock";
};

export default function StockManagementPage() {
  const { medicines, isInitialized, anchorMedicineToBlockchain, deleteMedicine } = useMedicineStore();
  const { toast } = useToast();
  const [isAnchoring, setIsAnchoring] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [filter, setFilter] = useState<StockStatus | "All">("All");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  const summary = useMemo(() => {
    return medicines.reduce(
      (acc, med) => {
        const qty = Number(med.quantity || 0);
        const status = getUIStockStatus(qty);
        acc[status]++;
        acc.Total++;
        return acc;
      },
      { "In Stock": 0, "Low Stock": 0, "Out of Stock": 0, Total: 0 }
    );
  }, [medicines]);

  const sortedAndFilteredMedicines = useMemo(() => {
    let filtered = medicines.filter((med) => {
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           med.batchNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const qty = Number(med.quantity || 0);
      const status = getUIStockStatus(qty);
      const matchesFilter = filter === "All" || status === filter;
      
      return matchesSearch && matchesFilter;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortConfig.key === "quantity") {
          aValue = a.quantity;
          bValue = b.quantity;
        } else if (sortConfig.key === "expDate") {
          aValue = new Date(a.expDate).getTime();
          bValue = new Date(b.expDate).getTime();
        } else {
          aValue = (a[sortConfig.key] as string | undefined)?.toLowerCase() || "";
          bValue = (b[sortConfig.key] as string | undefined)?.toLowerCase() || "";
        }

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [medicines, filter, sortConfig, searchQuery]);

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowUp className="h-3 w-3 opacity-20" />;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-3 w-3 text-primary" />
    ) : (
      <ArrowDown className="h-3 w-3 text-primary" />
    );
  };

  const chartData = useMemo(() => {
    return medicines
      .filter((med) => med.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 8)
      .map((med) => ({
        name: med.name,
        quantity: med.quantity,
      }));
  }, [medicines]);

  const handleAddClick = () => {
    setSelectedMedicine(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsDialogOpen(true);
  };

  const handleAnchorClick = async (medicine: Medicine) => {
    setIsAnchoring(medicine.id);
    const success = await anchorMedicineToBlockchain(medicine.id);
    setIsAnchoring(null);

    if (success) {
      toast({ title: "Anchored Successfully", description: `${medicine.name} is secured on Ethereum.` });
    } else {
      toast({ variant: "destructive", title: "Anchoring Failed", description: "Check your wallet connection." });
    }
  };

  const handleDeleteClick = async (id: string) => {
      if(confirm("Are you sure you want to delete this batch from the ledger?")) {
          const success = await deleteMedicine(id);
          if(success) {
              toast({ title: "Batch Removed", description: "Medicine data deleted from the system." });
          } else {
              toast({ variant: "destructive", title: "Delete Failed", description: "Database error occurred." });
          }
      }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-xl font-bold tracking-tight uppercase italic opacity-50">Syncing System Logs...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-12 max-w-7xl space-y-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest px-3">Inventory Node</Badge>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <h1 className="text-5xl font-black tracking-tighter sm:text-6xl uppercase leading-none">
              Stock <span className="text-primary italic">Vault</span>
            </h1>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
            <Button onClick={handleAddClick} className="h-14 px-8 rounded-2xl font-black uppercase tracking-tighter bg-primary shadow-xl shadow-primary/20 flex-1 lg:flex-none">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Entry
            </Button>
            <Link href="/admin/dashboard" passHref>
              <Button variant="outline" className="h-14 px-8 rounded-2xl font-black uppercase tracking-tighter border-2">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* SUMMARY TILES */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => setFilter("All")}>
            <Card className={cn("rounded-[2rem] border-2 transition-all overflow-hidden", filter === "All" ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-primary/5")}>
                <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Global Total</span>
                    <PackageCheck className="h-5 w-5 opacity-20" />
                </CardHeader>
                <CardContent className="p-6 pt-0">
                    <div className="text-4xl font-black tracking-tighter leading-none">{summary.Total}</div>
                    <p className="text-[10px] font-bold text-muted-foreground mt-2 uppercase italic">Active SKU Count</p>
                </CardContent>
            </Card>
          </motion.div>

          {(["In Stock", "Low Stock", "Out of Stock"] as StockStatus[]).map((status) => {
            const count = summary[status];
            const cfg = statusConfig[status];
            return (
                <motion.div key={status} whileHover={{ y: -5 }} className="cursor-pointer" onClick={() => setFilter(status)}>
                    <Card className={cn("rounded-[2rem] border-2 transition-all overflow-hidden", filter === status ? "border-primary bg-primary/5 shadow-2xl shadow-primary/10" : "border-primary/5")}>
                        <CardHeader className="flex flex-row items-center justify-between p-6 pb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{status}</span>
                            <cfg.icon className={cn("h-5 w-5", cfg.color)} />
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                            <div className="text-4xl font-black tracking-tighter leading-none">{count}</div>
                            <div className={cn("h-1 w-full rounded-full mt-4 bg-muted overflow-hidden")}>
                                <div className={cn("h-full", cfg.color.replace('text-', 'bg-'))} style={{ width: `${(count/summary.Total)*100}%` }}></div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            );
          })}
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* LISTING */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search Batch ID or Medicine Name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-muted/30 border-2 border-primary/5 focus:border-primary/30 transition-all font-bold"
                    />
                </div>
                <Button variant="outline" className="h-14 px-6 rounded-2xl border-2 flex gap-2 font-black uppercase tracking-tighter">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-background shadow-2xl overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-b border-primary/5 h-16">
                      <TableHead className="pl-8">
                        <Button variant="ghost" onClick={() => requestSort("name")} className="font-black uppercase tracking-widest text-[10px] p-0 hover:bg-transparent">
                          Medicine {getSortIcon("name")}
                        </Button>
                      </TableHead>
                      <TableHead>
                         <span className="font-black uppercase tracking-widest text-[10px]">Supply Chain</span>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button variant="ghost" onClick={() => requestSort("quantity")} className="font-black uppercase tracking-widest text-[10px] p-0 hover:bg-transparent">
                          Qty {getSortIcon("quantity")}
                        </Button>
                      </TableHead>
                      <TableHead className="text-center">
                         <span className="font-black uppercase tracking-widest text-[10px]">Ledger Status</span>
                      </TableHead>
                      <TableHead className="pr-8 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                        {sortedAndFilteredMedicines.map((med) => {
                        const supplyChain = supplyChainStatusConfig[med.supplyChainStatus];
                        const listing = listingStatusConfig[med.listingStatus || "Pending"];

                        return (
                            <motion.tr 
                                key={med.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group border-b border-primary/5 hover:bg-primary/5 transition-colors cursor-default"
                            >
                            <TableCell className="pl-8 py-6">
                                <div className="flex flex-col">
                                    <span className="text-base font-black tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{med.name}</span>
                                    <span className="text-[10px] font-mono text-muted-foreground font-bold">{med.batchNo}</span>
                                </div>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-background border border-primary/10 flex items-center justify-center">
                                        <supplyChain.icon className="h-4 w-4 text-primary/60" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-tighter opacity-70">{supplyChain.label}</span>
                                </div>
                            </TableCell>

                            <TableCell className="text-right font-black text-lg tracking-tight pr-10">
                                {med.quantity}
                            </TableCell>

                            <TableCell>
                                <div className="flex flex-col items-center gap-1.5">
                                    <Badge variant="outline" className={cn(listing.color, "font-black uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-md")}>
                                        {listing.label}
                                    </Badge>
                                    {med.onChain ? (
                                        <Badge variant="outline" className="text-[8px] font-black border-green-500/20 text-green-600 bg-green-500/5 px-2">
                                            VERIFIED
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-[8px] font-black border-amber-500/20 text-amber-600 bg-amber-500/5 px-2">
                                            NOT ANCHORED
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>

                            <TableCell className="pr-8 text-right">
                                <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10 transition-colors">
                                    <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="p-2 rounded-2xl border-2 border-primary/5 bg-background shadow-2xl min-w-[180px]">
                                    <DropdownMenuItem onClick={() => handleEditClick(med)} className="rounded-xl flex gap-2 font-bold py-3">
                                        <Pencil className="h-4 w-4 text-blue-500" /> Modify Record
                                    </DropdownMenuItem>
                                    
                                    {!med.onChain && (
                                    <>
                                        <DropdownMenuItem onClick={() => handleAnchorClick(med)} disabled={isAnchoring === med.id} className="rounded-xl flex gap-2 font-bold py-3 text-primary">
                                            {isAnchoring === med.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <LinkIcon className="h-4 w-4" />}
                                            Anchor to Blockchain
                                        </DropdownMenuItem>
                                    </>
                                    )}
                                    <DropdownMenuSeparator className="bg-primary/5" />
                                    <DropdownMenuItem onClick={() => handleDeleteClick(med.id)} className="rounded-xl flex gap-2 font-bold py-3 text-red-500 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" /> Purge Records
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                            </motion.tr>
                        );
                        })}
                    </AnimatePresence>
                  </TableBody>
                </Table>
            </Card>
          </div>

          {/* SIDEBAR ANALYTICS */}
          <div className="lg:col-span-4 space-y-8">
            <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-slate-950 text-white overflow-hidden p-8 shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="h-20 w-20 text-primary" />
                </div>
                <CardHeader className="p-0 mb-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Real-time Metrics</p>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter">Inventory Flux</CardTitle>
                </CardHeader>
                <div className="h-[200px] w-full">
                    <ChartContainer config={chartConfig}>
                        <BarChart data={chartData}>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="name" hide />
                            <Tooltip content={() => null} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                            <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ChartContainer>
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Avg. Stock</span>
                        <p className="text-xl font-black mt-1">124u</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Turnover</span>
                        <p className="text-xl font-black mt-1">82%</p>
                    </div>
                </div>
            </Card>

            <Card className="rounded-[2.5rem] border-2 border-primary/5 bg-background p-8 overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-slate-100/[0.03] bg-[size:20px_20px]"></div>
                <div className="relative z-10 flex flex-col items-center text-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border-2 border-primary/20">
                        <ShieldCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-lg font-black uppercase tracking-tighter">Ledger Health</p>
                        <p className="text-xs font-medium text-muted-foreground mt-1 underline decoration-primary decoration-2 underline-offset-4 tracking-widest">SYSTEM_STATE: OPERATIONAL</p>
                    </div>
                </div>
            </Card>
          </div>
        </div>
      

      <AddEditMedicineDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        medicine={selectedMedicine}
      />
    </div>
  );
}
