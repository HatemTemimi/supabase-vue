import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { setActivePinia, createPinia } from "pinia";
import AuthRoutes from "./auth/index";
import PanelRoutes from "./panel/index";
import PublicRoutes from "./public/index";
import SystemRoutes from "./system/index";
import { useAuthStore } from "@/stores/auth";
import supabase from "@/supabase";

vi.mock("@/supabase", () => ({
    default:{
        auth: {
            getUser: vi.fn(),
        },
    }
}));

describe("Router",async () => {
    let router: ReturnType<typeof createRouter>;
    let authStore: ReturnType<typeof useAuthStore>;


    setActivePinia(createPinia());

    router = createRouter({
        history: createWebHistory(),
        routes: [...AuthRoutes, ...PanelRoutes, ...PublicRoutes, ...SystemRoutes],
    });

    authStore = useAuthStore();

    // Wait for router to be ready
    await router.isReady();

    it("has all defined routes", async ()  => {
        const routeNames = router.getRoutes().map((route) => route.name);

        // Auth routes
        expect(routeNames).toContain("auth");
        expect(routeNames).toContain("auth.login");
        expect(routeNames).toContain("auth.logout");
        expect(routeNames).toContain("auth.register");

        // Panel routes
        expect(routeNames).toContain("panel");
        expect(routeNames).toContain("panel.dashboard");
        expect(routeNames).toContain("panel.example");

        // Public routes
        expect(routeNames).toContain(undefined); // Default redirect
        expect(routeNames).toContain("system.error");

        // System routes
        expect(routeNames).toContain("system.error");
    });

    it("redirects authenticated users away from blocked routes", async () => {
        const mockUser = { id: "123" };
        (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: mockUser } });

        const authStore = useAuthStore();
        authStore.setUser(mockUser);

        const to = {
            name: "auth.login",
            meta: { auth: "block" },
        };

        const next = await router.beforeResolve(to as any);

        console.log(next)

        expect(next).toEqual({ name: "panel.dashboard" });
    });

    it("redirects unauthenticated users from protected routes", async () => {
        (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: null } });

        const to = {
            name: "panel.dashboard",
            meta: { auth: true },
        };

        const next = await router.beforeResolve(to as any);

        expect(next).toEqual({ name: "auth.login" });
    });

    it("allows navigation to public routes", async () => {
        (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: null } });

        const to = {
            name: "system.error",
        };

        const next = await router.beforeResolve(to as any);

        expect(next).toBeUndefined(); // Navigation should proceed
    });

    it("stores user data when authenticated", async () => {
        const mockUser = { id: "123", email: "test@example.com" };
        (supabase.auth.getUser as vi.Mock).mockResolvedValue({ data: { user: mockUser } });

        const authStore = useAuthStore();

        const to = {
            name: "panel.dashboard",
            meta: { auth: true },
        };

        await router.beforeResolve(to as any);

        expect(authStore.getUser().id).toBe("123");
        expect(authStore.getUser().email).toBe("test@example.com");
    });

    it("handles 404 redirection correctly", async () => {
        const to = {
            path: "/non-existent-route",
        };

        const next = await router.beforeResolve(to as any);

        expect(next).toEqual({ name: "system.error", params: { error: 404 } });
    });
});
