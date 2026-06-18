import { useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/logo01.png";
import { login } from "@/api/auth";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange =
    (key: keyof LoginForm) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
      setErrorMessage("");
    };

  const isValid =
    form.email.trim().length > 0 && form.password.length > 0;

  const handleSubmit = async () => {
    if (!isValid || submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await login({
        username: form.email.trim(), // 화면의 "아이디" 필드 → username
        password: form.password,
      });

      // TODO: 프로젝트의 인증 처리 방식(전역 상태/스토어 등)에 맞게 교체하세요.
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      navigate("/", { replace: true });
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "로그인에 실패했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white px-6 pb-8 pt-4">
      {/* 뒤로가기 */}
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="w-fit text-2xl leading-none text-primary"
      >
        ←
      </button>

      {/* 로고 */}
      <div className="mb-10 mt-6 flex justify-center">
        <img src={mainLogo} alt="동네가득 로고" className="h-12 w-auto" />
      </div>

      {/* 입력 폼 */}
      <div className="flex flex-1 flex-col gap-5">
        <Field label="아이디">
          <input
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            placeholder="이메일을 입력해 주세요."
            className="h-14 w-full rounded-2xl border border-[#EEEAE6] bg-white px-4 text-base text-primary outline-none placeholder:text-[#BDB8B2] focus:border-point-khaki"
          />
        </Field>

        <Field label="비밀번호">
          <input
            type="password"
            value={form.password}
            onChange={handleChange("password")}
            placeholder="사용할 비밀번호를 입력해 주세요."
            className="h-14 w-full rounded-2xl border border-[#EEEAE6] bg-white px-4 text-base text-primary outline-none placeholder:text-[#BDB8B2] focus:border-point-khaki"
          />
        </Field>
      </div>

      {/* 서버 에러 메시지 */}
      {errorMessage && (
        <p className="mt-4 text-center text-sm text-red-500">{errorMessage}</p>
      )}

      {/* 하단 버튼 */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isValid || submitting}
        className="mt-6 h-14 w-full rounded-2xl bg-[#7c8b63] text-base font-medium text-white transition-opacity disabled:opacity-50"
      >
        {submitting ? "처리 중..." : "다음"}
      </button>
    </div>
  );
};

interface FieldProps {
  label: string;
  children: ReactNode;
}

const Field = ({ label, children }: FieldProps) => (
  <div>
    <label className="mb-2 block text-base font-semibold text-primary">
      {label}
    </label>
    {children}
  </div>
);