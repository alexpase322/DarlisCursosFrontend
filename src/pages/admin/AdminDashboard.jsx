import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
// Importamos los iconos de Lucide
import { Users, Mail, Plus, Trash2, Settings, X, Sparkles, ClipboardList, DollarSign, RefreshCw, CreditCard, TrendingUp, BarChart3 } from "lucide-react";
import PushNotificationsButton from "../../components/PushNotificationsButton";

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para el Modal de Invitación
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  // Sincronización de pagos de Stripe
  const [syncing, setSyncing] = useState(false);

  const handleSyncStripe = async () => {
    if (syncing) return;
    if (!window.confirm("Esto consultará Stripe e importará los pagos y trials de los usuarios registrados. ¿Continuar?")) return;
    setSyncing(true);
    const tId = toast.loading("Sincronizando con Stripe...");
    try {
      const res = await axios.post("/admin/stripe/sync-payments", {});
      const c = res.data?.counters || {};
      toast.success(
        `Sync OK · nuevos: ${c.inserted ?? 0} · trials: ${c.trialsRecorded ?? 0} · existentes: ${c.alreadyExisted ?? 0}`,
        { id: tId, duration: 6000 }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al sincronizar Stripe", { id: tId });
    } finally {
      setSyncing(false);
    }
  };

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
    // RESPONSIVE: p-4 en móvil, p-6 en escritorio
    <div className="max-w-7xl mx-auto p-4 md:p-6 relative min-h-screen">
      
      {/* HEADER: Título y Acciones */}
      {/* RESPONSIVE: Flex columna en móvil, fila en escritorio. Alineación start en móvil, center en escritorio */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Panel de Control</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Gestiona tu academia y comunidad desde aquí.</p>
        </div>
        
        {/* RESPONSIVE: Botones con ancho flexible si es necesario */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Botón Usuarios */}
          <Link 
            to="/admin/users" 
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm whitespace-nowrap"
          >
            <Users size={18} />
            <span className="inline">Usuarios</span>
          </Link>

          {/* Botón Invitar */}
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm whitespace-nowrap"
          >
            <Mail size={18} />
            <span className="inline">Invitar</span>
          </button>

          {/* Botón Sincronizar Stripe */}
          <button
            onClick={handleSyncStripe}
            disabled={syncing}
            title="Importa pagos y trials de Stripe para los usuarios ya registrados"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
            <span className="inline">{syncing ? "Sincronizando..." : "Actualizar suscripciones"}</span>
          </button>

          {/* Push notifications */}
          <PushNotificationsButton className="flex-1 md:flex-none whitespace-nowrap" />

          {/* Recalcular logros */}
          <button
            onClick={async () => {
              if (!window.confirm("Recalcular logros para todas las alumnas? (idempotente)")) return;
              const tId = toast.loading("Recalculando logros...");
              try {
                const { data } = await axios.post("/admin/achievements/recalculate-all", {});
                toast.success(`Listo · ${data.totalUnlocked} logros nuevos en ${data.processed} alumnas`, { id: tId });
              } catch (e) {
                toast.error("Error al recalcular", { id: tId });
              }
            }}
            title="Escanea todas las alumnas y desbloquea logros que les correspondan según su data actual"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition-all font-medium shadow-sm whitespace-nowrap"
          >
            🏆 <span className="inline">Logros</span>
          </button>

          {/* Botón Crear Curso (Destacado) */}
          <Link
            to="/admin/create-course"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] transition-all font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Crear Curso
          </Link>
        </div>
      </div>

      {/* KPIs destacado */}
      <Link
        to="/admin/kpis"
        className="block mb-6 bg-gradient-to-r from-[#1B3854] to-[#0d1f30] text-white rounded-2xl p-5 hover:shadow-xl transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl"><BarChart3 size={28} /></div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider font-bold">Vista ejecutiva</p>
              <p className="font-bold text-lg">Dashboard de KPIs</p>
              <p className="text-sm text-white/70">MRR, churn, ARPU, gráfica de pagos diarios y mucho más</p>
            </div>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition">→</span>
        </div>
      </Link>

      {/* CRM Afiliadas — accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Link to="/admin/afiliadas" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#905361]/10 text-[#905361]"><Sparkles size={22} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Afiliadas</p>
            <p className="text-xs text-gray-500">Ver listado y detalle</p>
          </div>
        </Link>
        <Link to="/admin/solicitudes-partner" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-600"><ClipboardList size={22} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Solicitudes Partner</p>
            <p className="text-xs text-gray-500">Aprobar / rechazar N1→N2</p>
          </div>
        </Link>
        <Link to="/admin/comisiones" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-100 text-green-600"><DollarSign size={22} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Comisiones</p>
            <p className="text-xs text-gray-500">Marcar pagadas (single / lote)</p>
          </div>
        </Link>
        <Link to="/admin/suscripciones" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><CreditCard size={22} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Suscripciones</p>
            <p className="text-xs text-gray-500">Estado de cada alumna</p>
          </div>
        </Link>
        <Link to="/admin/ingresos" className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600"><TrendingUp size={22} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Ingresos</p>
            <p className="text-xs text-gray-500">Bruto / neto por mes</p>
          </div>
        </Link>
      </div>

      {/* SECCIÓN: Cursos */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#1B3854] mb-4 md:mb-6 flex items-center gap-2">
            <span className="w-2 h-6 md:h-8 bg-[#905361] rounded-full"></span>
            Cursos Activos
        </h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-white rounded-3xl border border-dashed border-gray-300 px-4">
            <div className="mx-auto w-16 h-16 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mb-4">
                <Plus size={32} />
            </div>
            <p className="text-gray-500 text-lg">No tienes cursos creados aún.</p>
            <Link to="/admin/create-course" className="text-[#905361] font-bold hover:underline mt-2 inline-block">
                ¡Crea el primero ahora!
            </Link>
          </div>
        ) : (
          // RESPONSIVE GRID: 1 col móvil, 2 col tablet, 3 col desktop
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group h-full">
                
                {/* Imagen con Overlay al Hover */}
                <div className="relative h-40 md:h-48 overflow-hidden">
                    <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                </div>

                <div className="p-4 md:p-6 flex flex-col grow">
                  <h3 className="font-bold text-lg md:text-xl text-[#1B3854] mb-2 line-clamp-1">{course.title}</h3>
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
          {/* RESPONSIVE: Padding interno ajustado (p-6 en móvil, p-8 en md) */}
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            
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
                <h3 className="text-xl md:text-2xl font-bold text-[#1B3854]">Invitar Alumna</h3>
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
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] focus:border-transparent outline-none transition text-sm md:text-base"
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
                  className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition text-sm md:text-base"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={sendingInvite}
                  className="flex-1 py-3 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold shadow-md disabled:opacity-70 transition flex justify-center items-center gap-2 text-sm md:text-base"
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