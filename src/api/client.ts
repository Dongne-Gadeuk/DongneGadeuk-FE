const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const apiFetch = (path: string, init: RequestInit = {}) => {
  const token = localStorage.getItem("accessToken");
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// JSON 요청/응답 전용 래퍼. apiFetch 위에 Content-Type + 파싱 + 에러 처리만 추가.
export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const json = await res.json();

  // 인증 실패 시 토큰 정리 (선택)
  if (res.status === 401) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  // BaseResponse는 success 필드 있음 / 방 API는 raw라 undefined → 통과
  if (!res.ok || json?.success === false) {
    throw new Error(json?.message ?? "요청에 실패했습니다.");
  }

  return json as T;
}