<script setup lang="ts">
import { Button } from "@/components/base/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/base/form";
import { Input } from "@/components/base/input";
import { useToast } from "@/components/base/toast/use-toast";
import { Loader } from "lucide-vue-next";

import { useAuthStore } from "@/stores/auth";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Divider } from "@/components/base/divider";

const authStore = useAuthStore();
const router = useRouter();
const { toast } = useToast();
const isLoading = ref(false);

interface RegisterData {
    email: string;
    password: string;
    confirmPassword: string;
    firstName?: string;
    lastName?: string;
}

const form = ref<RegisterData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
});

const passwordError = ref<string>("");
const emailError = ref<string>("");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

watch(() => form.value.email, (email) => {
    if (!emailRegex.test(email) && email) {
        emailError.value = "Please enter a valid email address.";
    } else {
        emailError.value = "";
    }
});

watch(
    [() => form.value.password, () => form.value.confirmPassword],
    ([password, confirmPassword]) => {
        if (password !== confirmPassword && confirmPassword) {
            passwordError.value = "Passwords do not match.";
        } else {
            passwordError.value = "";
        }
    }
);

const toggleLoading = () => {
    isLoading.value = !isLoading.value;
};

const submitForm = async () => {
    toggleLoading();

    if (passwordError.value || emailError.value) {
        toast({
            description: passwordError.value || emailError.value,
            variant: "destructive",
        });
        toggleLoading();
        return;
    }

    const { data: userData, error: signUpError } = await authStore.signUp({
        email: form.value.email,
        password: form.value.password,
    });

    if (signUpError) {
        toast({ description: signUpError.message, variant: "destructive" });
        toggleLoading();
        return;
    }

    //create profile only if User returned
    if(userData.user?.id){

        const { error: profileError } = await authStore.createProfile({
            id: userData.user.id,
            email: form.value.email,
            first_name: form.value.firstName,
            last_name: form.value.lastName,
        });

        if (profileError) {
            toast({ description: "Failed to create user profile. Please contact support.", variant: "destructive" });
        } else {
            toast({ description: "Account created successfully! Redirecting..." });
            router.push({ name: "panel.dashboard" });
        }

    }

    toggleLoading();
};

const navigateToLogin = () => {
    router.push({ name: "auth.login" });
};
</script>

<template>
    <Form class="space-y-6" @submit="submitForm()">
        <div class="flex flex-col space-y-2">
            <h1 class="text-2xl font-semibold tracking-tight">Register</h1>
            <p class="text-sm text-gray-400">Create a new account below.</p>
        </div>

        <!-- Email Input -->
        <FormField name="email" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="email">Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Email Address"
                    v-model="form.email"
                    :required="true"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
                <p v-if="emailError" class="text-sm text-red-600 mt-1">{{ emailError }}</p>
            </FormItem>
        </FormField>

        <!-- Password Input -->
        <FormField name="password" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="password">Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Password"
                    v-model="form.password"
                    :required="true"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <!-- Confirm Password Input -->
        <FormField name="confirmPassword" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="confirmPassword">Confirm Password</FormLabel>
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    v-model="form.confirmPassword"
                    :required="true"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
                <p v-if="passwordError" class="text-sm text-red-600 mt-1">{{ passwordError }}</p>
            </FormItem>
        </FormField>

        <!-- Optional First Name Input -->
        <FormField name="firstName" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="firstName">First Name (Optional)</FormLabel>
                <Input
                    type="text"
                    placeholder="First Name"
                    v-model="form.firstName"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <!-- Optional Last Name Input -->
        <FormField name="lastName" v-slot="{ componentField }">
            <FormItem>
                <FormLabel for="lastName">Last Name (Optional)</FormLabel>
                <Input
                    type="text"
                    placeholder="Last Name"
                    v-model="form.lastName"
                    :disabled="isLoading"
                    v-bind="componentField"
                />
            </FormItem>
        </FormField>

        <!-- Submit Button -->
        <div class="flex flex-col gap-4">
            <Button type="submit" id="register" name="register" :disabled="isLoading">
                <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
                Register
            </Button>
            <div class="flex flex-col gap-2 justify-between">
                <Divider text="Already have an account ?"/>
                <Button
                    type="button"
                    id="register"
                    name="register"
                    class="text-center hover:text-white bg-transparent text-black outlined"
                    :disabled="isLoading"
                    @click="navigateToLogin"
                >
                    <Loader class="mr-1 h-4 w-4 animate-spin" v-if="isLoading" />
                    Sign In
                </Button>
            </div>
        </div>
    </Form>
</template>
