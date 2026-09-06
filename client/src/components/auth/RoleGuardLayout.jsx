import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet } from "react-router-dom";



export function RoleGaurdLayout({allow}) {
    const { isBootstrapped, status, user } = useAuthStore();

    if (!isBootstrapped || status === "loading") {
        return null
    }

    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    if (!allow.includes(user.roles)) {
        return <Navigate to="/" replace/>;
    }

    return <Outlet />
}