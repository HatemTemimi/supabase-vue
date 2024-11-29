import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue"; // Adjust the path if needed

describe("Input.vue", () => {
    it("renders with default props", () => {
        const wrapper = mount(Input);

        const input = wrapper.find("input");
        expect(input.exists()).toBe(true);
        expect(input.classes()).toContain("flex");
        expect(input.classes()).toContain("h-9");
        expect(input.classes()).toContain("w-full");
        expect(input.classes()).toContain("rounded-md");
        expect(input.classes()).toContain("border");
    });

    it("applies additional classes from the 'class' prop", () => {
        const wrapper = mount(Input, {
            props: {
                class: "custom-class",
            },
        });

        const input = wrapper.find("input");
        expect(input.classes()).toContain("custom-class");
    });

    it("initializes with the 'defaultValue' prop", () => {
        const wrapper = mount(Input, {
            props: {
                defaultValue: "Default Text",
            },
        });

        const input = wrapper.find("input");
        expect(input.element.value).toBe("Default Text");
    });

    it("binds and updates 'modelValue'", async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: "Initial Value",
            },
        });

        const input = wrapper.find("input");
        expect(input.element.value).toBe("Initial Value");

        // Simulate user input
        await input.setValue("Updated Value");

        // Assert emitted value
        expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
        expect(wrapper.emitted("update:modelValue")[0]).toEqual(["Updated Value"]);
    });

    it("reactively updates when 'modelValue' changes", async () => {
        const wrapper = mount(Input, {
            props: {
                modelValue: "Initial Value",
            },
        });

        // Change the prop
        await wrapper.setProps({ modelValue: "New Value" });

        const input = wrapper.find("input");
        expect(input.element.value).toBe("New Value");
    });
});