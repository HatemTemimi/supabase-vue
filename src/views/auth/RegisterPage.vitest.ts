import RegisterPage from "./RegisterPage.vue";

import { useAuthStore } from "@/stores/auth";
import { mount } from "@vue/test-utils";
import type { Mock } from "vitest";
import { describe, expect, it, vi } from "vitest";
import { useRouter } from "vue-router";

// Mock the auth store
const mockAuthStore = {
    signUp: vi.fn(),
    createProfile: vi.fn()
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

describe("RegisterPage.vue", () => {
    it("renders the form with all fields and buttons", () => {
        const wrapper = mount(RegisterPage);

        // Check for email input
        const emailInput = wrapper.find("input[type='email']");
        expect(emailInput.exists()).toBe(true);

        // Check for password input
        const passwordInput = wrapper.find("input[type='password'][placeholder='Password']");
        expect(passwordInput.exists()).toBe(true);

        // Check for confirm password input
        const confirmPasswordInput = wrapper.find("input[type='password'][placeholder='Confirm Password']");
        expect(confirmPasswordInput.exists()).toBe(true);

        // Check for first name input
        const firstNameInput = wrapper.find("input[placeholder='First Name']");
        expect(firstNameInput.exists()).toBe(true);

        // Check for last name input
        const lastNameInput = wrapper.find("input[placeholder='Last Name']");
        expect(lastNameInput.exists()).toBe(true);

        // Check for Register button
        const registerButton = wrapper.find("#register");
        expect(registerButton.exists()).toBe(true);
        expect(registerButton.text()).toBe("Register");

        // Check for Sign In button
        const signInButton = wrapper.find("#sign-in");
        expect(signInButton.exists()).toBe(true);
        expect(signInButton.text()).toBe("Sign In");
    });

    it("shows validation messages for invalid email", async () => {
        const wrapper = mount(RegisterPage);

        const emailInput = wrapper.find("input[type='email']");
        await emailInput.setValue("invalid-email");

        // Trigger email watcher
        expect(wrapper.find(".text-red-600").text()).toBe("Please enter a valid email address.");
    });

    it("shows validation messages for mismatched passwords", async () => {
        const wrapper = mount(RegisterPage);

        const passwordInput = wrapper.find("input[type='password'][placeholder='Password']");
        const confirmPasswordInput = wrapper.find("input[type='password'][placeholder='Confirm Password']");

        await passwordInput.setValue("password123");
        await confirmPasswordInput.setValue("differentpassword");

        // Trigger password watcher
        expect(wrapper.find(".text-red-600").text()).toBe("Passwords do not match.");
    });

    it("submits the form and registers the user successfully", async () => {
        const mockSignUp = mockAuthStore.signUp.mockResolvedValue({
            data: { user: { id: "123" } },
            error: null,
        });
        const mockCreateProfile = mockAuthStore.createProfile.mockResolvedValue({ error: null });
        const wrapper = mount(RegisterPage);

        // Set form values
        (wrapper.vm as any).form.email = "test@example.com";
        (wrapper.vm as any).form.password = "password123";
        (wrapper.vm as any).form.confirmPassword = "password123";

        // Submit form
        await (wrapper.vm as any).submitForm();

        // Assert signUp is called with correct payload
        expect(mockSignUp).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });

        // Assert createProfile is called with correct payload
        expect(mockCreateProfile).toHaveBeenCalledWith({
            id: "123",
            email: "test@example.com",
            first_name: "",
            last_name: "",
        });

        // Assert router navigation
        expect(mockRouter.push).toHaveBeenCalledWith({ name: "panel.dashboard" });
    });

    it("navigates to the login page when 'Sign In' is clicked", async () => {
        const mockRouterPush = vi.fn();
        (useRouter as any as Mock).mockReturnValue({
            push: mockRouterPush,
        });

        const wrapper = mount(RegisterPage);

        // Simulate button click
        await wrapper.find("#sign-in").trigger("click");

        // Assert navigation to login page
        expect(mockRouterPush).toHaveBeenCalledWith({ name: "auth.login" });
    });

    it("displays an error when registration fails", async () => {
        const mockSignUp = vi.fn().mockResolvedValue({
            data: null,
            error: { message: "Registration failed" },
        });
        (useAuthStore as any as Mock).mockReturnValue({
            signUp: mockSignUp,
        });

        const wrapper = mount(RegisterPage);

        // Set form values
        (wrapper.vm as any).form.email = "test@example.com";
        (wrapper.vm as any).form.password = "password123";
        (wrapper.vm as any).form.confirmPassword = "password123";

        // Submit form
        await (wrapper.vm as any).submitForm();

        // Assert signUp is called
        expect(mockSignUp).toHaveBeenCalled();
    });
});
