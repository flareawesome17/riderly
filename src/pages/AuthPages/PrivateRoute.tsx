import { Navigate } from "react-router-dom";
import React from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const authData = localStorage.getItem("auth");

  if (!authData) {
    return <Navigate to="/signin" replace />;
  }

  try {
    const { token, role } = JSON.parse(authData);

    if (!token || role !== "admin") {
      return <Navigate to="/signin" replace />;
    }

    return <>{children}</>;
  } catch {
    return <Navigate to="/signin" replace />;
  }
}
