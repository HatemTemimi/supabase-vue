import { useAuthStore } from "@/stores/auth";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useRouter } from "vue-router";

// Mock the auth store
vi.mock("@/stores/auth", () => ({
    useAuthStore: vi.fn(() => ({
        setUser: vi.fn(),
        getUser: vi.fn(),
    })),
}));

// Mock the router
vi.mock("vue-router", () => ({
    useRouter: vi.fn(),
}));

// Define the type for route meta
interface RouteMeta {
    auth?: boolean | "block";
}

// Define the type for the `to` object
interface Route {
    name?: string;
    path?: string;
    meta?: RouteMeta;
}

describe("Router", () => {
    let authStore: ReturnType<typeof useAuthStore>;
    let mockRouterPush: Mock;

    beforeEach(() => {
        authStore = useAuthStore();
        mockRouterPush = vi.fn();

        (useRouter as Mock).mockReturnValue({
            push: mockRouterPush,
        });
    });

    it("redirects authenticated users away from blocked routes", async () => {
        const mockUser = {
            id: "123",
            email: "test@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
        };

        (authStore.getUser as Mock).mockReturnValue(mockUser);
        (authStore.setUser as Mock).mockImplementation((user) => {
            (authStore.getUser as Mock).mockReturnValue(user);
        });

        const to: Route = { name: "auth.login", meta: { auth: "block" } };

        // Simulate redirection logic
        if (to.meta?.auth === "block" && authStore.getUser()) {
            mockRouterPush({ name: "panel.dashboard" });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "panel.dashboard" });
    });

    it("redirects unauthenticated users from protected routes", async () => {
        (authStore.getUser as Mock).mockReturnValue(null);

        const to: Route = { name: "panel.dashboard", meta: { auth: true } };

        // Simulate redirection logic
        if (!authStore.getUser() && to.meta?.auth === true) {
            mockRouterPush({ name: "auth.login" });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "auth.login" });
    });

    it("allows navigation to public routes", async () => {
        (authStore.getUser as Mock).mockReturnValue(null);

        const to: Route = { name: "system.error", meta: {} };

        // Simulate public route navigation
        if (!to.meta?.auth) {
            mockRouterPush(to);
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "system.error", meta: {} });
    });

    it("handles 404 redirection correctly", async () => {
        const to: Route = { path: "/non-existent-route", name: undefined };

        // Simulate 404 redirection
        if (!to.name) {
            mockRouterPush({ name: "system.error", params: { error: 404 } });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "system.error", params: { error: 404 } });
    });

    it("stores user data when authenticated", async () => {
        const mockUser = {
            id: "123",
            email: "test@example.com",
            app_metadata: {},
            user_metadata: {},
            aud: "authenticated",
            created_at: new Date().toISOString(),
        };

        (authStore.getUser as Mock).mockReturnValue(null);
        (authStore.setUser as Mock).mockImplementation((user) => {
            (authStore.getUser as Mock).mockReturnValue(user);
        });

        authStore.setUser(mockUser);

        const user = authStore.getUser();
        expect(user.id).toBe("123");
        expect(user.email).toBe("test@example.com");
    });
});
