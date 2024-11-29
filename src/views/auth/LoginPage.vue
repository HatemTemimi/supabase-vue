<script setup lang="ts">
import { Button } from "@/components/base/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { useToast } from "@/components/base/toast/use-toast";
import { Loader } from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Divider } from "@/components/base/divider";

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

const navigateToRegister = () => {
    router.push({ name: "auth.register" });
};
</script>

<template>
    <Form class="space-y-6" data-testid="login-form" @submit="submitForm(form)">
        <div class="flex flex-col space-y-2">
            <h1 class="text-2xl font-semibold tracking-tight" data-testid="login-title">Sign In</h1>
            <p class="text-sm text-gray-400" data-testid="login-description">Enter your credentials below to proceed.</p>
        </div>

        <FormField name="email" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="email">Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Email Address"
                    data-testid="email-input"
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
                    data-testid="password-input"
                    :required="true"
                    v-model="form.password"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <div class="flex flex-col gap-4">
            <Button type="submit" id="sign-in" name="sign-in" data-testid="sign-in-button" :disabled="isLoading">
                <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
                Sign In
            </Button>
            <div class="flex flex-col gap-2 justify-between">
                <Divider text="Don't have an account ?" data-testid="divider-text" />
                <Button
                    type="button"
                    id="register"
                    name="register"
                    data-testid="register-button"
                    class="text-center hover:text-white bg-transparent text-black outlined"
                    :disabled="isLoading"
                    @click="navigateToRegister"
                >
                    <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
                    Create an account
                </Button>
            </div>
        </div>
    </Form>
</template>
