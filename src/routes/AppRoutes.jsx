import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import RescueDashboard from "../pages/RescueDashboard";
import PublicDashboard from "../pages/PublicDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rescue"
        element={
          <ProtectedRoute allowedRoles={["rescue", "admin"]}>
            <RescueDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/public"
        element={
          <ProtectedRoute allowedRoles={["public", "admin"]}>
            <PublicDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/unauthorized"
        element={
          <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
            Unauthorized Access
          </div>
        }
      />
    </Routes>
  );
}