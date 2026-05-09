import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
// Importamos iconos modernos
import { Search, Trash2, Shield, ShieldAlert, User, MoreVertical, Mail, Flame, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import AvatarFrame from "../../components/AvatarFrame";

const TIER_LABEL = {
  bronze:  { name: 'Bronce',   cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  silver:  { name: 'Plata',    cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  gold:    { name: 'Oro',      cls: 'bg-amber-100 text-amber-700 border-amber-300' },
  diamond: { name: 'Diamante', cls: 'bg-gradient-to-r from-cyan-100 to-purple-100 text-cyan-700 border-cyan-200' }
};
const PARTNER_NAME = { 1: 'Alumna', 2: 'Partner', 3: 'Seller', 4: 'Closer' };

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [search]); 

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`/users?search=${search}`);
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar a este usuario de la base de datos?")) return;
    try {
      await axios.delete(`/users/${id}`);
      toast.success("Usuario eliminado");
      // Optimista: actualizamos estado local sin recargar todo
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const actionText = newRole === 'admin' ? 'promover a Administrador' : 'quitar permisos de Admin';
    
    if (!window.confirm(`¿Estás seguro de ${actionText}?`)) return;
    
    try {
      await axios.put(`/users/${id}/role`, { role: newRole });
      toast.success(`Rol actualizado a ${newRole}`);
      // Actualización optimista
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (error) {
      toast.error("Error al cambiar rol");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      
      {/* HEADER & NAVEGACIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <Link to="/admin" className="text-gray-400 hover:text-[#905361] transition text-sm">← Volver al Panel</Link>
            </div>
            <h1 className="text-3xl font-bold text-[#1B3854]">Gestión de Usuarios</h1>
            <p className="text-gray-500">Administra roles y accesos de la plataforma.</p>
        </div>
      </div>
      
      {/* BARRA DE BÚSQUEDA */}
      <div className="relative mb-8 max-w-lg">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
        </div>
        <input
            type="text"
            placeholder="Buscar por nombre o correo electrónico..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#905361] focus:border-transparent outline-none transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {loading ? (
            <div className="p-10 flex justify-center text-[#905361]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
            </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-50">
                <thead className="bg-gray-50/50">
                    <tr>
                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nivel logro</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Partner</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Racha</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-10 text-center text-gray-400">
                                No se encontraron usuarios con ese criterio.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => {
                          const tierMeta = user.topAchievementTier ? TIER_LABEL[user.topAchievementTier] : null;
                          return (
                        <tr key={user._id} className="hover:bg-[#FDE5E5]/20 transition-colors group">

                            {/* Columna Usuario con marco */}
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <AvatarFrame
                                        src={user.avatar || "https://via.placeholder.com/40"}
                                        tier={user.topAchievementTier}
                                        size="md"
                                        showBadge={!!user.topAchievementTier}
                                    />
                                    <div>
                                        <div className="font-bold text-[#1B3854] flex items-center gap-1">
                                            {user.username}
                                            {user.role === 'admin' && <Shield size={12} className="text-[#1B3854]" />}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Mail size={12} /> {user.email}
                                        </div>
                                    </div>
                                </div>
                            </td>

                            {/* Columna Rol */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                                    user.role === 'admin'
                                    ? 'bg-[#1B3854] text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {user.role === 'admin' ? 'ADMIN' : 'ESTUDIANTE'}
                                </span>
                            </td>

                            {/* Columna Nivel logro (tier) */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {tierMeta ? (
                                    <span className={`px-2.5 py-1 inline-flex items-center gap-1 text-xs font-bold rounded-full border ${tierMeta.cls}`}>
                                        <Trophy size={11} /> {tierMeta.name}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-300">—</span>
                                )}
                            </td>

                            {/* Columna Partner level */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.partnerLevel >= 2 ? (
                                    <span className="px-2.5 py-1 inline-flex text-xs font-bold rounded-full bg-[#FDE5E5] text-[#905361]">
                                        N{user.partnerLevel} · {PARTNER_NAME[user.partnerLevel]}
                                    </span>
                                ) : (
                                    <span className="text-xs text-gray-400">{PARTNER_NAME[user.partnerLevel || 1]}</span>
                                )}
                            </td>

                            {/* Columna Racha */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600">
                                    <Flame size={12} /> {user.currentStreak || 0}
                                    {user.longestStreak > (user.currentStreak || 0) && (
                                        <span className="text-gray-400 ml-1">/ {user.longestStreak}</span>
                                    )}
                                </span>
                            </td>

                            {/* Columna Estado */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.status === 'active' ? (
                                    <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Activo
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2 text-sm text-amber-600 font-medium">
                                        <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                                        Pendiente
                                    </span>
                                )}
                            </td>

                            {/* Columna Acciones */}
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    
                                    {/* Botón Cambiar Rol */}
                                    <button 
                                        onClick={() => handleRoleChange(user._id, user.role)} 
                                        className={`p-2 rounded-lg transition-colors border ${
                                            user.role === 'admin' 
                                            ? 'text-orange-500 border-orange-100 hover:bg-orange-50' 
                                            : 'text-[#1B3854] border-gray-200 hover:bg-gray-50'
                                        }`}
                                        title={user.role === 'admin' ? "Degradar a Usuario" : "Promover a Admin"}
                                    >
                                        {user.role === 'admin' ? <ShieldAlert size={18} /> : <Shield size={18} />}
                                    </button>

                                    {/* Botón Eliminar */}
                                    <button 
                                        onClick={() => handleDelete(user._id)} 
                                        className="p-2 text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                                        title="Eliminar Usuario"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        );
                        })
                    )}
                </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;