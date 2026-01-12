import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios"; 
import io from "socket.io-client";
// AÑADIDO: Importamos icono Menu
import { LogOut, Bell, Menu, Check, MessageCircle, Heart, Info } from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

// AÑADIDO: Recibimos toggleSidebar como prop
const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const notifRef = useRef(null); 

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (user) {
        socket.emit("join_room", user._id);
        fetchNotifications();
        socket.on("new_notification", (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
        });
    }
    return () => {
        socket.off("new_notification");
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setShowNotifMenu(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
      try {
          const res = await axios.get("/notifications");
          setNotifications(res.data);
      } catch (error) {
          console.error(error);
      }
  };

  const handleMarkAsRead = async (notifId = null) => {
      try {
          if (notifId) {
              await axios.put(`/notifications/${notifId}/read`);
              setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, isRead: true } : n));
          } else {
              await axios.put(`/notifications/read-all`);
              setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          }
      } catch (error) {
          console.error(error);
      }
  };

  const handleNotifClick = async (notif) => {
      if (!notif.isRead) handleMarkAsRead(notif._id);
      setShowNotifMenu(false);
      if (notif.link) navigate(notif.link);
  };

  const getIcon = (type) => {
      switch(type) {
          case 'like': return <Heart size={16} className="text-red-500 fill-red-500" />;
          case 'comment': return <MessageCircle size={16} className="text-blue-500 fill-blue-500" />;
          default: return <Info size={16} className="text-gray-500" />;
      }
  };

  return (
    <header className="bg-white h-20 flex items-center justify-between px-4 md:px-8 shadow-sm border-b border-gray-100 z-10 relative">
      
      <div className="flex items-center gap-3">
        {/* AÑADIDO: Botón Hamburguesa (Solo visible en móvil) */}
        <button 
            onClick={toggleSidebar} 
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
        >
            <Menu size={24} />
        </button>

        {/* Saludo */}
        <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1B3854]">
            Hola, <span className="text-[#905361] capitalize">{user?.username?.split(" ")[0] || "Compañera"}</span> 👋
            </h2>
            <p className="text-xs text-gray-400 font-medium hidden md:block">
            {user?.role === 'admin' ? 'Panel de Administración' : 'Bienvenida a tu espacio'}
            </p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        
        {/* --- CENTRO DE NOTIFICACIONES --- */}
        <div className="relative" ref={notifRef}>
            <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-gray-400 hover:text-[#905361] transition-colors rounded-full hover:bg-[#FDE5E5]"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
            </button>

            {/* Dropdown Menu (Ajustado para móvil: w-72 en vez de w-80 fijo si la pantalla es muy pequeña) */}
            {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right z-50">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-bold text-[#1B3854] text-sm">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button onClick={() => handleMarkAsRead()} className="text-xs text-[#905361] hover:underline flex items-center gap-1">
                                <Check size={12} /> Marcar todas
                            </button>
                        )}
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm">
                                <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                No tienes notificaciones nuevas
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div 
                                    key={notif._id}
                                    onClick={() => handleNotifClick(notif)}
                                    className={`p-4 border-b border-gray-50 hover:bg-[#F7F2EF] cursor-pointer transition flex gap-3 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img src={notif.sender?.avatar || "https://via.placeholder.com/30"} className="w-8 h-8 rounded-full object-cover" />
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            {getIcon(notif.type)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm leading-snug ${!notif.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                            {notif.content}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-1">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!notif.isRead && <div className="w-2 h-2 bg-[#905361] rounded-full self-center"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Separador */}
        <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

        {/* Perfil */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-[#1B3854] leading-none">{user?.username}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
              {user?.role === 'admin' ? 'Admin' : 'Estudiante'}
            </p>
          </div>

          <div className="relative group cursor-pointer">
             <img 
              src={user?.avatar || "https://via.placeholder.com/40"} 
              alt="Avatar" 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-[#FDE5E5] group-hover:border-[#905361] transition-colors shadow-sm"
            />
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-500 hover:text-[#5E2B35] p-2 md:px-3 md:py-2 rounded-lg hover:bg-[#FDE5E5] transition-all duration-300 text-sm font-medium"
            title="Cerrar Sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;