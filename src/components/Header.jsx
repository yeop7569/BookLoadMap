// src/components/Header.jsx

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore"; // 👈 Zustand Store 임포트

export default function Header() {
  // 💡 [핵심] Zustand에서 필요한 상태와 함수를 구조 분해 할당으로 가져옵니다.
  const { isLoggedIn, login, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyApp
      </Link>
      <nav className="space-x-4">
        {!isLoggedIn ? (
          // 🔑 로그인 버튼 클릭 시: 전역 login 액션 호출
          <button onClick={login} className="text-gray-700 hover:text-blue-500">
            로그인
          </button>
        ) : (
          // 🔑 로그아웃 버튼 클릭 시: 전역 logout 액션 호출
          <button
            onClick={logout}
            className="text-gray-700 hover:text-blue-500"
          >
            로그아웃
          </button>
        )}
        <Link
          // 로그인 상태에 따라 MyPage 링크 활성화/비활성화
          to={isLoggedIn ? "/mypage" : "#"}
          className={
            isLoggedIn
              ? "text-gray-700 hover:text-blue-500"
              : "text-gray-400 cursor-not-allowed"
          }
        >
          마이페이지
        </Link>
      </nav>
    </header>
  );
}
