import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import supabase from "../lib/supabase";

function Header() {
  const navigate = useNavigate();

  // Zustand 스토어에서 데이터와 로그아웃 함수 가져오기

  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout(); // Zustand 스토어 초기화
      alert("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      {/* 로고 링크 */}
      <NavLink to="/" className="text-xl font-bold text-blue-600">
        GuideBook
      </NavLink>

      <nav className="space-x-4 flex items-center">
        {/* email 값이 있을 때만 유저 정보와 로그아웃 버튼 표시 */}
        {email ? (
          <>
            <span className="text-sm font-medium text-gray-600">{email}님</span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-500"
            >
              로그아웃
            </button>
          </>
        ) : (
          <NavLink to="/Signin" className="text-gray-700 hover:text-blue-500">
            로그인
          </NavLink>
        )}

        {/* 마이페이지 링크 (email 존재 여부로 로그인 체크) */}
        <Link
          to={email ? "/mypage" : "/Signin"}
          className={
            email ? "text-gray-700 hover:text-blue-500" : "text-gray-400"
          }
        >
          마이페이지
        </Link>
      </nav>
    </header>
  );
}

export default Header;
