import LoginPage from "./LoginPage.vue";

import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the auth store
const mockAuthStore = {
    signInWithPassword: vi.fn(),
    setUser: vi.fn(),
    getUser: vi.fn(),
};

vi.mock("@/stores/auth", () => ({
    useAuthStore: vi.fn(() => mockAuthStore),
}));

// Mock the router
const mockRouter = {
    push: vi.fn(),
};

vi.mock("vue-router", () => ({
    useRouter: vi.fn(() => mockRouter),
}));

describe("LoginPage.vue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders the form with all fields and buttons", () => {
        const wrapper = mount(LoginPage);

        // Check for email input
        const emailInput = wrapper.find("input[type='email']");
        expect(emailInput.exists()).toBe(true);

        // Check for password input
        const passwordInput = wrapper.find("input[type='password']");
        expect(passwordInput.exists()).toBe(true);

        // Check for Sign In button
        const signInButton = wrapper.find("#sign-in");
        expect(signInButton.exists()).toBe(true);
        expect(signInButton.text()).toBe("Sign In");

        // Check for Register button
        const registerButton = wrapper.find("#register");
        expect(registerButton.exists()).toBe(true);
        expect(registerButton.text()).toBe("Create an account");
    });

    it("calls signInWithPassword on successful login", async () => {
        mockAuthStore.signInWithPassword.mockResolvedValue({
            data: { user: { id: "123", email: "test@example.com" } },
            error: null,
        });

        const wrapper = mount(LoginPage);

        // Set form values
        const emailInput = wrapper.find("input[type='email']");
        const passwordInput = wrapper.find("input[type='password']");
        await emailInput.setValue("test@example.com");
        await passwordInput.setValue("password123");

        // Trigger form submission
        await (wrapper.vm as any).submitForm({ email: "test@example.com", password: "password123" });

        // Assert the mocked function was called with form data
        expect(mockAuthStore.signInWithPassword).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
    });

    it("navigates to the register page when 'Create an account' button is clicked", async () => {
        const wrapper = mount(LoginPage);

        // Simulate button click
        await wrapper.find("#register").trigger("click");

        // Assert navigation to register page
        expect(mockRouter.push).toHaveBeenCalledWith({ name: "auth.register" });
    });

    it("disables inputs and shows loader during form submission", async () => {
        mockAuthStore.signInWithPassword.mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 1000)),
        );

        const wrapper = mount(LoginPage);

        await (wrapper.vm as any).submitForm({ email: "test@example.com", password: "password123" });

        // Check loading state
        const emailInput = wrapper.find("input[type='email']");
        const passwordInput = wrapper.find("input[type='password']");
        const signInButton = wrapper.find("#sign-in");

        expect(emailInput.attributes("disabled")).toBeDefined();
        expect(passwordInput.attributes("disabled")).toBeDefined();
        expect(signInButton.attributes("disabled")).toBeDefined();

        const loader = wrapper.find(".animate-spin");
        expect(loader.exists()).toBe(true);
    });
});
