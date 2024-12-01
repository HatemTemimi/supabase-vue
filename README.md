# Updated README

## Codebase Introduction

This repository contains a Vue 3 application integrated with Supabase. It uses components from [shadcn-vue](https://shadcn-vue.com) with minimal to no modifications from their initial versions.

You are expected to be familiar with setting up Vue 3 and Supabase on your local machine. If you are not, ensure you figure out how to configure the setup locally.

---

## Quick Start

1. Run the following commands to set up the project:
    ```bash
    npm install
    npx supabase start
    npx supabase up
    npm run supabase:edge
    ```

2. Copy `.env.example` to `.env` and fill in the necessary environment variables.

---

## Goals and Changes

### **I. Create a Registration Page**

A fully functional registration page was added to allow new users to create accounts. Key features include:

- **Form Validation**:
    - Real-time email validation (e.g., format checking).
    - Password and confirm password fields with validation for mismatched passwords.
- **Integration with Supabase**:
    - Uses Supabase’s `signUp` method to create users.
    - Automatically creates user profiles upon successful registration.
- **Redirection**:
    - Redirects users to the dashboard upon successful registration.

---

### **II. Improve UI/UX**

Several improvements were made to enhance the user experience:

1. **Login Page Enhancements**:
    - Clearer error messages for invalid login attempts.
    - Added a `data-testid` attribute to critical components for better testability.
    - Improved button styles for better visual feedback (e.g., hover states, disabled states).

2. **Registration Page Enhancements**:
    - A divider with text (e.g., "Already have an account?") between the form and navigation buttons for better clarity.
    - Improved the loading state with a spinner and disabled form inputs during submission.

3. **General Improvements**:
    - **Consistency**: Ensured consistent spacing, typography, and button styles across the app.
    - **Accessibility**: Leveraged ARIA roles and labels in critical components for better accessibility.
    - **Feedback**: Added loader animations to indicate ongoing processes.

---

### **III. Improve Code Quality**

The following principles were applied to enhance the codebase:

1. **Component Reusability**:
    - Extracted the divider into a reusable component (`Divider`) with optional text as a prop.

2. **Sanitization**:
    - Introduced input sanitization before submitting data to Supabase, ensuring clean and secure data handling.
    - Sanitization was handled within the store layer to centralize logic.

3. **Testing Best Practices**:
    - Added `data-testid` attributes to all key components to improve testability without affecting accessibility.

4. **Code Organization**:
    - Used a modular structure with well-defined separation of concerns between components, stores, and services.

5. **TypeScript Best Practices**:
    - Improved type annotations for components, stores, and function signatures to prevent runtime issues.
    - Refactored to eliminate redundant code and adhere to DRY principles.

---

### **IV. Advocate for Testing**

#### Unit Testing
- Wrote unit tests for key components like the login form, registration form, and divider.
- Added tests for the Vuex store (`authStore`) to ensure correct handling of authentication and user profiles.

#### End-to-End Testing
- Introduced E2E tests using Playwright to cover critical user flows:
    - Login with valid and invalid credentials.
    - Registration of a new account.
    - Navigation between pages.
    - Display of validation errors.

#### Improvements
- Used Playwright locators (`getByTestId`, `getByRole`) for robust and maintainable tests.
- Configured a `baseURL` in Playwright to simplify URL management across tests.

---

### **V. No Errors**

1. **Linting**:
    - Fixed all linting errors (`npm run lint`).

2. **Type Checking**:
    - Resolved all TypeScript type errors (`npm run type-check`).

3. **Tests**:
    - All tests pass without errors (`npm run test`).

---

## Summary of Major Changes

- Added a fully functional registration page.
- Enhanced UI/UX for login and registration flows.
- Improved code quality using principles like SOLID, DRY, and modularization.
- Advocated for testing with unit tests, integration tests, and E2E tests.
- Ensured a clean and error-free codebase by fixing linting and type issues.

---

## Submission

Bundle all files into a `.zip` file and submit it to your contact person. Ensure the repository reflects all the above changes before submission.
