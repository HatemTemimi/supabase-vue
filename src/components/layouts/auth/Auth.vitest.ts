import Auth from "./Auth.vue";

import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

describe("Auth.vue", () => {
    const props = {
        title: "Welcome to Our App",
        description: "Sign in to continue",
        showcaseImagePath: "/path/to/image.jpg",
    };

    it("renders the title prop correctly", () => {
        const wrapper = mount(Auth, {
            props,
        });

        const title = wrapper.find("h1");
        expect(title.exists()).toBe(true);
        expect(title.text()).toContain(props.title);
    });

    it("renders the description prop correctly", () => {
        const wrapper = mount(Auth, {
            props,
        });

        const description = wrapper.find("p");
        expect(description.exists()).toBe(true);
        expect(description.text()).toBe(props.description);
    });

    it("renders the showcase image correctly", () => {
        const wrapper = mount(Auth, {
            props,
        });

        const img = wrapper.find("img");
        expect(img.exists()).toBe(true);
        expect(img.attributes("src")).toBe(props.showcaseImagePath);
    });

    it("renders the slot content correctly", () => {
        const wrapper = mount(Auth, {
            props,
            slots: {
                default: "<div id='slot-content'>Slot Content</div>",
            },
        });

        const slotContent = wrapper.find("#slot-content");
        expect(slotContent.exists()).toBe(true);
        expect(slotContent.text()).toBe("Slot Content");
    });

    it("renders the main structure correctly", () => {
        const wrapper = mount(Auth, {
            props,
        });

        expect(wrapper.classes("flex")).toBe(true); // Ensure the root div has the `flex` class
        expect(wrapper.find(".lg\\:block").exists()).toBe(true); // Ensure the left-side image container exists
        expect(wrapper.find(".lg\\:flex-none").exists()).toBe(true); // Ensure the right-side form container exists
    });
});
