import axios from "axios";

// 프록시 쓰면 baseURL 비워두면 됨(/api/... 상대경로). 배포 시 env로 주입.
export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  headers: { "Content-Type": "application/json" },
});