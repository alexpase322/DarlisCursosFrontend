import { useEffect, useState, useCallback } from "react";
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
    Link as LinkIcon,
    Pencil,
    Check,
    ImagePlus,
    Loader2
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

  // --- Edición en sitio ---
  // Cada uno guarda el id de lo que se está editando (null = nada abierto),
  // así solo puede haber una cosa en edición a la vez y no se pisan los formularios.
  const [editandoCurso, setEditandoCurso] = useState(false);
  const [cursoForm, setCursoForm] = useState({ title: "", description: "" });
  const [portadaFile, setPortadaFile] = useState(null);
  const [portadaPreview, setPortadaPreview] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const [editandoModulo, setEditandoModulo] = useState(null);
  const [moduloTitle, setModuloTitle] = useState("");

  const [editandoClase, setEditandoClase] = useState(null);
  const [claseForm, setClaseForm] = useState({ title: "", videoUrl: "", description: "" });

  const [editandoRecurso, setEditandoRecurso] = useState(null);
  const [recursoForm, setRecursoForm] = useState({ label: "", url: "" });

  // La preview de la portada es un object URL: hay que liberarlo o se acumula.
  useEffect(() => {
    if (!portadaFile) { setPortadaPreview(null); return; }
    const url = URL.createObjectURL(portadaFile);
    setPortadaPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [portadaFile]);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await axios.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("fetchCourse", err);
      toast.error(err.response?.data?.message || "Error al cargar el curso");
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // --- HANDLERS DE EDICIÓN ---

  const abrirEdicionCurso = () => {
    setCursoForm({ title: course.title, description: course.description || "" });
    setPortadaFile(null);
    setEditandoCurso(true);
  };

  const cancelarEdicionCurso = () => {
    setEditandoCurso(false);
    setPortadaFile(null);
  };

  const guardarCurso = async (e) => {
    e.preventDefault();
    if (!cursoForm.title.trim()) return toast.error("El título no puede quedar vacío");
    if (!cursoForm.description.trim()) return toast.error("La descripción no puede quedar vacía");

    setGuardando(true);
    try {
      // multipart porque puede llevar la nueva portada; si no hay archivo,
      // se manda igual y el backend simplemente no toca el thumbnail.
      const data = new FormData();
      data.append("title", cursoForm.title);
      data.append("description", cursoForm.description);
      if (portadaFile) data.append("thumbnail", portadaFile);

      const res = await axios.put(`/courses/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCourse(res.data);
      setEditandoCurso(false);
      setPortadaFile(null);
      toast.success("Curso actualizado");
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo actualizar el curso");
    } finally {
      setGuardando(false);
    }
  };

  const guardarModulo = async (moduleId) => {
    if (!moduloTitle.trim()) return toast.error("El título no puede quedar vacío");
    try {
      const res = await axios.put(`/courses/${id}/modules/${moduleId}`, { title: moduloTitle });
      setCourse(res.data);
      setEditandoModulo(null);
      toast.success("Módulo actualizado");
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo actualizar el módulo");
    }
  };

  const guardarClase = async (moduleId, lessonId) => {
    if (!claseForm.title.trim()) return toast.error("El título no puede quedar vacío");
    if (!claseForm.videoUrl.trim()) return toast.error("La clase necesita una URL de video");
    try {
      const res = await axios.put(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}`, claseForm);
      setCourse(res.data);
      setEditandoClase(null);
      toast.success("Clase actualizada");
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo actualizar la clase");
    }
  };

  const guardarRecurso = async (moduleId, lessonId, resourceId) => {
    if (!recursoForm.label.trim() || !recursoForm.url.trim()) {
      return toast.error("El recurso necesita nombre y enlace");
    }
    try {
      const res = await axios.put(
        `/courses/${id}/modules/${moduleId}/lessons/${lessonId}/resources/${resourceId}`,
        recursoForm
      );
      setCourse(res.data);
      setEditandoRecurso(null);
      toast.success("Recurso actualizado");
    } catch (err) {
      toast.error(err.response?.data?.message || "No se pudo actualizar el recurso");
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
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al agregar módulo");
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
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al agregar clase");
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("¿Estás seguro de eliminar este módulo y todas sus clases?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}`);
        setCourse(res.data); 
        toast.success("Módulo eliminado");
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al eliminar módulo");
    }
  };

  const handleDeleteLesson = async (moduleId, lessonId) => {
    if (!window.confirm("¿Eliminar esta clase?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}`);
        setCourse(res.data);
        toast.success("Clase eliminada");
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al eliminar clase");
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
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al agregar recurso");
    }
  };

  const handleDeleteResource = async (moduleId, lessonId, resourceId) => {
    if(!window.confirm("¿Quitar recurso?")) return;
    try {
        const res = await axios.delete(`/courses/${id}/modules/${moduleId}/lessons/${lessonId}/resources/${resourceId}`);
        setCourse(res.data);
        toast.success("Recurso eliminado");
    } catch (err) {
        toast.error(err.response?.data?.message || "Error al eliminar recurso");
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

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              {editandoCurso ? (
                /* --- MODO EDICIÓN DEL CURSO --- */
                <form onSubmit={guardarCurso} className="flex flex-col md:flex-row items-start gap-6">
                    {/* La etiqueta envuelve el input para que toda la imagen sea
                        zona de clic, no un botón aparte debajo. */}
                    <label className="w-full md:w-32 shrink-0 cursor-pointer group/portada">
                        <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden shadow-md bg-gray-100">
                            <img
                                src={portadaPreview || course.thumbnail}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[#1B3854]/60 opacity-0 group-hover/portada:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                                <ImagePlus size={22} />
                                <span className="text-[10px] font-bold">Cambiar</span>
                            </div>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setPortadaFile(e.target.files?.[0] || null)}
                        />
                        <p className="text-[11px] text-gray-400 text-center mt-2 break-words">
                            {portadaFile ? portadaFile.name : "Clic para cambiar la portada"}
                        </p>
                    </label>

                    <div className="flex-1 w-full space-y-3">
                        <input
                            type="text"
                            value={cursoForm.title}
                            onChange={(e) => setCursoForm({ ...cursoForm, title: e.target.value })}
                            placeholder="Título del curso"
                            className="w-full text-2xl font-bold text-[#1B3854] p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#905361]/30 focus:border-[#905361]"
                        />
                        <textarea
                            value={cursoForm.description}
                            onChange={(e) => setCursoForm({ ...cursoForm, description: e.target.value })}
                            placeholder="Descripción del curso"
                            rows="3"
                            className="w-full text-gray-600 p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#905361]/30 focus:border-[#905361] resize-y"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={guardando}
                                className="flex items-center gap-2 px-5 py-2.5 bg-[#905361] text-white rounded-xl font-bold hover:bg-[#5E2B35] transition disabled:opacity-60"
                            >
                                {guardando ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={cancelarEdicionCurso}
                                disabled={guardando}
                                className="px-5 py-2.5 text-gray-500 rounded-xl font-medium hover:bg-gray-50 transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
              ) : (
                /* --- MODO LECTURA --- */
                <div className="flex flex-col md:flex-row items-start gap-6">
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
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={abrirEdicionCurso}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#1B3854] rounded-xl text-sm font-bold hover:bg-gray-50 transition"
                            >
                                <Pencil size={15} /> Editar curso
                            </button>
                            <Link
                                to={`/admin/course/${course._id}/quiz`}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#905361] text-white rounded-xl text-sm font-bold hover:bg-[#5E2B35] transition"
                            >
                                🏆 Editar examen del curso
                            </Link>
                        </div>
                    </div>
                </div>
              )}
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
                    <div className="bg-gray-50/50 p-5 border-b border-gray-100 flex justify-between items-center gap-3 group">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-400 text-sm font-bold shadow-sm border border-gray-100 shrink-0">{index + 1}</span>

                            {editandoModulo === module._id ? (
                                <form
                                    onSubmit={(e) => { e.preventDefault(); guardarModulo(module._id); }}
                                    className="flex items-center gap-2 flex-1 min-w-0"
                                >
                                    <input
                                        type="text"
                                        value={moduloTitle}
                                        onChange={(e) => setModuloTitle(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === "Escape") setEditandoModulo(null); }}
                                        autoFocus
                                        className="flex-1 min-w-0 text-lg font-bold text-[#1B3854] px-3 py-1.5 rounded-lg border border-[#905361] outline-none focus:ring-2 focus:ring-[#905361]/30"
                                    />
                                    <button type="submit" title="Guardar" className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition shrink-0">
                                        <Check size={18} />
                                    </button>
                                    <button type="button" onClick={() => setEditandoModulo(null)} title="Cancelar" className="text-gray-400 hover:bg-gray-100 p-2 rounded-lg transition shrink-0">
                                        <X size={18} />
                                    </button>
                                </form>
                            ) : (
                                <>
                                    <h3 className="text-lg font-bold text-[#1B3854] truncate">{module.title}</h3>
                                    <button
                                        onClick={() => { setEditandoModulo(module._id); setModuloTitle(module.title); }}
                                        title="Renombrar módulo"
                                        className="text-gray-300 hover:text-[#905361] hover:bg-white p-1.5 rounded-lg transition shrink-0"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                            <span className="hidden sm:inline text-xs font-medium text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">{module.lessons.length} clases</span>
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
                                        {editandoClase === lesson._id ? (
                                            <form
                                                onSubmit={(e) => { e.preventDefault(); guardarClase(module._id, lesson._id); }}
                                                className="space-y-2 mb-2"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <div className="text-[#905361] bg-[#FDE5E5] p-2 rounded-full shrink-0"><PlayCircle size={18} /></div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Editando clase</span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={claseForm.title}
                                                    onChange={(e) => setClaseForm({ ...claseForm, title: e.target.value })}
                                                    placeholder="Título de la clase"
                                                    autoFocus
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]/30 focus:border-[#905361]"
                                                />
                                                <input
                                                    type="text"
                                                    value={claseForm.videoUrl}
                                                    onChange={(e) => setClaseForm({ ...claseForm, videoUrl: e.target.value })}
                                                    placeholder="URL del video"
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]/30 focus:border-[#905361]"
                                                />
                                                <textarea
                                                    value={claseForm.description}
                                                    onChange={(e) => setClaseForm({ ...claseForm, description: e.target.value })}
                                                    placeholder="Descripción"
                                                    rows="2"
                                                    className="w-full p-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-[#905361]/30 focus:border-[#905361] resize-y"
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" className="flex items-center gap-1.5 px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold hover:bg-[#5E2B35] transition">
                                                        <Check size={15} /> Guardar
                                                    </button>
                                                    <button type="button" onClick={() => setEditandoClase(null)} className="px-4 py-2 text-gray-500 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                        <div className="flex justify-between items-start mb-2 gap-2">
                                            <div className="flex items-center overflow-hidden gap-3">
                                                <div className="text-[#905361] bg-[#FDE5E5] p-2 rounded-full shrink-0"><PlayCircle size={18} /></div>
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-gray-700 text-sm truncate">{lesson.title}</p>
                                                    <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-[#1B3854] flex items-center gap-1 mt-0.5 transition-colors">
                                                        <Video size={10} /> Ver video original
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 shrink-0">
                                                {/* BOTÓN EDITAR CLASE */}
                                                <button
                                                    onClick={() => {
                                                        setEditandoClase(lesson._id);
                                                        setClaseForm({
                                                            title: lesson.title,
                                                            videoUrl: lesson.videoUrl,
                                                            description: lesson.description || ""
                                                        });
                                                    }}
                                                    className="text-gray-400 hover:bg-gray-50 hover:text-[#905361] p-2 rounded-lg transition"
                                                    title="Editar clase"
                                                >
                                                    <Pencil size={16} />
                                                </button>

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
                                        )}

                                        {/* --- ZONA DE RECURSOS (DESPLEGABLE) --- */}
                                        {showResourceForm === lesson._id && (
                                            <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-blue-100 animate-in fade-in zoom-in duration-200">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                                                    <Paperclip size={12}/> Recursos Adjuntos
                                                </h4>
                                                
                                                {/* Lista existente */}
                                                <div className="space-y-2 mb-4">
                                                    {lesson.resources.map(res => (
                                                        editandoRecurso === res._id ? (
                                                            <form
                                                                key={res._id}
                                                                onSubmit={(e) => { e.preventDefault(); guardarRecurso(module._id, lesson._id, res._id); }}
                                                                className="bg-white p-2 rounded-lg border border-[#905361] shadow-sm flex flex-col sm:flex-row gap-2"
                                                            >
                                                                <input
                                                                    type="text"
                                                                    value={recursoForm.label}
                                                                    onChange={(e) => setRecursoForm({ ...recursoForm, label: e.target.value })}
                                                                    placeholder="Nombre"
                                                                    autoFocus
                                                                    className="flex-1 min-w-0 p-2 border border-gray-200 rounded text-sm outline-none focus:border-[#905361]"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={recursoForm.url}
                                                                    onChange={(e) => setRecursoForm({ ...recursoForm, url: e.target.value })}
                                                                    placeholder="URL"
                                                                    className="flex-1 min-w-0 p-2 border border-gray-200 rounded text-sm outline-none focus:border-[#905361]"
                                                                />
                                                                <div className="flex gap-1 shrink-0">
                                                                    <button type="submit" title="Guardar" className="text-green-600 hover:bg-green-50 p-2 rounded">
                                                                        <Check size={16} />
                                                                    </button>
                                                                    <button type="button" onClick={() => setEditandoRecurso(null)} title="Cancelar" className="text-gray-400 hover:bg-gray-100 p-2 rounded">
                                                                        <X size={16} />
                                                                    </button>
                                                                </div>
                                                            </form>
                                                        ) : (
                                                        <div key={res._id} className="flex justify-between items-center gap-2 bg-white p-2 rounded-lg border border-gray-200 text-sm shadow-sm">
                                                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-2 truncate min-w-0">
                                                                <LinkIcon size={12} className="shrink-0" /> {res.label}
                                                            </a>
                                                            <div className="flex gap-1 shrink-0">
                                                                <button
                                                                    onClick={() => { setEditandoRecurso(res._id); setRecursoForm({ label: res.label, url: res.url }); }}
                                                                    title="Editar recurso"
                                                                    className="text-gray-400 hover:text-[#905361] hover:bg-gray-50 p-1 rounded"
                                                                >
                                                                    <Pencil size={13} />
                                                                </button>
                                                                <button onClick={() => handleDeleteResource(module._id, lesson._id, res._id)} title="Eliminar recurso" className="text-red-400 hover:bg-red-50 p-1 rounded">
                                                                    <X size={14}/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        )
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