import { useAuthStore } from "../../store/AuthStore";
import { useState, useEffect } from "react";
import supabase from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

export default function SignIn() {
  // 1. 로컬 입력 상태 (setEmail 이름을 겹치지 않게 변경)
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // 2. Zustand 스토어 함수 (이름을 storeSet...으로 명확히 구분)

  const storesetUser = useAuthStore((state) => state.setUser);

  const handleFieldChange = (field, value) => {
    if (field === "email") setEmailInput(value);
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

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인 시도 ");

    let newErrors = { email: "", password: "" };
    if (!emailInput) newErrors.email = "이메일을 입력해주세요.";
    if (!password) newErrors.password = "비밀번호를 입력해주세요.";

    setErrors(newErrors);
    if (newErrors.email || newErrors.password) {
      toast.error("입력한 정보를 확인해주세요.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: password,
      });

      if (error) throw error;

      if (data?.user) {
        // ✅ Zustand 스토어에 데이터 저장
        storesetUser({
          id: data.user.id,
          email: data.user.email,
          role: data.user.user_metadata?.role || "user",
        });

        toast.success("로그인 성공! 환영합니다.");
        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      toast.error(error.message || "로그인 실패.");
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
              value={emailInput}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={(e) => handleBlurValidation("email", e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </label>

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
              onBlur={(e) => handleBlurValidation("password", e.target.value)}
              disabled={loading}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </label>

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

          <button className="btn btn-neutral w-full mt-2" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          계정이 없으신가요?{" "}
          <a
            href="/signup"
            className="text-blue-500 font-medium hover:underline"
          >
            회원가입
          </a>
        </p>

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
