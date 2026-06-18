import { Navigate, Outlet } from "react-router-dom";

export const RequireAuth = () => {
  const token = localStorage.getItem("accessToken");
  return token ? <Outlet /> : <Navigate to="/onboarding" replace />;
};