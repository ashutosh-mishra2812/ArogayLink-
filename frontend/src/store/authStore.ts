// frontend/src/store/authStore.ts
import { User } from "@/lib/types";
import { getWithAuth, postWithoutAuth, postWithAuth } from "@/service/httpService";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthData {
  name?: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  setUser: (user: User, token: string) => void;
  clearUser: () => void;

  loginDoctor: (email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  registerDoctor: (data: AuthData) => Promise<void>;
  registerPatient: (data: AuthData) => Promise<void>;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (data: AuthData) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      setUser: (user, token) => {
        if (typeof window !== "undefined") localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true, error: null });
      },

      clearUser: () => {
        if (typeof window !== "undefined") localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("/auth/doctor/login", { email, password });
          get().setUser(res.data.user, res.data.token);
        } catch (error: any) {
          set({ error: error.message || "Login failed" });
        } finally {
          set({ loading: false });
        }
      },

      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("/auth/patient/login", { email, password });
          get().setUser(res.data.user, res.data.token);
        } catch (error: any) {
          set({ error: error.message || "Login failed" });
        } finally {
          set({ loading: false });
        }
      },

      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("/auth/doctor/register", data);
          get().setUser(res.data.user, res.data.token);
        } catch (error: any) {
          set({ error: error.message || "Registration failed" });
        } finally {
          set({ loading: false });
        }
      },

      registerPatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("/auth/patient/register", data);
          get().setUser(res.data.user, res.data.token);
        } catch (error: any) {
          set({ error: error.message || "Registration failed" });
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async (): Promise<User | null> => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("User not found");
          const endpoint = user.type === "doctor" ? "/doctor/me" : "/patient/me";
          const response = await getWithAuth(endpoint);
          set({ user: { ...user, ...response.data } });
          return response.data;
        } catch (error: any) {
          set({ error: error.message || "Failed to fetch profile" });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("User not found");
          const endpoint =
            user.type === "doctor"
              ? "/doctor/onboarding/update"
              : "/patient/onboarding/update";
          const response = await postWithAuth(endpoint, data);
          set({ user: { ...user, ...response.data } });
        } catch (error: any) {
          set({ error: error.message || "Profile update failed" });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
