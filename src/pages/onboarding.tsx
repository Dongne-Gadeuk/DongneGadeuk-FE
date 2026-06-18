// src/pages/onboarding.tsx
import { useNavigate } from "react-router-dom";
import logo2 from "@/assets/logo2.png";

export const OnboardingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 pb-8 pt-4">
      {/* 로고 + 문구 영역 (중앙) */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-10 text-center">
          <h1 className="text-lg font-bold text-brown">
            영수증으로 채우는 우리 동네
          </h1>
          <p className="mt-3 text-base text-grey">동네를 가득 채워요</p>
        </div>
        <img src={logo2} alt="동네가득 로고" className="h-44 w-auto" />
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="h-14 w-full rounded-2xl bg-[#EDE4DE] text-base font-medium text-brown"
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="h-14 w-full rounded-2xl bg-point-khaki text-base font-medium text-white"
        >
          회원 가입
        </button>
      </div>
    </div>
  );
};