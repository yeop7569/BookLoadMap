import { useState } from "react";

export default function PasswordInput({ value, onChange, error, disabled }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-medium">비밀번호</span>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력하세요 (최소 8자)"
          className={`input input-bordered w-full pr-10 ${
            error ? "input-error" : ""
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        {/* 비밀번호 보기/숨기기 버튼 */}
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center text-sm"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled} // 버튼도 로딩 중 비활성화
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>
    </label>
  );
}
