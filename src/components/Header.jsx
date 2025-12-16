import { Link } from "react-router-dom";
// 1. authStore 대신 useBookStore를 가져옵니다.
import useBookStore from "../store/useBookStore";
// 2. 실제 로그아웃을 위해 supabase를 가져옵니다. (경로 확인 필요)
import supabase from "../lib/supabase";

export default function Header() {
  // 3. useBookStore에서 유저 정보와 설정 함수를 가져옵니다.
  const { user, setUser } = useBookStore();
  const isLoggedIn = !!user;

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); // 스토어의 유저 정보 비우기
    alert("로그아웃 되었습니다.");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        GuideBook
      </Link>

      <nav className="space-x-4 flex items-center">
        {!isLoggedIn ? (
          <>
            {/* 4. 가짜 login 함수 대신 실제 로그인 페이지 링크 사용 */}
            <Link to="/Signin" className="text-gray-700 hover:text-blue-500">
              로그인
            </Link>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-gray-600">
              {user.email}님
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-500"
            >
              로그아웃
            </button>
          </>
        )}

        <Link
          to={isLoggedIn ? "/mypage" : "/Signin"} // 로그인 안됐으면 로그인 페이지로
          className={
            isLoggedIn ? "text-gray-700 hover:text-blue-500" : "text-gray-400"
          }
        >
          마이페이지
        </Link>
      </nav>
    </header>
  );
}
