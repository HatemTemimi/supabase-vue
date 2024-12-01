import DashboardIndex from "./DashboardIndexPage.vue";

import { useAuthStore } from "@/stores/auth";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/stores/auth", () => {
    return {
        useAuthStore: vi.fn(),
    };
});

describe("DashboardIndex.vue", () => {
    it("renders user profile information correctly", () => {
        // Mock the profile data
        const mockProfile = {
            id: "123",
            email: "john.doe@example.com",
            first_name: "John",
            last_name: "Doe",
            created_at: "2024-11-29T12:00:00Z",
            deleted_at: null,
            updated_at: "2024-11-29T12:00:00Z",
        };

        // Mock the store behavior
        (useAuthStore as any).mockReturnValue({
            getProfile: vi.fn(() => mockProfile),
        });

        // Mount the component
        const wrapper = mount(DashboardIndex);

        // Assert the rendered content
        const nameHeading = wrapper.find("h1");
        expect(nameHeading.exists()).toBe(true);
        expect(nameHeading.text()).toBe("John Doe");

        const emailParagraph = wrapper.find("p");
        expect(emailParagraph.exists()).toBe(true);
        expect(emailParagraph.text()).toBe("john.doe@example.com");
    });

    it("handles missing profile data gracefully", () => {
        // Mock an empty profile
        const emptyProfile = {
            id: "",
            email: "",
            first_name: "",
            last_name: "",
            created_at: "",
            deleted_at: null,
            updated_at: "",
        };

        // Mock the store behavior
        (useAuthStore as any).mockReturnValue({
            getProfile: vi.fn(() => emptyProfile),
        });

        // Mount the component
        const wrapper = mount(DashboardIndex);

        // Assert the rendered content
        const nameHeading = wrapper.find("h1");
        expect(nameHeading.exists()).toBe(true);
        expect(nameHeading.text()).toBe("");

        const emailParagraph = wrapper.find("p");
        expect(emailParagraph.exists()).toBe(true);
        expect(emailParagraph.text()).toBe("");
    });
});
