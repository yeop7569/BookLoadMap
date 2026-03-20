import React, { useState, useCallback } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function PasswordInput({ value, onChange, error, disabled }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <label className="form-control w-full">
      <div className="label">
        <span className="label-text font-medium text-zinc-400">비밀번호</span>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호를 입력하세요 (최소 8자)"
          className={`input input-bordered w-full pr-10 bg-zinc-900 border-zinc-800 text-white focus:border-blue-500 transition-all ${
            error ? "input-error border-red-500" : ""
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 px-3 flex items-center text-sm hover:text-blue-400 transition-colors"
          onClick={togglePasswordVisibility}
          disabled={disabled}
        >
          {showPassword ? "👁️" : "👁️‍🗨️"}
        </button>
      </div>
    </label>
  );
}
