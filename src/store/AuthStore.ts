import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  id: string;
  email: string;
  role: string;
  setId: (newId: string) => void;
  setEmail: (newEmail: string) => void;
  setRole: (newRole: string) => void;
  setUser: (userData: { id: string; email: string; role?: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      id: "",
      email: "",
      role: "",

      setId: (newId) => set({ id: newId }),
      setEmail: (newEmail) => set({ email: newEmail }),
      setRole: (newRole) => set({ role: newRole }),

      setUser: (userData) =>
        set({
          id: userData.id,
          email: userData.email,
          role: userData.role || "",
        }),

      logout: () => {
        set({ id: "", email: "", role: "" });
        useAuthStore.persist.clearStorage();
      },
    }),

    {
      name: "auth-storage",
    }
  )
);
