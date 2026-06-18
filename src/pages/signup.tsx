import { useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import mainLogo from "@/assets/logo01.png";
import { signup } from "@/api/auth";

interface SignupForm {
    nickname: string;
    email: string;
    password: string;
    passwordConfirm: string;
    }

    const NICKNAME_MAX = 10;

    export const SignupPage = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState<SignupForm>({
        nickname: "",
        email: "",
        password: "",
        passwordConfirm: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleChange =
        (key: keyof SignupForm) => (e: ChangeEvent<HTMLInputElement>) => {
        const value =
            key === "nickname"
            ? e.target.value.slice(0, NICKNAME_MAX)
            : e.target.value;
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrorMessage("");
        };

    const passwordMismatch =
        form.passwordConfirm.length > 0 && form.password !== form.passwordConfirm;

    const isValid =
        form.nickname.trim().length > 0 &&
        form.email.trim().length > 0 &&
        form.password.length > 0 &&
        form.password === form.passwordConfirm;

    const handleNext = async () => {
        if (!isValid || submitting) return;

        setSubmitting(true);
        setErrorMessage("");

        try {
        const res = await signup({
            username: form.email.trim(), // 화면의 "아이디" 필드 → username
            password: form.password,
            passwordConfirm: form.passwordConfirm,
            nickname: form.nickname.trim(),
        });

        // TODO: 프로젝트의 인증 처리 방식(전역 상태/스토어 등)에 맞게 교체하세요.
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);

        navigate("/", { replace: true });
        } catch (err) {
        setErrorMessage(
            err instanceof Error ? err.message : "회원가입에 실패했습니다."
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
            <Field label="닉네임">
            <div className="relative">
                <input
                value={form.nickname}
                onChange={handleChange("nickname")}
                placeholder="사용할 닉네임을 입력해 주세요."
                className="h-14 w-full rounded-2xl border border-[#EEEAE6] bg-white pl-4 pr-16 text-base text-primary outline-none placeholder:text-[#BDB8B2] focus:border-point-khaki"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#BDB8B2]">
                {form.nickname.length}/{NICKNAME_MAX}
                </span>
            </div>
            </Field>

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

            <Field label="비밀번호 확인">
            <input
                type="password"
                value={form.passwordConfirm}
                onChange={handleChange("passwordConfirm")}
                placeholder="사용할 비밀번호를 입력해 주세요."
                className={`h-14 w-full rounded-2xl border bg-white px-4 text-base text-primary outline-none placeholder:text-[#BDB8B2] focus:border-point-khaki ${
                passwordMismatch ? "border-red-400" : "border-[#EEEAE6]"
                }`}
            />
            {passwordMismatch && (
                <p className="mt-1 pl-1 text-xs text-red-400">
                비밀번호가 일치하지 않습니다.
                </p>
            )}
            </Field>
        </div>

        {/* 서버 에러 메시지 */}
        {errorMessage && (
            <p className="mt-4 text-center text-sm text-red-500">{errorMessage}</p>
        )}

        {/* 하단 버튼 */}
        <button
            type="button"
            onClick={handleNext}
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