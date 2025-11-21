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
  ChartTooltip,
  ChartTooltipContent,
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

type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";
type SortKey = keyof Pick<
  Medicine,
  "name" | "manufacturer" | "expDate" | "quantity" | "supplyChainStatus"
>;

const chartConfig = {
  quantity: { label: "Quantity", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

/* ----------------------------------
   STATUS ICON CONFIG
---------------------------------- */
const statusConfig: Record<
  StockStatus,
  { icon: React.ElementType; color: string; badge: string }
> = {
  "In Stock": { icon: PackageCheck, color: "text-green-600", badge: "secondary" },
  "Low Stock": { icon: AlertTriangle, color: "text-yellow-500", badge: "secondary" },
  "Out of Stock": { icon: PackageX, color: "text-red-600", badge: "destructive" },
};

const supplyChainStatusConfig: Record<
  SupplyChainStatus,
  { icon: React.ElementType; label: string }
> = {
  "At Manufacturer": { icon: Factory, label: "At Manufacturer" },
  "In Transit": { icon: Truck, label: "In Transit" },
  "At Pharmacy": { icon: Building, label: "At Pharmacy" },
};

const listingStatusConfig: Record<
  ListingStatus,
  { icon: React.ElementType; label: string; color: string }
> = {
  Pending: {
    icon: Clock,
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  Approved: {
    icon: CheckCircle,
    label: "Approved",
    color: "bg-green-100 text-green-800 border-green-200",
  },
};

/* ----------------------------------
   UI STOCK STATUS LOGIC (Correct)
---------------------------------- */
const getUIStockStatus = (qty: number): StockStatus => {
  if (qty <= 0) return "Out of Stock";
  if (qty <= 50) return "Low Stock";
  return "In Stock";
};

export default function StockManagementPage() {
  const { medicines, isInitialized, approveMedicine } = useMedicineStore();
  const { toast } = useToast();

  const [filter, setFilter] = useState<StockStatus | "All">("All");
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    direction: "ascending" | "descending";
  } | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

  /* ----------------------------------
     FIXED SUMMARY
  ---------------------------------- */
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

  /* ----------------------------------
     FIXED FILTERING
  ---------------------------------- */
  const sortedAndFilteredMedicines = useMemo(() => {
    let filtered = medicines.filter((med) => {
      const qty = Number(med.quantity || 0);
      const status = getUIStockStatus(qty);

      if (filter === "All") return true;
      return status === filter;
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
          aValue =
            (a[sortConfig.key] as string | undefined)?.toLowerCase() || "";
          bValue =
            (b[sortConfig.key] as string | undefined)?.toLowerCase() || "";
        }

        if (aValue < bValue)
          return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue)
          return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [medicines, filter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";

    if (sortConfig?.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === "ascending" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  /* ----------------------------------
     CHART DATA
  ---------------------------------- */
  const chartData = useMemo(() => {
    return medicines
      .filter((med) => med.quantity > 0)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
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

  const handleApproveClick = async (medicine: Medicine) => {
    const approved = await approveMedicine(medicine.id);

    if (approved) {
      toast({
        title: "Medicine Approved",
        description: `${medicine.name} is now approved.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: "There was an error approving the medicine.",
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading Inventory...</p>
      </div>
    );
  }

  /* ----------------------------------
     PAGE RENDER
  ---------------------------------- */
  return (
    <>
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stock Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Oversee the entire inventory and manage medicine lifecycle.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button onClick={handleAddClick}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Add New Medicine
            </Button>

            <Link href="/admin/dashboard" passHref>
              <Button variant="outline">
                <Home className="mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card
            onClick={() => setFilter("All")}
            className={cn(
              "cursor-pointer",
              filter === "All" && "ring-2 ring-primary"
            )}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Medicines
              </CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.Total}</div>
            </CardContent>
          </Card>

          {/* In Stock / Low Stock / Out of Stock */}
          {(["In Stock", "Low Stock", "Out of Stock"] as StockStatus[]).map(
            (status) => {
              const count = summary[status];
              const Icon = statusConfig[status].icon;

              return (
                <Card
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "cursor-pointer",
                    filter === status && "ring-2 ring-primary"
                  )}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {status}
                    </CardTitle>
                    <Icon
                      className={cn(
                        "h-4 w-4 text-muted-foreground",
                        statusConfig[status].color
                      )}
                    />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* TABLE */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
              <CardDescription>
                All medicines listed in the system.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("name")}
                        >
                          Name {getSortIcon("name")}
                        </Button>
                      </TableHead>

                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("supplyChainStatus")}
                        >
                          Supply Chain {getSortIcon("supplyChainStatus")}
                        </Button>
                      </TableHead>

                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          onClick={() => requestSort("quantity")}
                        >
                          Quantity {getSortIcon("quantity")}
                        </Button>
                      </TableHead>

                      <TableHead>Approval</TableHead>

                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {sortedAndFilteredMedicines.map((med) => {
                      const qty = Number(med.quantity || 0);
                      const supplyChain = supplyChainStatusConfig[
                        med.supplyChainStatus
                      ];

                      const stockStatus = getUIStockStatus(qty);
                      const listing = listingStatusConfig[med.listingStatus || "Pending"];

                      return (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">
                            {med.name}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <supplyChain.icon className="h-4 w-4 text-muted-foreground" />
                              <span>{supplyChain.label}</span>
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            {med.quantity}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={listing.color}
                            >
                              <listing.icon className="h-3 w-3 mr-1" />
                              {listing.label}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => setSelectedMedicine(med)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>

                                {listing.label === "Pending" && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                      onClick={() => handleApproveClick(med)}
                                      className="text-green-600"
                                    >
                                      <ThumbsUp className="mr-2 h-4 w-4" />
                                      Approve
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* ANALYTICS */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Stock Analytics</CardTitle>
              <CardDescription>Top stocked medicines.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px]">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 10, bottom: 10 }}
                >
                  <CartesianGrid horizontal={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={110}
                    interval={0}
                    className="text-xs"
                  />
                  <XAxis dataKey="quantity" type="number" hide />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="quantity"
                    fill="hsl(var(--primary))"
                    radius={5}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddEditMedicineDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        medicine={selectedMedicine}
      />
    </>
  );
}
