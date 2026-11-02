import { useCallback, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAdminDashboardStats } from "@/features/admin/dashboard/api";
import { formatPrice } from "@/lib/utils";
import { FolderTree, IndianRupee, Package, RotateCcw, ShoppingBag, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const statCards = [
    { key: "totalSales", label: "Total Revenue", isCurrency: true, icon: IndianRupee },
    { key: "totalOrders", label: "Total Orders", isCurrency: false, icon: ShoppingBag },
    { key: "totalProducts", label: "Active Products", isCurrency: false, icon: Package },
    { key: "totalCategories", label: "Categories", isCurrency: false, icon: FolderTree },
    { key: "totalReturnedOrders", label: "Returned Orders", isCurrency: false, icon: RotateCcw },
];

function formatValue(value, isCurrency) {
    if (isCurrency) {
        return formatPrice(value || 0);
    }
    return Number(value || 0).toLocaleString();
}

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadStats = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            setStats(await getAdminDashboardStats());
        } catch (loadError) {
            console.error("Failed to load admin dashboard:", loadError);
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Failed to load dashboard data"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        getAdminDashboardStats()
            .then((data) => {
                if (!cancelled) setStats(data);
            })
            .catch((loadError) => {
                if (cancelled) return;

                console.error("Failed to load admin dashboard:", loadError);
                setError(
                    loadError instanceof Error
                        ? loadError.message
                        : "Failed to load dashboard data"
                );
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="space-y-8 p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Admin Dashboard
                    </h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Real-time store performance and inventory analytics
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link to="/admin/products">
                        <Button size="sm" variant="outline" className="rounded-none text-xs gap-1.5">
                            Manage Inventory
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                    <Link to="/admin/orders">
                        <Button size="sm" className="rounded-none text-xs gap-1.5">
                            Process Orders
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                    </Link>
                </div>
            </div>

            {error ? (
                <div
                    className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"
                    role="alert"
                >
                    <p>Could not load dashboard data: {error}</p>
                    <button
                        className="mt-2 font-medium underline"
                        onClick={() => void loadStats()}
                        type="button"
                    >
                        Try again
                    </button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map(({ key, label, isCurrency, icon: Icon }) => (
                        <Card key={key} className="border-border/70 bg-card/90 shadow-xs">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    {label}
                                </CardTitle>
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Icon className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold tracking-tight text-foreground">
                                    {loading
                                        ? "..."
                                        : formatValue(stats?.[key] ?? 0, isCurrency)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    );
}

export default AdminDashboard;