import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar: Le pasamos el estado y la función para cerrar */}
      <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Overlay (Fondo oscuro) solo para móviles cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 evita desbordamientos en flex hijos */}
        
        {/* Navbar: Le pasamos la función para abrir/cerrar */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;