<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";
import { ref, watch } from "vue";

// Define props
const props = defineProps<{
    defaultValue?: string | number;
    modelValue?: string | number;
    class?: HTMLAttributes["class"];
}>();

// Define emits
const emits = defineEmits<{
    (e: "update:modelValue", payload: string | number): void;
}>();

// Reactive model for internal state
const internalValue = ref(props.modelValue ?? props.defaultValue ?? "");

// Watch for changes to `modelValue` from the parent and sync with `internalValue`
watch(
    () => props.modelValue,
    (newValue) => {
        if (newValue !== internalValue.value) {
            internalValue.value = newValue ?? "";
        }
    },
);

// Emit updates when the input changes
const updateValue = (event: Event) => {
    const value = (event.target as HTMLInputElement).value;
    internalValue.value = value;
    emits("update:modelValue", value);
};
</script>

<template>
    <input
        :value="internalValue"
        @input="updateValue"
        :class="
            cn(
                'flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
                props.class,
            )
        "
    />
</template>
