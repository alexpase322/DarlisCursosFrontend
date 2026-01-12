import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
// AÑADIDO: Importamos icono X para cerrar en móvil
import { LayoutDashboard, MessageCircle, BookOpen, User, Users, ShieldCheck, X } from "lucide-react";

// AÑADIDO: Recibimos isOpen y closeSidebar
const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Muro Social", path: "/muro", icon: <Users size={20} /> },
    { name: "Mis Cursos", path: "/dashboard", icon: <BookOpen size={20} /> },
    { name: "Chat", path: "/chat", icon: <MessageCircle size={20} /> },
    { name: "Mi Perfil", path: "/perfil", icon: <User size={20} /> },
  ];

  if (user?.role === "admin") {
    menuItems.unshift({ name: "Panel Admin", path: "/admin", icon: <ShieldCheck size={20} /> });
  }

  return (
    <>
    {/* MODIFICADO: Clases CSS para responsive.
       - 'fixed inset-y-0 left-0 z-30': Fijo en móvil, por encima de todo.
       - 'transform transition-transform duration-300': Animación suave.
       - isOpen ? 'translate-x-0' : '-translate-x-full': Muestra u oculta en móvil.
       - 'md:relative md:translate-x-0': En escritorio siempre visible y relativo (no flota).
    */}
    <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#1B3854] text-white shadow-xl 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-col min-h-screen
    `}>
      
      {/* Header del Sidebar */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-[#2a4d6e]">
        <h1 className="text-2xl font-bold tracking-wider">
          Moms<span className="text-[#905361]">Digitales</span>
        </h1>
        {/* Botón cerrar solo visible en móvil */}
        <button onClick={closeSidebar} className="md:hidden text-gray-300 hover:text-white">
            <X size={24} />
        </button>
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
                  onClick={closeSidebar} // AÑADIDO: Cerrar menú al hacer clic en un link (UX móvil)
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-[#905361] text-white shadow-lg shadow-[#905361]/40 translate-x-1" 
                      : "text-gray-300 hover:bg-[#2a4d6e] hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-white"} transition-colors`}>
                    {item.icon}
                  </span>
                  
                  <span className="font-medium text-sm tracking-wide">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#2a4d6e] text-center">
        <p className="text-xs text-gray-400">v1.0.0 MomsPlatform</p>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;