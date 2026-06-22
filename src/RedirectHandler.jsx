import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export default function RedirectHandler() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return; // wait for Firebase

    if (!user) {
      if (location.pathname !== "/") {
        navigate("/");
      }
      return;
    }

    if (role === "admin" && location.pathname !== "/admin") {
      navigate("/admin");
    } 
    else if (role === "rescue" && location.pathname !== "/rescue") {
      navigate("/rescue");
    } 
    else if (role === "public" && location.pathname !== "/public") {
      navigate("/public");
    }
  }, [user, role, loading, navigate, location.pathname]);

  return null;
}