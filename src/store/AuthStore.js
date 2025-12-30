import { create } from "zustand";

export const useAuthStore = create((set) => ({
  id: "",
  email: "",
  role: "",

  setId: (newId) => set({ id: newId }),

  setEmail: (newEmail) => set({ email: newEmail }),

  setRole: (newRole) => set({ role: newRole }),
  logout: () => set({ id: "", email: "", role: "" }), //로그아웃시 값 초기화
}));
