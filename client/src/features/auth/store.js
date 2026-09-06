import {create } from "zustand";

export const useAuthStore = create((set) => ({
    status: "idle", // idle | loading | ready | error
    isBootstrapped: false,
    user: null,
    error: null, 

    setLoading: () => 
        set({
            status: "loading",
            error: null,
    }),

    setUser: (user) => 
        set({
            status: "ready",
            isBootstrapped: true,
            user,
            error:null,
        }),
    
    setError: (message) => 
        set({
            status: "ready",
            isBootstrapped: true,
            error: message,
        }),

    clearAuth: () =>
        set({
            status: "ready",
            isBootstrapped: true,
            user: null,
            error: null,
        })
}))