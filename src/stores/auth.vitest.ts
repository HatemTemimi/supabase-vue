import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "./auth";
import supabase from "@/supabase";

vi.mock("@/supabase", () => {
    return {
        default: {
            auth: {
                signInWithPassword: vi.fn(),
                signOut: vi.fn(),
                signUp: vi.fn(),
            },
            from: vi.fn(() => ({
                insert: vi.fn(),
                select: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        single: vi.fn(),
                    })),
                })),
            })),
        },
    };
});

describe("AuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("sets and retrieves user data correctly", () => {
        const store = useAuthStore();
        const mockUser = {
            id: "123",
            email: "test@example.com",
            created_at: "2024-11-29T12:00:00Z",
        };

        store.setUser(mockUser);

        const retrievedUser = store.getUser();
        expect(retrievedUser.id).toBe("123");
        expect(retrievedUser.email).toBe("test@example.com");
    });

    it("sets and retrieves profile data correctly", () => {
        const store = useAuthStore();
        const mockProfile = {
            id: "123",
            email: "test@example.com",
            first_name: "John",
            last_name: "Doe",
        };

        store.setProfile(mockProfile);

        const retrievedProfile = store.getProfile();
        expect(retrievedProfile.id).toBe("123");
        expect(retrievedProfile.first_name).toBe("John");
        expect(retrievedProfile.last_name).toBe("Doe");
    });

    it("signs in with password", async () => {
        const store = useAuthStore();
        const mockResponse = {
            data: { user: { id: "123" } },
            error: null,
        };

        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue(mockResponse);

        const credentials = { email: "test@example.com", password: "password123" };
        const response = await store.signInWithPassword(credentials);

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
        expect(response.data.user.id).toBe("123");
        expect(response.error).toBeNull();
    });

    it("signs up with password", async () => {
        const store = useAuthStore();
        const mockResponse = {
            data: { user: { id: "456" } },
            error: null,
        };

        (supabase.auth.signUp as jest.Mock).mockResolvedValue(mockResponse);

        const credentials = { email: "newuser@example.com", password: "newpassword123" };
        const response = await store.signUp(credentials);

        expect(supabase.auth.signUp).toHaveBeenCalledWith(credentials);
        expect(response.data.user.id).toBe("456");
        expect(response.error).toBeNull();
    });

    it("signs out", async () => {
        const store = useAuthStore();
        const mockResponse = { error: null };

        (supabase.auth.signOut as jest.Mock).mockResolvedValue(mockResponse);

        const response = await store.signOut();

        expect(supabase.auth.signOut).toHaveBeenCalled();
        expect(response).toBeNull(); // Error is null
    });

    it("creates a profile", async () => {
        const store = useAuthStore();
        const mockResponse = { data: { id: "789" }, error: null };

        (supabase.from as jest.Mock).mockReturnValue({
            insert: vi.fn().mockResolvedValue(mockResponse),
        });

        const profilePayload = {
            id: "789",
            email: "profile@example.com",
            first_name: "Jane",
            last_name: "Smith",
        };

        const response = await store.createProfile(profilePayload);

        expect(supabase.from).toHaveBeenCalledWith("profiles");
        expect(response.data.id).toBe("789");
        expect(response.error).toBeNull();
    });

    it("fetches a profile", async () => {
        const store = useAuthStore();
        const mockResponse = {
            data: {
                id: "123",
                email: "test@example.com",
                first_name: "John",
                last_name: "Doe",
            },
        };

        (supabase.from as jest.Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue(mockResponse),
                }),
            }),
        });

        store.setUser({ id: "123" }); // Simulate authenticated user
        await store.fetchProfile();

        const profile = store.getProfile();
        expect(profile.id).toBe("123");
        expect(profile.first_name).toBe("John");
        expect(profile.last_name).toBe("Doe");
    });

    it("handles fetchProfile error gracefully", async () => {
        const store = useAuthStore();
        const mockResponse = { data: null };

        (supabase.from as jest.Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue(mockResponse),
                }),
            }),
        });

        store.setUser({ id: "123" }); // Simulate authenticated user
        const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

        await store.fetchProfile();

        expect(consoleErrorMock).toHaveBeenCalledWith("fetchProfile(): User profile not found.");
        consoleErrorMock.mockRestore();
    });
});
