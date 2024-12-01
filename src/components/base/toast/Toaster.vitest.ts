import { toast, useToast } from "./use-toast";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("useToast", () => {
    let toasts: ReturnType<typeof useToast>;

    beforeEach(() => {
        toasts = useToast();
    });

    it("adds a new toast to the state", () => {
        const newToast = { title: "New Toast", description: "Test Description" };
        const result = toast(newToast);

        expect(toasts.toasts.value).toHaveLength(1);
        expect(toasts.toasts.value[0]).toMatchObject({
            id: result.id,
            ...newToast,
        });
    });

    it("respects the TOAST_LIMIT", () => {
        const limit = 1;

        for (let i = 0; i < limit + 1; i++) {
            toast({ title: `Toast ${i}` });
        }

        expect(toasts.toasts.value).toHaveLength(limit);
    });

    it("dismisses a toast by id", () => {
        const result = toast({ title: "Dismiss Me" });

        toasts.dismiss(result.id);

        expect(toasts.toasts.value[0].open).toBe(false);
    });

    it("removes a toast after the dismissal delay", async () => {
        vi.useFakeTimers();

        const result = toast({ title: "Remove Me" });
        toasts.dismiss(result.id);

        expect(toasts.toasts.value).toHaveLength(1);

        vi.advanceTimersByTime(1000000);

        expect(toasts.toasts.value).toHaveLength(0);

        vi.useRealTimers();
    });

    it("updates an existing toast", () => {
        const result = toast({ title: "Update Me", description: "Old Description" });

        // Ensure the update payload includes the id
        result.update({ id: result.id, title: "Updated", description: "New Description" });

        const updatedToast = toasts.toasts.value.find((t) => t.id === result.id);
        expect(updatedToast).toMatchObject({
            title: "Updated",
            description: "New Description",
        });
    });

    it("dismisses all toasts if no id is provided", () => {
        toast({ title: "Toast 1" });
        toast({ title: "Toast 2" });

        toasts.dismiss();

        toasts.toasts.value.forEach((t) => expect(t.open).toBe(false));
    });
});
