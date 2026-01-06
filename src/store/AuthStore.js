import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      id: "",
      email: "",
      role: "",

      setId: (newId) => set({ id: newId }),
      setEmail: (newEmail) => set({ email: newEmail }),
      setRole: (newRole) => set({ role: newRole }),

      // 3. 한꺼번에 유저 정보 설정
      setUser: (userData) =>
        set({
          id: userData.id,
          email: userData.email,
          role: userData.role || "",
        }),

      logout: () => {
        set({ id: "", email: "", role: "" });
        useAuthStore.persist.clearStorage(); //auth 스토어 로그 자체도 삭제해줌
        // 로컬스토리지는 persist 설정에 의해 자동으로
      },
    }),

    {
      name: "auth-storage", // 로컬스토리지 이름
    }
  )
);
