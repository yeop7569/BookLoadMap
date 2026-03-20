import React, { useState, useCallback } from "react";
import { useAuthStore } from "../../store/AuthStore";
import supabase from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PasswordInput from "../../components/PasswordInput";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string) => {
  return password.length >= 8;
};

export default function SignIn() {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const storesetUser = useAuthStore((state) => state.setUser);

  const handleFieldChange = useCallback((field: "email" | "password", value: string) => {
    if (field === "email") setEmailInput(value);
    if (field === "password") setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }, []);

  const handleBlurValidation = useCallback((field: "email" | "password", value: string) => {
    let errorMsg = "";
    if (value.length === 0) {
      errorMsg = "";
    } else if (field === "email" && !isValidEmail(value)) {
      errorMsg = "올바른 이메일 형식이 아닙니다.";
    } else if (field === "password" && !isValidPassword(value)) {
      errorMsg = "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  }, []);

  const handleLogin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
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
        storesetUser({
          id: data.user.id,
          email: data.user.email || "",
          role: data.user.user_metadata?.role || "user",
        });

        toast.success("로그인 성공! 환영합니다.");
        setTimeout(() => navigate("/"), 500);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "로그인 실패.");
      } else {
        toast.error("로그인 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }, [emailInput, password, storesetUser, navigate]);

  return (
    <main className="w-full h-full min-h-[720px] flex justify-center items-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md border border-zinc-800 rounded-[32px] shadow-2xl p-10 flex flex-col gap-8 bg-zinc-900/40 backdrop-blur-xl">
        <div className="flex flex-col gap-2">
          <h4 className="text-3xl font-black text-white tracking-tight">로그인 🔒</h4>
          <p className="text-sm text-zinc-500 font-medium">지식의 여정을 다시 시작하세요</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium text-zinc-400">이메일</span>
            </div>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              className={`input input-bordered w-full bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 transition-all ${
                errors.email ? "input-error border-red-500" : ""
              }`}
              value={emailInput}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              onBlur={(e) => handleBlurValidation("email", e.target.value)}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>
            )}
          </label>

          <PasswordInput
            value={password}
            onChange={(val) => handleFieldChange("password", val)}
            error={!!errors.password}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-[-16px] font-medium">{errors.password}</p>
          )}

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="checkbox checkbox-sm border-zinc-700 checked:border-blue-500 [--chkbg:theme(colors.blue.500)] [--chkfg:black]"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              disabled={loading}
            />
            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">로그인 상태 유지</span>
          </label>

          <button 
            className="btn btn-primary w-full h-14 rounded-2xl text-black font-black border-none shadow-xl shadow-blue-500/10 hover:scale-[1.02] transition-transform" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "로그인"
            )}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-zinc-500">
          계정이 없으신가요?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500 font-black hover:underline ml-1"
          >
            회원가입
          </button>
        </p>
      </div>
    </main>
  );
}
