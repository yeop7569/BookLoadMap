import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";
import supabase from "../lib/supabase";
import { toast } from "sonner";

function Header() {
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.email);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
      toast.success("로그아웃 되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 에러 발생:", error);
    }
  };

  return (
    <header className="sticky top-0 z-[200] w-full border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* 로고 */}
        <NavLink to="/" className="group flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-xl">G</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-white">
            Guide<span className="text-blue-500">Book</span>
          </span>
        </NavLink>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-8">
          <NavLink 
            to="/BookSearch" 
            className={({isActive}) => 
              `text-sm font-bold transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-400 hover:text-white'}`
            }
          >
            로드맵 탐색
          </NavLink>
          
          <div className="h-4 w-[1px] bg-zinc-800"></div>

          {email ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Signed in as</span>
                <span className="text-sm font-bold text-zinc-200">{email.split('@')[0]}님</span>
              </div>
              
              <Link
                to="/mypage"
                className="btn btn-ghost btn-sm h-10 px-5 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 border border-zinc-800 font-bold"
              >
                마이페이지
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/Signin" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors px-4">
                로그인
              </NavLink>
              <NavLink 
                to="/SignUp" 
                className="btn btn-primary btn-sm h-10 px-6 rounded-xl text-black font-black border-none shadow-lg shadow-blue-500/10"
              >
                시작하기
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
