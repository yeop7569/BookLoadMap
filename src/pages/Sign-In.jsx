import { useState, useEffect } from "react";
import supabase from "../lib/supabase";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: "", password: "" }); // 에러 상태를 객체로 통합
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // Toast 상태 추가

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleFieldChange = (field, value) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlurValidation = (field, value) => {
    let errorMsg = "";

    if (value.length === 0) {
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

    // 수파베이스 연동 부분
    try {
      // 🚀 실제 Supabase 로그인 코드 적용
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log("로그인 시도 결과:", { data, error });

      if (error) throw error; // 에러가 있으면 catch 블록으로 던짐

      // 성공 시
      setToast({ message: "로그인 성공! 환영합니다.", type: "success" });

      // 2초 뒤 메인 페이지 또는 대시보드로 이동
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      // 서버 에러 처리 (비밀번호 틀림, 존재하지 않는 계정 등)
      setToast({
        message: error.message || "로그인 실패. 정보를 확인해주세요.",
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
