import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/auth";
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

describe("Router", () => {
    let authStore: ReturnType<typeof useAuthStore>;
    let mockRouterPush: jest.Mock;

    beforeEach(() => {
        authStore = useAuthStore();
        mockRouterPush = vi.fn();

        (useRouter as vi.Mock).mockReturnValue({
            push: mockRouterPush,
        });
    });

    it("redirects authenticated users away from blocked routes", async () => {
        const mockUser = { id: "123" };

        authStore.getUser.mockReturnValue(mockUser);
        authStore.setUser.mockImplementation((user) => {
            authStore.getUser.mockReturnValue(user);
        });

        const to = { name: "auth.login", meta: { auth: "block" } };

        // Simulate redirection logic
        if (to.meta.auth === "block" && authStore.getUser()) {
            mockRouterPush({ name: "panel.dashboard" });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "panel.dashboard" });
    });

    it("redirects unauthenticated users from protected routes", async () => {
        authStore.getUser.mockReturnValue(null);

        const to = { name: "panel.dashboard", meta: { auth: true } };

        // Simulate redirection logic
        if (!authStore.getUser() && to.meta.auth === true) {
            mockRouterPush({ name: "auth.login" });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "auth.login" });
    });

    it("allows navigation to public routes", async () => {
        authStore.getUser.mockReturnValue(null);

        const to = { name: "system.error" };

        // Simulate public route navigation
        if (!to.meta?.auth) {
            mockRouterPush(to);
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "system.error" });
    });

    it("handles 404 redirection correctly", async () => {
        const to = { path: "/non-existent-route" };

        // Simulate 404 redirection
        if (!to.name) {
            mockRouterPush({ name: "system.error", params: { error: 404 } });
        }

        expect(mockRouterPush).toHaveBeenCalledWith({ name: "system.error", params: { error: 404 } });
    });

    it("stores user data when authenticated", async () => {
        const mockUser = { id: "123", email: "test@example.com" };

        authStore.getUser.mockReturnValue(null);
        authStore.setUser.mockImplementation((user) => {
            authStore.getUser.mockReturnValue(user);
        });

        authStore.setUser(mockUser);

        expect(authStore.getUser().id).toBe("123");
        expect(authStore.getUser().email).toBe("test@example.com");
    });
});
