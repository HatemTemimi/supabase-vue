<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "vue";

// Define props
const props = defineProps<{
    text?: string; // Optional text to display inside the divider
    class?: HTMLAttributes["class"]; // Optional class for additional styling
}>();
</script>

<template>
    <div class="relative flex items-center py-4" :class="props.class">
        <div class="flex-grow border-t border-gray-300"></div>
        <!-- Conditionally render the text if provided -->
        <span v-if="props.text" class="mx-4 text-sm text-gray-500">{{ props.text }}</span>
        <div class="flex-grow border-t border-gray-300"></div>
    </div>
</template>
