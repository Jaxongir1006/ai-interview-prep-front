import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { hasSession } from "../lib/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  if (!hasSession()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
