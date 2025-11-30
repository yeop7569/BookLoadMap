// src/store/authStore.js

import { create } from "zustand";
// ⚠️ 실제 앱에서는 여기에서 Supabase 클라이언트를 가져옵니다.
// import { supabase } from '../services/supabase';

// ----------------------------------------------------
// 임시 Supabase 로그인/로그아웃 함수 시뮬레이션
// ----------------------------------------------------
const simulateSupabaseLogin = async () => {
  // 실제 Supabase 호출을 대체하는 목업 함수
  await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5초 지연 시뮬레이션
  const mockUser = { id: "user-123", email: "test@example.com" };
  return { data: { user: mockUser } }; // 성공 시 mock user 반환
};

const simulateSupabaseLogout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { error: null }; // 성공 시 에러 없음 반환
};
// ----------------------------------------------------

export const useAuthStore = create((set) => ({
  // 1. 상태 (State)
  isLoggedIn: false, // 로그인 여부
  user: null, // 로그인된 사용자 정보

  // 2. 액션 (Actions) - 로그인/로그아웃 기능을 캡슐화

  // 로그인 액션: Supabase 호출 후 상태 업데이트
  login: async () => {
    try {
      console.log("Supabase 임시 로그인 시도...");
      // 실제 Supabase 로그인 로직 수행
      const {
        data: { user },
        error,
      } = await simulateSupabaseLogin();

      if (error) throw error;

      set({
        isLoggedIn: true,
        user: user,
      });
      console.log("로그인 성공 및 Zustand 상태 업데이트 완료");
      alert(`로그인 성공: ${user.email} 님`);
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("로그인에 실패했습니다. (콘솔 확인)");
    }
  },

  // 로그아웃 액션: Supabase 호출 후 상태 초기화
  logout: async () => {
    try {
      console.log("로그아웃 시도...");
      // 실제 Supabase 로그아웃 로직 수행
      const { error } = await simulateSupabaseLogout();

      if (error) throw error;

      set({
        isLoggedIn: false,
        user: null,
      });
      console.log("로그아웃 성공 및 Zustand 상태 업데이트 완료");
      alert("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃에 실패했습니다. (콘솔 확인)");
    }
  },

  // (선택) 앱 로드시 세션 확인 로직 등을 추가할 수 있습니다.
}));
