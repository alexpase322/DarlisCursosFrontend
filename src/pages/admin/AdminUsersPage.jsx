import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
// Importamos iconos modernos
import { Search, Trash2, Shield, ShieldAlert, User, MoreVertical, Mail } from "lucide-react";
import { Link } from "react-router-dom";

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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rol Actual</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                                No se encontraron usuarios con ese criterio.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                        <tr key={user._id} className="hover:bg-[#FDE5E5]/20 transition-colors group">
                            
                            {/* Columna Usuario */}
                            <td className="px-8 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img 
                                            src={user.avatar || "https://via.placeholder.com/40"} 
                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                                            alt="" 
                                        />
                                        {user.role === 'admin' && (
                                            <div className="absolute -bottom-1 -right-1 bg-[#1B3854] text-white p-0.5 rounded-full border border-white">
                                                <Shield size={10} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#1B3854]">{user.username}</div>
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
                                    {user.role === 'admin' ? 'ADMINISTRADOR' : 'ESTUDIANTE'}
                                </span>
                            </td>

                            {/* Columna Estado (Decorativa por ahora, asumiendo activo) */}
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Activo
                                </span>
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
                        ))
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