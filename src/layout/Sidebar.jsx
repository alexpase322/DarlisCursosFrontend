import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
// Importamos iconos modernos
import { LayoutDashboard, MessageCircle, BookOpen, User, Users, ShieldCheck } from "lucide-react";

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Definimos los items con sus iconos correspondientes
  const menuItems = [
    { name: "Muro Social", path: "/muro", icon: <Users size={20} /> },
    { name: "Mis Cursos", path: "/dashboard", icon: <BookOpen size={20} /> },
    { name: "Chat", path: "/chat", icon: <MessageCircle size={20} /> },
    { name: "Mi Perfil", path: "/perfil", icon: <User size={20} /> },
  ];

  // Panel Admin al inicio si corresponde
  if (user?.role === "admin") {
    menuItems.unshift({ name: "Panel Admin", path: "/admin", icon: <ShieldCheck size={20} /> });
  }

  return (
    <aside className="w-64 bg-[#1B3854] text-white min-h-screen hidden md:flex flex-col shadow-xl z-20">
      {/* Header del Sidebar */}
      <div className="h-20 flex items-center justify-center border-b border-[#2a4d6e]">
        <h1 className="text-2xl font-bold tracking-wider">
          Moms<span className="text-[#905361]">Digitales</span>
        </h1>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-[#905361] text-white shadow-lg shadow-[#905361]/40 translate-x-1" 
                      : "text-gray-300 hover:bg-[#2a4d6e] hover:text-white"
                  }`}
                >
                  {/* Icono */}
                  <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-white"} transition-colors`}>
                    {item.icon}
                  </span>
                  
                  {/* Texto */}
                  <span className="font-medium text-sm tracking-wide">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer del Sidebar (Opcional, versión de la app) */}
      <div className="p-4 border-t border-[#2a4d6e] text-center">
        <p className="text-xs text-gray-400">v1.0.0 MomsPlatform</p>
      </div>
    </aside>
  );
};

export default Sidebar;