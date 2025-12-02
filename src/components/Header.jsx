// src/components/Header.jsx

import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
export default function Header() {
  const { isLoggedIn, login, logout } = useAuthStore();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        GuideBook
      </Link>
      <Link to="/Signin">로그인</Link>
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
