import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
// Importamos iconos modernos
import { 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Folder, 
    Video, 
    PlayCircle, 
    Save, 
    X,
    Layout,
    Paperclip,      // <--- NUEVO
    Link as LinkIcon // <--- NUEVO
} from "lucide-react";

function CourseManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Estados para formularios de Módulos/Lecciones
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [showLessonForm, setShowLessonForm] = useState(null); 
  const [lessonData, setLessonData] = useState({ title: "", videoUrl: "", description: "" });

  // --- NUEVO: Estado para Recursos ---
  const [showResourceForm, setShowResourceForm] = useState(null); // ID de la lección activa para recursos
  const [resourceData, setResourceData] = useState({ label: "", url: "" });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      toast.error("Error al cargar");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS MÓDULOS Y LECCIONES (Intactos) ---
  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;
    try {
        const res = await axios.post(`/courses/${id}/modules`, { title: newModuleTitle });
        setCourse(res.data);
        setNewModuleTitle("");
        toast.success("Módulo agregado");
    } catch (error) {
        toast.error("Error al agregar módulo");
    }
  };

  const handleAddLesson = async (e, moduleId) => {
    e.preventDefault();
    try {
        const res = await axios.post(`/courses/${id}/modules/${moduleId}/lessons`, lessonData);
        setCourse(res.data);
        setShowLessonForm(null);
        setLessonData({ title: "", videoUrl: "", description: "" });
        toast.success("Clase agregada");
    } catch (error) {
        toast.error("Error al agregar clase");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("¿Estás seguro de eliminar este módulo y todas sus clases?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}`);
        setCourse(res.data); 
        toast.success("Módulo eliminado");
    } catch (error) {
        toast.error("Error al eliminar módulo");
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}`);
        setCourse(res.data);
        toast.success("Clase eliminada");
    } catch (error) {
        toast.error("Error al eliminar clase");
    }
  };

  // --- NUEVOS HANDLERS RECURSOS ---
  const handleAddResource = async (e, moduleId, lessonId) => {
    e.preventDefault();
    if(!resourceData.label || !resourceData.url) return toast.error("Completa nombre y URL");

    try {
        const res = await axios.post(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}/resources`, resourceData);
        setCourse(res.data);
        setResourceData({ label: "", url: "" }); // Limpiar inputs
        toast.success("Recurso agregado");
    } catch (error) {
        toast.error("Error al agregar recurso");
    }
  };

  const handleDeleteResource = async (moduleId, lessonId, resourceId) => {
    if(!window.confirm("¿Quitar recurso?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}/resources/${resourceId}`);
        setCourse(res.data);
        toast.success("Recurso eliminado");
    } catch (error) {
        toast.error("Error al eliminar recurso");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-[#905361]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
    </div>
  );
  
  if (!course) return <div className="p-6 text-center text-gray-500">No se encontró el curso</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen">
        
        {/* HEADER */}
        <div className="mb-8">
            <Link to="/admin" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#1B3854] transition mb-6 font-medium text-sm">
                <ArrowLeft size={16} /> Volver al Panel
            </Link>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-start gap-6">
                <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-gray-100">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-[#FDE5E5] text-[#905361] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Curso</span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Layout size={14} /> {course.modules.length} Módulos
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-[#1B3854] mb-2">{course.title}</h1>
                    <p className="text-gray-500 leading-relaxed max-w-2xl">{course.description}</p>
                </div>
            </div>
        </div>

        {/* AGREGAR MÓDULO */}
        <div className="mb-10">
            <form onSubmit={handleAddModule} className="flex gap-3 items-center bg-white p-2 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="pl-4 text-gray-400"><Folder size={20} /></div>
                <input 
                    type="text" placeholder="Escribe el nombre del nuevo módulo..."
                    className="flex-1 p-3 outline-none text-gray-700 bg-transparent"
                    value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)}
                />
                <button type="submit" disabled={!newModuleTitle.trim()} className="bg-[#1B3854] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2a4d6e] transition disabled:opacity-50 flex items-center gap-2">
                    <Plus size={18} /> <span className="hidden sm:inline">Agregar Módulo</span>
                </button>
            </form>
        </div>

        {/* LISTA DE MÓDULOS */}
        <div className="space-y-6">
            {course.modules.map((module, index) => (
                <div key={module._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    
                    {/* Header Módulo */}
                    <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-400 text-sm font-bold shadow-sm border border-gray-100">{index + 1}</span>
                            <h3 className="text-lg font-bold text-[#1B3854]">{module.title}</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">{module.lessons.length} clases</span>
                            <button onClick={() => handleDeleteModule(module._id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Lista de Clases */}
                    <div className="p-2 sm:p-5">
                        {module.lessons.length > 0 ? (
                            <ul className="space-y-3 mb-4">
                                {module.lessons.map((lesson) => (
                                    <li key={lesson._id} className="bg-white border border-gray-100 rounded-xl p-4 group/lesson hover:shadow-sm transition-all">
                                        
                                        {/* Fila Principal de la Lección */}
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center overflow-hidden gap-3">
                                                <div className="text-[#905361] bg-[#FDE5E5] p-2 rounded-full"><PlayCircle size={18} /></div>
                                                <div>
                                                    <p className="font-semibold text-gray-700 text-sm">{lesson.title}</p>
                                                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-[#1B3854] flex items-center gap-1 mt-0.5 transition-colors">
                                                        <Video size={10} /> Ver video original
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex gap-2">
                                                {/* BOTÓN TOGGLE RECURSOS */}
                                                <button 
                                                    onClick={() => setShowResourceForm(showResourceForm === lesson._id ? null : lesson._id)}
                                                    className={`p-2 rounded-lg transition ${showResourceForm === lesson._id ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50 hover:text-[#1B3854]'}`}
                                                    title="Gestionar Recursos"
                                                >
                                                    <Paperclip size={16} />
                                                </button>

                                                {/* BOTÓN ELIMINAR CLASE */}
                                                <button onClick={() => handleDeleteLesson(module._id, lesson._id)} className="text-gray-300 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition" title="Eliminar Clase">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* --- ZONA DE RECURSOS (DESPLEGABLE) --- */}
                                        {showResourceForm === lesson._id && (
                                            <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-blue-100 animate-in fade-in zoom-in duration-200">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                                    <Paperclip size={12}/> Recursos Adjuntos
                                                </h4>
                                                
                                                {/* Lista existente */}
                                                <div className="space-y-2 mb-4">
                                                    {lesson.resources.map(res => (
                                                        <div key={res._id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                                                            <a href={res.url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-2 truncate">
                                                                <LinkIcon size={12}/> {res.label}
                                                            </a>
                                                            <button onClick={() => handleDeleteResource(module._id, lesson._id, res._id)} className="text-red-400 hover:bg-red-50 p-1 rounded">
                                                                <X size={14}/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {lesson.resources.length === 0 && <p className="text-xs text-gray-400 italic">No hay recursos aún.</p>}
                                                </div>

                                                {/* Formulario Agregar Recurso */}
                                                <div className="flex gap-2">
                                                    <input type="text" placeholder="Nombre (Ej: PDF Guía)" className="flex-1 p-2 border rounded text-sm outline-none focus:border-blue-400"
                                                        value={resourceData.label} onChange={e => setResourceData({...resourceData, label: e.target.value})}
                                                    />
                                                    <input type="text" placeholder="URL (Drive, Dropbox...)" className="flex-1 p-2 border rounded text-sm outline-none focus:border-blue-400"
                                                        value={resourceData.url} onChange={e => setResourceData({...resourceData, url: e.target.value})}
                                                    />
                                                    <button onClick={(e) => handleAddResource(e, module._id, lesson._id)} className="bg-blue-600 text-white px-3 py-2 rounded text-sm font-bold hover:bg-blue-700">
                                                        <Plus size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-6 text-sm text-gray-400 italic">No hay clases en este módulo aún.</div>
                        )}

                        {/* Botón / Formulario Agregar Clase */}
                        <div className="mt-2 px-3 pb-2">
                            {showLessonForm === module._id ? (
                                <form onSubmit={(e) => handleAddLesson(e, module._id)} className="bg-[#F7F2EF] p-5 rounded-2xl border border-[#FDE5E5] animate-in fade-in zoom-in duration-200">
                                    {/* ... Formulario igual que antes ... */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between"><h4 className="font-bold text-[#1B3854] text-sm">Nueva Clase</h4><button type="button" onClick={() => setShowLessonForm(null)}><X size={16}/></button></div>
                                        <input type="text" placeholder="Título" className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]" value={lessonData.title} onChange={e => setLessonData({...lessonData, title: e.target.value})} />
                                        <input type="text" placeholder="Video URL" className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]" value={lessonData.videoUrl} onChange={e => setLessonData({...lessonData, videoUrl: e.target.value})} />
                                        <textarea placeholder="Descripción" className="w-full p-3 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]" rows="2" value={lessonData.description} onChange={e => setLessonData({...lessonData, description: e.target.value})} />
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={() => setShowLessonForm(null)} className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-200 rounded-lg">Cancelar</button>
                                            <button type="submit" className="bg-[#905361] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#5E2B35]">Guardar</button>
                                        </div>
                                    </div>
                                </form>
                            ) : (
                                <button onClick={() => setShowLessonForm(module._id)} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm font-bold hover:border-[#905361] hover:text-[#905361] hover:bg-[#FDE5E5]/20 transition flex items-center justify-center gap-2">
                                    <Plus size={16} /> Agregar Clase al Módulo
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default CourseManager;