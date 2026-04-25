import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Acceso reservado a afiliadas Nivel 2+ o admin.
const PartnerRoute = ({ minLevel = 2 }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="text-center mt-20">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Outlet />;
  if ((user?.partnerLevel || 1) < minLevel) {
    return <Navigate to="/afiliada/aplicar" replace />;
  }
  return <Outlet />;
};

export default PartnerRoute;
