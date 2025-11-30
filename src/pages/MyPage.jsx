// src/pages/MyPage.jsx (수정)

import React from "react";
import { useAuthStore } from "../store/authStore"; // 👈 Zustand Store 임포트

const MyPage = () => {
  // 💡 [핵심] 로컬 상태 대신 전역 상태만 구독합니다.
  const { isLoggedIn, login, user } = useAuthStore();

  // 1. 로그인되지 않은 경우
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 h-screen">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다. 🔒</h1>
        <p className="text-gray-600 mb-6">
          마이페이지는 로그인 후 이용할 수 있습니다.
        </p>
        <button
          onClick={login} // 🔑 [핵심] 로그인 버튼 클릭 시 전역 login 액션 호출
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          로그인하기
        </button>
      </div>
    );
  }

  // 2. 로그인된 경우 (user 객체는 store에서 가져온 실제 사용자 정보)
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        {user.email} 님의 마이페이지 👋
      </h1>
      <section className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          내 커리큘럼 관리
        </h2>
        {/* 여기에 마이페이지의 핵심 로직 (커리큘럼 CRUD)을 구현합니다. */}
        <p>사용자 전용 데이터 및 커리큘럼 편집 화면이 여기에 표시됩니다.</p>
      </section>
    </div>
  );
};

export default MyPage;
