import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Este componente envuelve las rutas que queremos proteger
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Cargando sistema...</div>;

  // 1. Si no está logueado, al login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 2. Si hay roles definidos y el usuario no tiene el rol correcto, al home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     return <Navigate to="/" replace />; // O a una página de "No autorizado"
  }

  // 3. Si todo bien, renderiza el componente hijo
  return <Outlet />;
};

export default ProtectedRoute;