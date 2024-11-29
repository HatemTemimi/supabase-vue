import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Divider from "./Divider.vue";

describe("Divider.vue", () => {
    it("renders correctly without props", () => {
        const wrapper = mount(Divider);

        // Ensure the root element exists
        const divider = wrapper.find("div");
        expect(divider.exists()).toBe(true);

        // Ensure the divider lines are rendered
        const lines = wrapper.findAll("div.border-t");
        expect(lines.length).toBe(2); // Two lines on either side
    });

    it("renders text when the 'text' prop is provided", () => {
        const wrapper = mount(Divider, {
            props: { text: "OR" },
        });

        // Ensure the text is rendered
        const textSpan = wrapper.find("span");
        expect(textSpan.exists()).toBe(true);
        expect(textSpan.text()).toBe("OR");

        // Ensure the lines are still rendered
        const lines = wrapper.findAll("div.border-t");
        expect(lines.length).toBe(2);
    });

    it("does not render text when the 'text' prop is not provided", () => {
        const wrapper = mount(Divider);

        // Ensure no text span is rendered
        const textSpan = wrapper.find("span");
        expect(textSpan.exists()).toBe(false);
    });

    it("applies custom classes from the 'class' prop", () => {
        const customClass = "custom-class";
        const wrapper = mount(Divider, {
            props: { class: customClass },
        });

        // Ensure the custom class is applied
        expect(wrapper.classes()).toContain(customClass);
    });

    it("renders the correct structure with text", () => {
        const wrapper = mount(Divider, {
            props: { text: "OR" },
        });

        // Ensure the parent container has the correct classes
        expect(wrapper.classes()).toContain("relative");
        expect(wrapper.classes()).toContain("flex");
        expect(wrapper.classes()).toContain("items-center");

        // Ensure the structure includes text and lines
        const lines = wrapper.findAll("div.border-t");
        expect(lines.length).toBe(2);
        const textSpan = wrapper.find("span");
        expect(textSpan.exists()).toBe(true);
        expect(textSpan.classes()).toContain("text-sm");
        expect(textSpan.classes()).toContain("text-gray-500");
    });
});
