import { useState, useEffect } from "react";
// PasswordInput 컴포넌트가 '../components/PassWordInput'에 있다고 가정
// 실제 코드에서는 import { useState, useEffect } from "react"; 아래에 위치해야 합니다.

// --- 유효성 검사 함수 (변경 없음) ---
const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

// Toast 상태 관리와 비밀번호 입력 필드 상태를 통합하기 위해 컴포넌트 내부에서 상태를 선언합니다.

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState({ email: "", password: "" }); // 에러 상태를 객체로 통합
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Toast 상태 추가

  // --- 1. Toast 메시지 자동 숨김 효과 (UX 개선) ---
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000); // 3초 후 토스트 메시지 제거
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- 2. 입력 필드 변경 핸들러 (값만 업데이트) ---
  const handleFieldChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    // 사용자가 입력하면 기존 에러 메시지 초기화 (UX 개선)
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // --- 3. onBlur 시 유효성 검사 핸들러 (UX 개선) ---
  const handleBlurValidation = (field, value) => {
    let errorMsg = "";

    if (value.length === 0) {
      // 비어있는 경우 onBlur 시에는 에러 표시하지 않음 (onSubmit에서 처리)
      errorMsg = "";
    } else if (field === "email" && !isValidEmail(value)) {
      errorMsg = "올바른 이메일 형식이 아닙니다.";
    } else if (field === "password" && !isValidPassword(value)) {
      errorMsg = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  // --- 4. 로그인 제출 핸들러 (최종 검사) ---
  const handleLogin = async (e) => {
    e.preventDefault();

    // 4-1. 제출 시 최종 유효성 검사 및 에러 메시지 강제 설정
    let newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!isValidEmail(email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (!isValidPassword(password)) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }

    setErrors(newErrors);

    // 4-2. 유효성 검사 통과 여부 확인
    const hasErrors = newErrors.email || newErrors.password;

    if (hasErrors) {
      setToast({ message: "입력한 정보를 확인해주세요.", type: "error" });
      return;
    }

    setLoading(true);
    setToast(null); // 로딩 시작 시 토스트 메시지 숨김

    // 4-3. 실제 서버 통신 모킹
    try {
      // await api.post('/login', { email, password, remember });
      await new Promise((resolve) => setTimeout(resolve, 1500)); // 모킹 시간 1.5초

      // 성공 시
      setToast({ message: "로그인 성공! 환영합니다.", type: "success" });
      // navigate('/dashboard'); // 페이지 이동 로직
    } catch (error) {
      // 서버 에러 처리 (예: 401 Unauthorized)
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
          <h4 className="text-2xl font-semibold">로그인 🔒</h4>
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
                errors.email ? "input-error" : ""
              }`}
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={(e) => handleBlurValidation("email", e.target.value)} // onBlur 검사 추가
              disabled={loading}
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </label>

          {/* 비밀번호 입력 컴포넌트 */}
          {/* 실제 PasswordInput 컴포넌트가 handlePasswordChange와 onBlur 로직을 내부에서 처리하도록 수정 필요 */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">비밀번호</span>
            </div>
            {/* PasswordInput 컴포넌트가 PasswordInput.jsx 파일에 있다고 가정 */}
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              className={`input input-bordered w-full ${
                errors.password ? "input-error" : ""
              }`}
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              onBlur={(e) => handleBlurValidation("password", e.target.value)} // onBlur 검사 추가
              disabled={loading}
            />
          </label>

          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}

          {/* 로그인 상태 유지 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
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

        {/* Toast 메시지 (위치 개선) */}
        {toast && (
          <div className="toast toast-bottom toast-center z-50">
            <div
              className={`alert ${
                toast.type === "error" ? "alert-error" : "alert-success"
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
