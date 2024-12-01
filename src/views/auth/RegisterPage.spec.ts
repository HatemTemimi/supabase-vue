import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";

test.describe("Register Page with Test IDs", () => {
    const baseUrl = "http://localhost:5173";
    const registerUrl = "/register";
    const dashboardUrl = "/dashboard";
    const loginUrl = "/login";

    test("should display the registration form", async ({ page }) => {
        // Navigate to the register page
        await page.goto(`${baseUrl}${registerUrl}`);

        // Check for form elements using test IDs
        await expect(page.getByTestId("register-form")).toBeVisible();
        await expect(page.getByTestId("register-title")).toHaveText("Register");
        await expect(page.getByTestId("register-description")).toHaveText("Create a new account below.");
        await expect(page.getByTestId("email-input")).toBeVisible();
        await expect(page.getByTestId("password-input")).toBeVisible();
        await expect(page.getByTestId("confirm-password-input")).toBeVisible();
        await expect(page.getByTestId("first-name-input")).toBeVisible();
        await expect(page.getByTestId("last-name-input")).toBeVisible();
        await expect(page.getByTestId("register-button")).toBeVisible();
        await expect(page.getByTestId("sign-in-button")).toBeVisible();
    });

    test("should register successfully with valid credentials", async ({ page }) => {
        // Generate fake data for the test
        const fakeEmail = faker.internet.email();
        const fakePassword = faker.internet.password();
        const fakeFirstName = faker.name.firstName();
        const fakeLastName = faker.name.lastName();

        // Navigate to the register page
        await page.goto(`${baseUrl}${registerUrl}`);

        // Fill in the registration form
        await page.getByTestId("email-input").fill(fakeEmail);
        await page.getByTestId("password-input").fill(fakePassword);
        await page.getByTestId("confirm-password-input").fill(fakePassword);
        await page.getByTestId("first-name-input").fill(fakeFirstName);
        await page.getByTestId("last-name-input").fill(fakeLastName);

        // Click the Register button
        await page.getByTestId("register-button").click();

        // Wait for navigation to the dashboard
        await page.waitForURL(`${baseUrl}${dashboardUrl}`, { timeout: 60000 });

        // Verify the user is on the dashboard
        expect(page.url()).toBe(`${baseUrl}${dashboardUrl}`);
    });

    test("should navigate to the login page when 'Sign In' button is clicked", async ({ page }) => {
        // Navigate to the register page
        await page.goto(`${baseUrl}${registerUrl}`);

        // Click the Sign In button
        await page.getByTestId("sign-in-button").click();

        // Wait for navigation to the login page
        await page.waitForURL(`${baseUrl}${loginUrl}`);

        // Verify the user is on the login page
        expect(page.url()).toBe(`${baseUrl}${loginUrl}`);
    });
});
