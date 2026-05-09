import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
    PlayCircle,
    ArrowLeft,
    BookOpen,
    Menu,
    MonitorPlay,
    Download,
    FileText,
    ExternalLink,
    CheckCircle2,
    Circle,
    Award,
    Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

function CourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState({ percent: 0, lessonsTotal: 0, lessonsCompleted: 0, hasQuiz: false, completed: false, quizPassed: false });
  const [completedIds, setCompletedIds] = useState(new Set());
  const [marking, setMarking] = useState(false);
  const { user } = useAuth();

  // --- CORRECCIÓN CRÍTICA DE YOUTUBE ---
  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("embed")) return url;

    let videoId = "";
    if (url.includes("youtu.be")) {
        const parts = url.split("/");
        videoId = parts[parts.length - 1].split("?")[0]; 
    } 
    else if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0].split("?")[0];
    }

    if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`;
    }
    return url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`/courses/${id}`);
        setCourse(res.data);
        if (res.data.modules?.[0]?.lessons?.[0]) {
            setCurrentLesson(res.data.modules[0].lessons[0]);
        }
        // Set de lecciones completadas por el usuario actual
        const myId = String(user?._id || '');
        const done = new Set();
        for (const m of res.data.modules || []) {
            for (const l of m.lessons || []) {
                if ((l.completedBy || []).some(uid => String(uid) === myId)) done.add(l._id);
            }
        }
        setCompletedIds(done);
      } catch (error) {
        console.error("Error al cargar curso");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    fetchProgress();
  }, [id]);

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`/courses/${id}/progress`);
      setProgress(data);
    } catch (e) { /* noop */ }
  };

  const toggleLessonComplete = async (lesson) => {
    if (marking) return;
    setMarking(true);
    const isDone = completedIds.has(lesson._id);
    try {
      if (isDone) {
        await axios.delete(`/courses/${id}/lessons/${lesson._id}/complete`);
        const next = new Set(completedIds); next.delete(lesson._id);
        setCompletedIds(next);
      } else {
        await axios.post(`/courses/${id}/lessons/${lesson._id}/complete`);
        const next = new Set(completedIds); next.add(lesson._id);
        setCompletedIds(next);
        toast.success("Lección marcada");
      }
      fetchProgress();
    } catch (e) {
      toast.error("Error al actualizar progreso");
    } finally {
      setMarking(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)] bg-[#1B3854]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100 overflow-hidden">
      
      <div className="flex flex-1 overflow-hidden relative flex-col lg:flex-row">
        
        {/* 1. ZONA DE VIDEO (Izquierda) */}
        <div className="flex-1 flex flex-col bg-black relative overflow-y-auto">
            
            {/* Header Móvil */}
            <div className="lg:hidden bg-[#1B3854] text-white p-3 flex justify-between items-center">
                <button onClick={() => navigate("/dashboard")}><ArrowLeft size={20}/></button>
                <span className="font-bold text-sm truncate px-2">{currentLesson?.title || "Cargando..."}</span>
                <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20}/></button>
            </div>

            {currentLesson ? (
                <div className="flex flex-col min-h-full">
                    
                    {/* Reproductor (16:9) */}
                    <div className="w-full bg-black relative shadow-2xl" style={{ aspectRatio: '16/9' }}>
                        <iframe 
                            src={getEmbedUrl(currentLesson.videoUrl)} 
                            title={currentLesson.title}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Información y Recursos */}
                    <div className="flex-1 bg-white p-6 lg:p-10 overflow-y-auto">
                        <div className="max-w-5xl mx-auto">
                            
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 mb-4 text-sm">
                                <Link to="/dashboard" className="text-gray-400 hover:text-[#905361] transition flex items-center gap-1">
                                    <ArrowLeft size={14} /> Mis Cursos
                                </Link>
                                <span className="text-gray-300">/</span>
                                <span className="text-[#905361] font-bold bg-[#FDE5E5] px-2 py-0.5 rounded text-xs">Reproduciendo</span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854] mb-3">{currentLesson.title}</h1>

                            {/* Barra de progreso del curso */}
                            <div className="mb-6 bg-white border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tu progreso</span>
                                  <span className="text-sm font-bold text-[#1B3854]">{progress.lessonsCompleted}/{progress.lessonsTotal} · {progress.percent}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-[#905361] to-[#5E2B35] transition-all" style={{ width: `${progress.percent}%` }} />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => toggleLessonComplete(currentLesson)}
                                  disabled={marking}
                                  className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-60 ${
                                    completedIds.has(currentLesson._id)
                                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                                      : "bg-white border border-[#905361]/30 text-[#905361] hover:bg-[#FDE5E5]"
                                  }`}
                                >
                                  {marking ? <Loader2 size={14} className="animate-spin" /> :
                                    completedIds.has(currentLesson._id) ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                  {completedIds.has(currentLesson._id) ? "Completada" : "Marcar como vista"}
                                </button>
                                {progress.hasQuiz && (
                                  <Link
                                    to={`/course/${id}/quiz`}
                                    className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 transition ${
                                      progress.quizPassed
                                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                        : "bg-[#905361] text-white hover:bg-[#5E2B35]"
                                    }`}
                                  >
                                    <Award size={14} /> {progress.quizPassed ? "Repetir examen" : "Hacer examen"}
                                  </Link>
                                )}
                              </div>
                            </div>
                            
                            {/* --- GRID: DESCRIPCIÓN Y RECURSOS --- */}
                            <div className="grid md:grid-cols-3 gap-8">
                                
                                {/* Columna Descripción */}
                                <div className="md:col-span-2 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Sobre esta clase</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {currentLesson.description || "Sin descripción disponible."}
                                    </p>
                                </div>

                                {/* Columna Recursos Descargables */}
                                <div className="md:col-span-1">
                                    <div className="bg-[#F7F2EF] p-5 rounded-2xl border border-[#FDE5E5]">
                                        <h3 className="text-[#905361] font-bold text-sm mb-4 flex items-center gap-2">
                                            <Download size={16} /> Recursos de Clase
                                        </h3>
                                        
                                        {currentLesson.resources && currentLesson.resources.length > 0 ? (
                                            <ul className="space-y-3">
                                                {currentLesson.resources.map((res, idx) => (
                                                    <li key={idx}>
                                                        <a 
                                                            href={res.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition group border border-gray-100"
                                                        >
                                                            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                <FileText size={18} />
                                                            </div>
                                                            <div className="flex-1 overflow-hidden">
                                                                <p className="text-sm font-bold text-gray-700 truncate group-hover:text-blue-700 transition-colors">{res.label}</p>
                                                                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                                                    Clic para abrir <ExternalLink size={8}/>
                                                                </p>
                                                            </div>
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No hay material adjunto.</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-white/50 p-10">
                    <MonitorPlay size={64} className="mb-4 opacity-50" />
                    <p className="text-xl">Selecciona una clase del menú</p>
                </div>
            )}
        </div>

        {/* 2. SIDEBAR DE TEMARIO (Derecha) */}
        <div className={`absolute lg:relative z-20 top-0 right-0 h-full w-80 bg-white border-l border-gray-200 shadow-2xl lg:shadow-none transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}`}>
            {/* Header Sidebar */}
            <div className="h-14 bg-[#1B3854] text-white flex items-center justify-between px-4 shadow-md z-20 relative">
                <div className="flex items-center gap-2 overflow-hidden">
                    <BookOpen size={18} className="text-[#905361]" />
                    <div>
                        <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">Contenido</p>
                        <h3 className="font-bold text-xs truncate w-48">{course?.title}</h3>
                    </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300"><ArrowLeft size={18}/></button>
            </div>

            {/* Lista Módulos */}
            <div className="overflow-y-auto h-[calc(100%-56px)] bg-[#F7F2EF] custom-scrollbar">
                {course?.modules.map((module, modIndex) => (
                    <div key={module._id}>
                        <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
                            <h4 className="font-bold text-[#1B3854] text-xs uppercase tracking-wide flex items-center gap-2">
                                <span className="bg-[#1B3854] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">{modIndex + 1}</span>
                                {module.title}
                            </h4>
                        </div>
                        <ul className="bg-[#F7F2EF] pb-2">
                            {module.lessons.map((lesson) => {
                                const isActive = currentLesson?._id === lesson._id;
                                return (
                                    <li key={lesson._id}>
                                        <button
                                            onClick={() => { setCurrentLesson(lesson); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                                            className={`w-full text-left px-4 py-3.5 text-sm flex items-start gap-3 transition-all border-l-4 ${isActive ? "bg-[#FDE5E5] border-[#905361]" : "border-transparent hover:bg-white text-gray-500"}`}
                                        >
                                            <div className="mt-0.5 flex-shrink-0">
                                                {completedIds.has(lesson._id)
                                                  ? <CheckCircle2 size={16} className="text-emerald-600" />
                                                  : isActive
                                                    ? <PlayCircle size={16} className="text-[#905361] fill-[#905361]/20" />
                                                    : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                                            </div>
                                            <div className="flex-1">
                                                <span className={`block font-medium text-sm leading-snug ${isActive ? "text-[#905361]" : "text-gray-600"}`}>{lesson.title}</span>
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                            {module.lessons.length === 0 && <li className="px-8 py-3 text-xs text-gray-400 italic">Próximamente...</li>}
                        </ul>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}

export default CourseViewer;