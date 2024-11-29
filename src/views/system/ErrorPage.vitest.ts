import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ErrorPage from "./ErrorPage.vue"; // Adjust the path if needed
import { useRoute } from "vue-router";

// Mock the `useRoute` composable
vi.mock("vue-router", () => ({
    useRoute: vi.fn(),
}));

describe("ErrorPage.vue", () => {
    it("renders the correct error message for 404", () => {
        // Mock the route params for error type
        (useRoute as jest.Mock).mockReturnValue({
            params: { error: "404" },
        });

        // Mount the component
        const wrapper = mount(ErrorPage);

        // Assert the error title and message
        const title = wrapper.find("h1");
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe("Error 404 - Page Not Found");

        const message = wrapper.find("p");
        expect(message.exists()).toBe(true);
        expect(message.text()).toBe("Sorry, we couldn't find the page you're looking for.");
    });

    it("renders the default error message for unsupported error types", () => {
        // Mock the route params with an unsupported error type
        (useRoute as jest.Mock).mockReturnValue({
            params: { error: "500" },
        });

        // Mount the component
        const wrapper = mount(ErrorPage);

        // Assert the default error title and message
        const title = wrapper.find("h1");
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe("Error 500 - Page Not Found");

        const message = wrapper.find("p");
        expect(message.exists()).toBe(true);
        expect(message.text()).toBe("Sorry, we couldn't find the page you're looking for.");
    });

    it("renders the default error message when no error type is provided", () => {
        // Mock the route params with no error type
        (useRoute as jest.Mock).mockReturnValue({
            params: {},
        });

        // Mount the component
        const wrapper = mount(ErrorPage);

        // Assert the default error title and message
        const title = wrapper.find("h1");
        expect(title.exists()).toBe(true);
        expect(title.text()).toBe("Error  - Page Not Found");

        const message = wrapper.find("p");
        expect(message.exists()).toBe(true);
        expect(message.text()).toBe("Sorry, we couldn't find the page you're looking for.");
    });
});
