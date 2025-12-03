import { useReducer } from "react";
// PasswordInput 컴포넌트가 '../components/PasswordInput'에 있다고 가정
// import PasswordInput from "../components/PasswordInput";
// 여기서는 외부 컴포넌트 없이 간단한 input으로 대체하겠습니다.
const PasswordInput = ({ value, onChange, error, disabled, placeholder }) => (
  <>
    <input
      type="password"
      placeholder={placeholder}
      className={`input input-bordered w-full ${error ? "input-error" : ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onChange(e.target.value, true)} // onBlur 시 isBlur = true 전달
      disabled={disabled}
    />
    {/* 실제 PasswordInput은 비밀번호 보이기/숨기기 아이콘 포함 */}
  </>
);

// --- 유효성 검사 함수 (변경 없음) ---
const isValidEmail = (email) => {
  // 실제 프로덕션에서는 더 엄격한 정규식을 사용해야 합니다.
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

// --- 상태 관리: Reducer 패턴 적용 ---

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  agreed: false,
  loading: false,
  toast: null,
  errors: {
    email: "",
    password: "",
    confirmPassword: "",
  },
};

function reducer(state, action) {
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
    case "SET_TOAST":
      return { ...state, toast: action.value };
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
  const { email, password, confirmPassword, agreed, loading, toast, errors } =
    state;

  // --- 유효성 검사 로직 통합 함수 ---
  const validateField = (field, value, otherValues) => {
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
        // 비밀번호가 변경될 때 확인 비밀번호도 재검사 (일치하지 않는 경우 에러 메시지 초기화)
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

    dispatch({ type: "SET_ERROR", field, message });
    return message === ""; // 유효성 통과 여부 반환
  };

  // --- 필드 변경 핸들러: onBlur 시에만 에러 검사 수행 ---
  const handleFieldChange =
    (field) =>
    (value, isBlur = false) => {
      dispatch({ type: "SET_FIELD", field, value });

      // onBlur 시에만 에러 메시지를 표시하거나, 에러가 이미 있는 상태라면 실시간으로 업데이트
      if (isBlur || errors[field]) {
        validateField(field, value, { password, confirmPassword });
      }
    };

  // --- 회원가입 제출 ---
  const handleSignup = async (e) => {
    e.preventDefault();

    dispatch({ type: "RESET_ERRORS" });

    // 최종 유효성 검사
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
      dispatch({
        type: "SET_TOAST",
        value: { message: "이용약관에 동의해주세요.", type: "error" },
      });
      return;
    }

    if (!isEmailValid || !isPasswordValid || !isPasswordMatching) {
      dispatch({
        type: "SET_TOAST",
        value: { message: "입력한 정보를 확인해주세요.", type: "error" },
      });
      return;
    }

    dispatch({ type: "SET_LOADING", value: true });
    dispatch({ type: "SET_TOAST", value: null }); // 기존 토스트 메시지 숨김

    try {
      // 실제 API 호출 로직: await api.post('/signup', { email, password });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      dispatch({
        type: "SET_TOAST",
        value: {
          message: "회원가입 성공! 로그인 페이지로 이동합니다.",
          type: "success",
        },
      });
      // 성공 후 로그인 페이지로 이동 로직: navigate('/login');
    } catch (error) {
      dispatch({
        type: "SET_TOAST",
        value: { message: "회원가입 실패. 다시 시도해주세요.", type: "error" },
      });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <main className="w-full h-full min-h-[720px] flex justify-center items-center p-6">
      <div className="w-full max-w-md border rounded-xl shadow p-8 flex flex-col gap-6 bg-base-100">
        <div className="flex flex-col gap-1">
          <h4 className="text-2xl font-semibold">회원가입 🚀</h4>
          <p className="text-sm text-gray-500">새 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
              onChange={(e) => handleFieldChange("email")(e.target.value)}
              onBlur={(e) => handleFieldChange("email")(e.target.value, true)} // onBlur 시 유효성 검사
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </label>

          {/* 비밀번호 입력 */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">비밀번호</span>
            </div>
            <PasswordInput
              value={password}
              onChange={handleFieldChange("password")} // onBlur 처리는 PasswordInput 내부에서 처리하도록 가정
              error={!!errors.password}
              disabled={loading}
              placeholder="비밀번호를 입력하세요 (최소 8자)"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </label>

          {/* 비밀번호 확인 입력 */}
          <label className="form-control w-full">
            <div className="label">
              <span className="label-text font-medium">비밀번호 확인</span>
            </div>
            <PasswordInput
              value={confirmPassword}
              onChange={handleFieldChange("confirmPassword")} // onBlur 처리는 PasswordInput 내부에서 처리하도록 가정
              error={!!errors.confirmPassword}
              disabled={loading}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </label>

          {/* 이용약관 동의 체크박스 */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="checkbox"
              checked={agreed}
              onChange={(e) =>
                dispatch({ type: "SET_AGREED", value: e.target.checked })
              }
              disabled={loading}
            />
            <span className="text-sm">
              이용약관 및 개인정보처리방침에 동의합니다
            </span>
          </label>

          {/* 회원가입 버튼 */}
          <button className="btn btn-neutral w-full mt-2" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "회원가입"
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <p className="text-center text-sm mt-4">
          이미 계정이 있으신가요?{" "}
          <a
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            로그인
          </a>
        </p>

        {/* Toast 메시지 (위치 개선) */}
        {toast && (
          <div className="toast toast-bottom toast-center z-50">
            {" "}
            {/* toast-bottom으로 위치 변경 및 z-index 추가 */}
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
