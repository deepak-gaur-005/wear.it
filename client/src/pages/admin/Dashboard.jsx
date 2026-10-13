import { useCallback, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getAdminDashboardStats } from "@/features/admin/dashboard/api";

const statCards = [
    { key: "totalProducts", label: "Products" },
    { key: "totalCategories", label: "Categories" },
    { key: "totalSales", label: "Total sales" },
    { key: "totalOrders", label: "Orders" },
    { key: "totalReturnedOrders", label: "Returned orders" },
];

function formatValue(value) {
    return Number(value).toLocaleString();
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
        <section className="space-y-6 p-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Store overview
                </p>
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
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {statCards.map(({ key, label }) => (
                        <Card key={key}>
                            <CardHeader>
                                <CardTitle>{label}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {loading
                                        ? "Loading..."
                                        : formatValue(stats?.[key] ?? 0)}
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