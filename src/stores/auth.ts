import supabase from "@/supabase";
import type { Tables } from "@/types/database/database.types";
import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials, User } from "@supabase/supabase-js";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const user = ref<any>({
        app_metadata: {
            provider: "",
            providers: [],
        },
        aud: "",
        confirmed_at: "",
        created_at: "",
        email: "",
        email_confirmed_at: "",
        id: "",
        identities: [],
        is_anonymous: false,
        last_sign_in_at: null,
        phone: "",
        role: "",
        updated_at: "",
        user_metadata: [],
    });

    const profile = ref<Tables<"profiles">>({
        id: "",
        email: "",
        first_name: "",
        last_name: "",
        created_at: "",
        deleted_at: "",
        updated_at: "",
    });

    const setUser = (payload: User) => {
        user.value = {
            ...user.value,
            ...payload,
        };
    };

    const setProfile = (payload: Tables<"profiles">) => {
        profile.value = {
            ...profile.value,
            ...payload,
        };
    };

    const getUser = (): User => {
        return user.value;
    };

    const getProfile = (): Tables<"profiles"> => {
        return profile.value;
    };

    const signInWithPassword = async (payload: SignInWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signInWithPassword(payload);
        return { data, error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        return error;
    };

    const signUp = async (payload: SignUpWithPasswordCredentials) => {
        const { data, error } = await supabase.auth.signUp(payload);
        return { data, error };
    };

    const createProfile = async (payload: { id: string; email: string; first_name?: string; last_name?: string }) => {
        const profilePayload = {
            id: payload.id,
            email: payload.email,
            first_name: payload.first_name || null,
            last_name: payload.last_name || null,
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from("profiles").insert(profilePayload);

        if (error) {
            console.error("Error creating profile:", error);
        }

        return { data, error };
    };

    const fetchProfile = async (): Promise<void> => {
        if (!user.value.id) {
            console.error("fetchProfile(): Authenticated User ID not found.");
        }

        const { data: userProfile } = await supabase.from("profiles").select().eq("id", user.value.id).single();

        if (userProfile) {
            setProfile(userProfile);
        } else {
            console.error("fetchProfile(): User profile not found.");
        }
    };

    return {
        setUser,
        getProfile,
        setProfile,
        getUser,
        fetchProfile,
        signInWithPassword,
        signOut,
        signUp,
        createProfile,
    };
});
