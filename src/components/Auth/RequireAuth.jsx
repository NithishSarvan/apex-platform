import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAccessToken } from "../../api/auth";

export default function RequireAuth({ children }) {
  const token = getAccessToken();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

