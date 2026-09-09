import { useAuth } from "@clerk/react";
import { useAuthStore } from "./store.js";
import { useEffect } from "react";
import { getMe, syncUser } from "./api.js";
import { setApiTokenGetter } from "@/lib/api.js";

export function useBootstrapAuth() {
    const { isLoaded, isSignedIn, getToken } = useAuth();
    const { setLoading, setUser, clearAuth, setError } = useAuthStore();

    // Set Clerk token for API requests
    useEffect(() => {
        setApiTokenGetter(async () => {
            const token = await getToken();
            return token ?? null;
        });
    }, [getToken]);

    // Sync Clerk user with MongoDB
    useEffect(() => {
        async function run() {
            if (!isLoaded) return;

            if (!isSignedIn) {
                clearAuth();
                return;
            }

            try {
                console.log("User signed in, syncing with backend...");

                setLoading();

                await syncUser();

                console.log("User synced successfully");

                const me = await getMe();
                setUser(me?.user);

            } catch (error) {
                console.error(" Auth bootstrap error:", error);

                const errMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to load user";

                setError(errMessage);
            }
        }

        void run();
    }, [
        isLoaded,
        isSignedIn,
        clearAuth,
        setError,
        setLoading,
        setUser,
    ]);
}