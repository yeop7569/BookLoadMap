import { useState, useEffect } from "react";
import PasswordInput from "../components/PassWordInput";

// --- 유효성 검사 함수 ---

// 이메일 유효성 검사 (결과를 직접 반환)
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 비밀번호 유효성 검사 (최소 길이 8자)
const isValidPassword = (password) => {
  return password.length >= 8;
};

// ----------------------

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);

  // 이메일 입력 핸들러: 실시간으로 에러 메시지 업데이트
  const handleEmailChange = (value) => {
    setEmail(value);
    if (value.length > 0 && !isValidEmail(value)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    } else {
      setEmailError("");
    }
  };

  // 비밀번호 입력 핸들러: 실시간으로 에러 메시지 업데이트
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value.length > 0 && !isValidPassword(value)) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. 제출 시 최종 유효성 검사 및 에러 메시지 강제 설정
    const isEmailValid = isValidEmail(email);
    const isPasswordValid = isValidPassword(password);

    if (!isEmailValid) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
    }

    if (!isPasswordValid) {
      setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
    }

    // 2. 모든 필드가 유효한지 확인
    if (!email || !password || !isEmailValid || !isPasswordValid) {
      setToast({ message: "입력한 정보를 확인해주세요.", type: "error" });
      return;
    }

    setLoading(true);

    // 3. 실제 서버 통신 모킹 (try/catch 구조 유지)
    try {
      // await api.post('/login', { email, password, remember }); // 실제 통신 코드

      await new Promise((resolve) => setTimeout(resolve, 1500)); // 모킹 시간 1.5초

      setToast({ message: "로그인 성공!", type: "success" });
    } catch (error) {
      // 실제 API 에러 처리 로직
      setToast({
        message: "로그인 실패. 이메일 또는 비밀번호를 확인해주세요.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full h-full min-h-[720px] flex justify-center items-center p-6">
      <div className="w-full max-w-md border rounded-xl shadow p-8 flex flex-col gap-6 bg-base-100">
         
        <div className="flex flex-col gap-1">
          <h4 className="text-2xl font-semibold">로그인</h4>
          <p className="text-sm text-gray-500">계속하려면 로그인하세요</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* 이메일 입력 필드 */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">이메일</span>
            </div>

            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className={`input input-bordered w-full ${
                emailError ? "input-error" : ""
              }`}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              disabled={loading} // 로딩 중 비활성화
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </label>

          {/* 비밀번호 입력 컴포넌트 */}
          <PasswordInput
            value={password}
            onChange={handlePasswordChange}
            error={!!passwordError} // PasswordInput에 에러 유무 전달
            disabled={loading} // 로딩 중 비활성화
          />
          {passwordError && (
            <p className="text-red-500 text-sm mt-1">{passwordError}</p>
          )}

          {/* 로그인 상태 유지 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading} // 로딩 중 비활성화
            />
            <span className="text-sm">로그인 상태 유지</span>
          </label>

          {/* 로그인 버튼 */}
          <button className="btn btn-neutral w-full mt-2" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "로그인"
            )}
          </button>
        </form>
        {/* 회원가입 링크 */}
        <p className="text-center text-sm mt-4">
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            회원가입
          </a>
        </p>
      </div>
    </main>
  );
}
