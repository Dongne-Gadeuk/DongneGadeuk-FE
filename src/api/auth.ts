const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface AuthResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    userId: number;
    username: string;
    nickname: string;
  };
}

/* ---------- 회원가입 ---------- */
export interface SignupRequest {
  username: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

export type SignupResponse = AuthResponse;

export const signup = async (body: SignupRequest): Promise<SignupResponse> => {
  const res = await fetch(`${BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as SignupResponse;

  if (!res.ok || !json.success) {
    throw new Error(json?.message ?? "회원가입에 실패했습니다.");
  }

  return json;
};

/* ---------- 로그인 ---------- */
export interface LoginRequest {
  username: string;
  password: string;
}

export type LoginResponse = AuthResponse;

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  // 실제 로그인 엔드포인트에 맞게 경로를 확인/수정하세요.
  const res = await fetch(`${BASE_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as LoginResponse;

  if (!res.ok || !json.success) {
    throw new Error(json?.message ?? "로그인에 실패했습니다.");
  }

  return json;
};