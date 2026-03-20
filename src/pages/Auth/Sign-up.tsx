import React, { useReducer, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";
import PasswordInput from "../../components/PasswordInput";
import { toast as sonnerToast } from "sonner";

const isValidEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string) => {
  return password.length >= 8;
};

interface State {
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
  loading: boolean;
  errors: {
    email: string;
    password: string;
    confirmPassword: string;
  };
}

type Action =
  | { type: "SET_FIELD"; field: keyof State; value: string | boolean }
  | { type: "SET_ERROR"; field: keyof State["errors"]; message: string }
  | { type: "SET_LOADING"; value: boolean }
  | { type: "SET_AGREED"; value: boolean }
  | { type: "RESET_ERRORS" };

const initialState: State = {
  email: "",
  password: "",
  confirmPassword: "",
  agreed: false,
  loading: false,
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
  },
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_AGREED":
      return { ...state, agreed: action.value };
    case "RESET_ERRORS":
      return { ...state, errors: initialState.errors };
    default:
      return state;
  }
}

export default function SignUp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, confirmPassword, agreed, loading, errors } = state;
  const navigate = useNavigate();

  const validateField = useCallback((field: string, value: string, otherValues: { password?: string, confirmPassword?: string }) => {
    let message = "";

    switch (field) {
      case "email":
        if (value.length > 0 && !isValidEmail(value)) {
          message = "올바른 이메일 형식이 아닙니다.";
        }
        break;
      case "password":
        if (value.length > 0 && !isValidPassword(value)) {
          message = "비밀번호는 최소 8자 이상이어야 합니다.";
        }
        if (
          otherValues.confirmPassword &&
          value !== otherValues.confirmPassword
        ) {
          dispatch({
            type: "SET_ERROR",
            field: "confirmPassword",
            message: "비밀번호가 일치하지 않습니다.",
          });
        } else if (otherValues.confirmPassword) {
          dispatch({
            type: "SET_ERROR",
            field: "confirmPassword",
            message: "",
          });
        }
        break;
      case "confirmPassword":
        if (value.length > 0 && value !== otherValues.password) {
          message = "비밀번호가 일치하지 않습니다.";
        }
        break;
      default:
        break;
    }

    dispatch({ type: "SET_ERROR", field: field as keyof State["errors"], message });
    return message === "";
  }, []);

  const handleFieldChange = useCallback((field: keyof State) => (value: string | boolean, isBlur = false) => {
    dispatch({ type: "SET_FIELD", field, value });
    const errorKey = field as keyof State["errors"];
    if (isBlur || errors[errorKey]) {
      validateField(field, typeof value === "string" ? value : "", { password, confirmPassword });
    }
  }, [errors, password, confirmPassword, validateField]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    dispatch({ type: "RESET_ERRORS" });

    const isEmailValid = validateField("email", email, {});
    const isPasswordValid = validateField("password", password, {
      confirmPassword,
    });
    const isPasswordMatching = validateField(
      "confirmPassword",
      confirmPassword,
      { password }
    );

    if (!agreed) {
      sonnerToast.error("이용약관에 동의해주세요.");
      return;
    }

    if (!isEmailValid || !isPasswordValid || !isPasswordMatching) {
      sonnerToast.error("입력한 정보를 확인해주세요.");
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: { emailRedirectTo: `${window.location.origin}/Signin` },
      });

      if (error) throw error;

      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            agreed: agreed,
          },
        ]);
        if (profileError)
          console.error("프로필 생성 실패:", profileError.message);
      }

      sonnerToast.success("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");

      const isConfirmRequired = data.user && data.session === null;

      if (!isConfirmRequired) {
        setTimeout(() => navigate("/Signin"), 1500);
      }
    } catch (error) {
      if (error instanceof Error) {
        sonnerToast.error(error.message);
      } else {
        sonnerToast.error("회원가입 중 알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <main className="w-full h-full min-h-[720px] flex justify-center items-center p-6 bg-[#0a0a0a]">
      <div className="w-full max-w-md border border-zinc-800 rounded-[32px] shadow-2xl p-10 flex flex-col gap-6 bg-zinc-900/40 backdrop-blur-xl">
        <div className="flex flex-col gap-1">
          <h4 className="text-3xl font-black text-white tracking-tight">회원가입 🚀</h4>
          <p className="text-sm text-zinc-500 font-medium">새로운 지식의 여정을 시작하세요</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
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
              value={email}
              onChange={(e) => handleFieldChange("email")(e.target.value)}
              onBlur={(e) => handleFieldChange("email")(e.target.value, true)}
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>
            )}
          </label>

          <PasswordInput
            value={password}
            onChange={(val) => handleFieldChange("password")(val)}
            error={!!errors.password}
            disabled={loading}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-[-12px] font-medium">{errors.password}</p>
          )}

          <div className="form-control">
             <div className="label">
                <span className="label-text font-medium text-zinc-400">비밀번호 확인</span>
              </div>
            <PasswordInput
              value={confirmPassword}
              onChange={(val) => handleFieldChange("confirmPassword")(val)}
              error={!!errors.confirmPassword}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-2 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group mt-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm border-zinc-700 checked:border-blue-500 [--chkbg:theme(colors.blue.500)] [--chkfg:black]"
              checked={agreed}
              onChange={(e) =>
                dispatch({ type: "SET_AGREED", value: e.target.checked })
              }
              disabled={loading}
            />
            <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300 transition-colors">
              이용약관 및 개인정보처리방침에 동의합니다
            </span>
          </label>

          <button className="btn btn-primary w-full h-14 rounded-2xl text-black font-black mt-4 shadow-xl shadow-blue-500/10 hover:scale-[1.02] transition-transform border-none" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "회원가입"
            )}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-zinc-500">
          이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-500 font-black hover:underline ml-1"
          >
            로그인
          </button>
        </p>
      </div>
    </main>
  );
}
