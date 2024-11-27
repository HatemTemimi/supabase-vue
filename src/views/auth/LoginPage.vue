<script setup lang="ts">
import { Button } from "@/components/base/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { useToast } from "@/components/base/toast/use-toast";
import { Loader } from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);

const toggleLoading = () => {
    isLoading.value = !isLoading.value;
};

const form = ref({
    email: "",
    password: "",
});

const submitForm = async (payload: any) => {
    toggleLoading();

    const { error } = await authStore.signInWithPassword(payload);

    setTimeout(() => {
        if (error) {
            toast({ description: error.message });
        } else {
            router.push({ name: "panel.dashboard" });
            toast({ description: "Welcome Back!" });
        }

        toggleLoading();
    }, 500);
};

</script>

<template>
    <Form class="space-y-6" @submit="submitForm(form)">
        <div class="flex flex-col space-y-2">
            <h1 class="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p class="text-sm text-gray-400">Enter your credentials below to proceed.</p>
        </div>

        <FormField name="email" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="email">Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Email Address"
                    :required="true"
                    v-model="form.email"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <FormField name="password" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="password">Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Password"
                    :required="true"
                    v-model="form.password"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <Button type="submit" id="sign-in" name="sign-in" :disabled="isLoading">
            <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
            Sign In
        </Button>
    </Form>
</template>
