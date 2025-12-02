import { BiArrowToLeft } from "react-icons/bi";
import { useAuthStore } from "../store/authStore"; // 👈 Zustand Store 임포트
export default MyPage;
function MyPage() {
  // 💡 [핵심] 로컬 상태 대신 전역 상태만 구독합니다.
  const { isLoggedIn, login } = useAuthStore();

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
    <main className="w-full h-full flex gap- 6">
      <div className="fixed right-1/2 bottom-10 translate-x-1/2 z-20 flex items-center gap-2">
        <button>수정</button>
        <button>저장</button>
      </div>
    </main>
  );
}
