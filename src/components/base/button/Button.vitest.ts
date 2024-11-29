import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button.vue", () => {
    it("renders with default props", () => {
        const wrapper = mount(Button, {
            slots: { default: "Click me" },
        });

        const button = wrapper.find("button");
        expect(button.exists()).toBe(true);
        expect(button.text()).toBe("Click me");
    });

    it("applies custom classes", () => {
        const wrapper = mount(Button, {
            props: { class: "custom-class" },
            slots: { default: "Custom Class" },
        });

        expect(wrapper.classes()).toContain("custom-class");
    });

    it("renders as a different HTML tag with the 'as' prop", () => {
        const wrapper = mount(Button, {
            props: { as: "a" },
            slots: { default: "Link Button" },
        });

        const link = wrapper.find("a");
        expect(link.exists()).toBe(true);
        expect(link.text()).toBe("Link Button");
    });

    it("renders the slot content", () => {
        const wrapper = mount(Button, {
            slots: { default: "<span>Slot Content</span>" },
        });

        const slotContent = wrapper.find("span");
        expect(slotContent.exists()).toBe(true);
        expect(slotContent.text()).toBe("Slot Content");
    });
});
