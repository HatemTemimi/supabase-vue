<script setup lang="ts">
import { PanelHeader } from ".";
</script>

<template>
    <div class="h-full w-full overflow-hidden pt-10">
        <PanelHeader />

        <div class="relative flex h-full w-full">
            <div class="h-full w-[56px] border-r border-gray-200 bg-white">
                <!-- -->
            </div>
            <main class="h-full w-full bg-gray-50">
                <slot />
            </main>
        </div>
    </div>
</template>
