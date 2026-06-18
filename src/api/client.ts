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