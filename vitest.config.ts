import viteConfig from "./vite.config";
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

// Default vitest configuration for all tests
export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: "jsdom",
            include: ["**/*.vitest.ts"],
            exclude: [...configDefaults.exclude, "e2e/**"],
            root: fileURLToPath(new URL("./", import.meta.url)),
            coverage: {
                provider: "v8", // Use 'c8' as the provider
                reporter: ["text", "lcov"], // 'text' for terminal output, 'lcov' for detailed reports
                reportsDirectory: "./coverage", // Directory where coverage reports will be saved
            },
        },
    }),
);
