import { useAuthStore } from "./auth";
import supabase from "@/supabase";
import { createPinia, setActivePinia } from "pinia";
import type { Mock } from "vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock Supabase
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

// Mock User Type
const mockUser = {
    id: "123",
    email: "test@example.com",
    created_at: "2024-11-29T12:00:00Z",
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
} as const;

// Mock Profile Type
const mockProfile = {
    id: "123",
    email: "test@example.com",
    first_name: "John",
    last_name: "Doe",
    created_at: "2024-11-29T12:00:00Z",
    deleted_at: null,
    updated_at: null,
};

describe("AuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("creates a profile", async () => {
        const store = useAuthStore();
        const mockResponse = { data: { id: "789" }, error: null };

        (supabase.from as Mock).mockReturnValue({
            insert: vi.fn().mockResolvedValue(mockResponse),
        });

        const profilePayload = {
            id: "789",
            email: "profile@example.com",
            first_name: "Jane",
            last_name: "Smith",
        };

        const response = await store.createProfile(profilePayload);

        // Assert that the data type matches the expected structure
        expect(response.data as any).toMatchObject({ id: "789" });
        expect(supabase.from).toHaveBeenCalledWith("profiles");
        expect((response.data as any)?.id).toBe("789");
        expect(response.error).toBeNull();
    });

    it("fetches a profile", async () => {
        const store = useAuthStore();
        const mockResponse = { data: mockProfile };

        (supabase.from as Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue(mockResponse),
                }),
            }),
        });

        store.setUser(mockUser); // Simulate authenticated user
        await store.fetchProfile();

        const profile = store.getProfile();
        expect(profile.id).toBe(mockProfile.id);
        expect(profile.first_name).toBe(mockProfile.first_name);
        expect(profile.last_name).toBe(mockProfile.last_name);
    });

    it("handles fetchProfile error gracefully", async () => {
        const store = useAuthStore();
        const mockResponse = { data: null };

        (supabase.from as Mock).mockReturnValue({
            select: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue(mockResponse),
                }),
            }),
        });

        store.setUser(mockUser); // Simulate authenticated user
        const consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});

        await store.fetchProfile();

        expect(consoleErrorMock).toHaveBeenCalledWith("fetchProfile(): User profile not found.");
        consoleErrorMock.mockRestore();
    });
});
