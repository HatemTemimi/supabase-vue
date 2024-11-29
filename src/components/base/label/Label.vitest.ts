import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "./Label.vue"; // Adjust the path if needed

describe("Label.vue", () => {
    it("renders the default slot content", () => {
        const wrapper = mount(Label, {
            slots: {
                default: "Test Label",
            },
        });

        // Check that the content from the slot is rendered
        expect(wrapper.text()).toBe("Test Label");
    });

    it("applies default classes", () => {
        const wrapper = mount(Label, {
            slots: {
                default: "Test Label",
            },
        });

        // Check for default class
        expect(wrapper.classes()).toContain("text-sm");
        expect(wrapper.classes()).toContain("font-medium");
        expect(wrapper.classes()).toContain("leading-none");
        expect(wrapper.classes()).toContain("peer-disabled:cursor-not-allowed");
        expect(wrapper.classes()).toContain("peer-disabled:opacity-70");
    });

    it("applies additional classes from the 'class' prop", () => {
        const wrapper = mount(Label, {
            props: {
                class: "custom-class",
            },
            slots: {
                default: "Test Label",
            },
        });

        // Check for custom class
        expect(wrapper.classes()).toContain("custom-class");
    });

    it("delegates additional props to the Label component", () => {
        const wrapper = mount(Label, {
            props: {
                for: "input-id",
            },
            slots: {
                default: "Test Label",
            },
        });

        // Check that the 'for' attribute is passed to the Label
        expect(wrapper.attributes("for")).toBe("input-id");
    });
});
