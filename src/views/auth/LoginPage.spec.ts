import { expect, test } from "@playwright/test";

test.describe("Login Page with Test IDs", () => {
    const loginUrl = "/login";
    const dashboardUrl = "/dashboard";
    const registerUrl = "/register";
    const baseUrl = "http://localhost:5173";

    test("should display the login form", async ({ page }) => {
        // Navigate to the login page
        await page.goto(`${baseUrl}${loginUrl}`);

        // Check for form elements using test IDs
        await expect(page.getByTestId("login-form")).toBeVisible();
        await expect(page.getByTestId("login-title")).toHaveText("Sign In");
        await expect(page.getByTestId("login-description")).toHaveText("Enter your credentials below to proceed.");
        await expect(page.getByTestId("email-input")).toBeVisible();
        await expect(page.getByTestId("password-input")).toBeVisible();
        await expect(page.getByTestId("sign-in-button")).toBeVisible();
        await expect(page.getByTestId("register-button")).toBeVisible();
    });

    test("should log in successfully with valid credentials", async ({ page }) => {
        // Navigate to the login page
        await page.goto(`${baseUrl}${loginUrl}`);

        // Fill in valid credentials
        await page.getByTestId("email-input").fill("admin@admin.com");
        await page.getByTestId("password-input").fill("password");

        // Click the Sign In button
        await page.getByTestId("sign-in-button").click();

        // Wait for navigation to the dashboard
        await page.waitForURL(`${baseUrl}${dashboardUrl}`, { timeout: 60000 });

        // Verify the user is on the dashboard
        expect(page.url()).toBe(`${baseUrl}${dashboardUrl}`);
    });

    test("should show error with invalid credentials", async ({ page }) => {
        // Navigate to the login page
        await page.goto(`${baseUrl}${loginUrl}`);

        // Fill in invalid credentials
        await page.getByTestId("email-input").fill("invalid@example.com");
        await page.getByTestId("password-input").fill("wrongpassword");

        // Click the Sign In button
        await page.getByTestId("sign-in-button").click();

        // Verify the URL remains on the login page
        expect(page.url()).toBe(`${baseUrl}${loginUrl}`);
    });

    test("should navigate to the register page when 'Create an account' is clicked", async ({ page }) => {
        // Navigate to the login page
        await page.goto(`${baseUrl}${loginUrl}`);

        // Click the Create an Account button
        await page.getByTestId("register-button").click();

        // Wait for navigation to the register page
        await page.waitForURL(`${baseUrl}${registerUrl}`);

        // Verify the user is on the register page
        expect(page.url()).toBe(`${baseUrl}${registerUrl}`);
    });
});
