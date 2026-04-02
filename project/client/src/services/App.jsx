import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Admin/Dashboard";
import Profile from "./pages/Profile";

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem("authData") || "null");
  } catch {
    return null;
  }
}

function RequireAuth({ children }) {
  const authData = getStoredAuth();

  if (!authData?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RequireRole({ role, children }) {
  const authData = getStoredAuth();
  const currentRole = authData?.user?.role?.name;

  if (!authData?.token) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole !== role) {
    return <Navigate to={currentRole === "ADMIN" ? "/admin/dashboard" : "/"} replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin/dashboard" element={<RequireRole role="ADMIN"><Dashboard /></RequireRole>} />
      <Route path="/profile" element={<RequireRole role="CUSTOMER"><Profile /></RequireRole>} />
    </Routes>
  );
}
