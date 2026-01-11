import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
// Importamos los iconos de Lucide
import { Users, Mail, Plus, Trash2, Settings, X, Search } from "lucide-react";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Invitación
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  // Cargar cursos
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/courses");
      setCourses(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  // FUNCION DE ELIMINAR CURSO
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este curso?")) return;
    try {
      await axios.delete(`/courses/${id}`);
      toast.success("Curso eliminado");
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      toast.error("No se pudo eliminar el curso");
    }
  };

  // FUNCION PARA ENVIAR INVITACIÓN
  const handleSendInvite = async (e) => {
    e.preventDefault();
    if(!inviteEmail) return;
    
    setSendingInvite(true);
    try {
      await axios.post("/auth/invite", { email: inviteEmail });
      toast.success(`Invitación enviada a ${inviteEmail}`);
      setShowInviteModal(false);
      setInviteEmail("");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar invitación");
    } finally {
      setSendingInvite(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-[#905361]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 relative min-h-screen">
      
      {/* HEADER: Título y Acciones */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-6">
        <div>
            <h1 className="text-3xl font-bold text-[#1B3854]">Panel de Control</h1>
            <p className="text-gray-500 mt-1">Gestiona tu academia y comunidad desde aquí.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Botón Usuarios */}
          <Link 
            to="/admin/users" 
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm"
          >
            <Users size={18} />
            <span className="hidden sm:inline">Usuarios</span>
          </Link>

          {/* Botón Invitar */}
          <button 
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm"
          >
            <Mail size={18} />
            <span className="hidden sm:inline">Invitar</span>
          </button>

          {/* Botón Crear Curso (Destacado) */}
          <Link 
            to="/admin/create-course" 
            className="flex items-center gap-2 px-6 py-2.5 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Crear Curso
          </Link>
        </div>
      </div>

      {/* SECCIÓN: Cursos */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#1B3854] mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-[#905361] rounded-full"></span>
            Cursos Activos
        </h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="mx-auto w-16 h-16 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mb-4">
                <Plus size={32} />
            </div>
            <p className="text-gray-500 text-lg">No tienes cursos creados aún.</p>
            <Link to="/admin/create-course" className="text-[#905361] font-bold hover:underline mt-2 inline-block">
                ¡Crea el primero ahora!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group h-full">
                
                {/* Imagen con Overlay al Hover */}
                <div className="relative h-48 overflow-hidden">
                    <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>

                <div className="p-6 flex flex-col grow">
                  <h3 className="font-bold text-xl text-[#1B3854] mb-2 line-clamp-1">{course.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6 grow">{course.description}</p>
                  
                  <div className="flex gap-3 pt-4 border-t border-gray-50 mt-auto">
                    {/* Botón Gestionar */}
                    <Link 
                        to={`/admin/course/${course._id}`} 
                        className="flex-1 flex items-center justify-center gap-2 bg-[#1B3854] text-white py-2.5 rounded-lg hover:bg-[#2a4d6e] transition font-medium text-sm"
                    >
                        <Settings size={16} />
                        Gestionar
                    </Link>
                    
                    {/* Botón Eliminar (Icono) */}
                    <button 
                        onClick={() => handleDelete(course._id)} 
                        className="w-10 flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition border border-red-100"
                        title="Eliminar curso"
                    >
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE INVITACIÓN */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#1B3854]/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
            <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition"
            >
                <X size={20} />
            </button>

            <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#1B3854]">Invitar Alumna</h3>
                <p className="text-gray-500 text-sm mt-1">Envía un acceso directo por correo.</p>
            </div>

            <form onSubmit={handleSendInvite}>
              <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                        type="email" 
                        required
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] focus:border-transparent outline-none transition"
                        placeholder="ejemplo@correo.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                  </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={sendingInvite}
                  className="flex-1 py-3 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold shadow-md disabled:opacity-70 transition flex justify-center items-center gap-2"
                >
                  {sendingInvite ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Enviar <span className="text-lg">➔</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminDashboard;