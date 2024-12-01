import SignOut from "./LogoutPage.vue";

import { useAuthStore } from "@/stores/auth";
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { useRouter } from "vue-router";

const mockAuthStore = {
    signOut: vi.fn(),
};

vi.mock("@/stores/auth", () => ({
    useAuthStore: vi.fn(() => mockAuthStore),
}));

vi.mock("vue-router", () => ({
    useRouter: vi.fn(),
}));

describe("SignOut.vue", () => {
    it("renders the title, description, and loader", () => {
        const wrapper = mount(SignOut);

        // Check the title
        expect(wrapper.find("h1").text()).toBe("Sign Out");

        // Check the description
        expect(wrapper.find("p").text()).toBe("Please wait while we process your request.");

        // Check the loader
        const loader = wrapper.find(".animate-spin");
        expect(loader.exists()).toBe(true);
    });

    it("calls signOut and navigates to login after 1.5 seconds", async () => {
        const mockSignOut = vi.fn().mockResolvedValue(null);
        const mockRouterPush = vi.fn();

        (useAuthStore as any).mockReturnValue({
            signOut: mockSignOut,
        });

        (useRouter as any).mockReturnValue({
            push: mockRouterPush,
        });

        vi.useFakeTimers();

        mount(SignOut);

        vi.advanceTimersByTime(1500);

        // Assert signOut was called
        expect(mockSignOut).toHaveBeenCalled();

        vi.useRealTimers();
    });
});
