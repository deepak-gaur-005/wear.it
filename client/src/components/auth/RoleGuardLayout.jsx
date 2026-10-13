import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet } from "react-router-dom";
import { CommonLoader } from "../common/loader";



export function RoleGaurdLayout({allow}) {
    const { isBootstrapped, status, user, error } = useAuthStore();

    if (!isBootstrapped || status === "loading") {
        return <CommonLoader />;
    }

    if (!user) {
        if (error) {
            return (
                <main
                    className="mx-auto max-w-xl space-y-2 p-8"
                    role="alert"
                >
                    <h1 className="text-xl font-semibold">
                        Could not verify your admin account
                    </h1>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </main>
            );
        }

        return <Navigate to="/sign-in" replace />;
    }

    if (!allow.includes(user.role)) {
        return (
            <main
                className="mx-auto max-w-xl space-y-2 p-8"
                role="alert"
            >
                <h1 className="text-xl font-semibold">Admin access required</h1>
                <p className="text-sm text-muted-foreground">
                    This account has the "{user.role}" role. Confirm its email
                    is listed in the server&apos;s ADMIN_EMAILS setting, then
                    sign out and back in.
                </p>
            </main>
        );
    }

    return <Outlet />
}