import { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import {
    Archive, Search, ChevronDown, ExternalLink, FolderOpen, X,
    FileText, FileSpreadsheet, Presentation, Image as ImageIcon,
    Music, Video, FileArchive, Link as LinkIcon, PlayCircle
} from "lucide-react";

// Cada tipo de recurso tiene su icono y color propios: en un listado largo
// el color es lo que permite encontrar "el PDF" de un vistazo.
const TIPOS = {
    pdf:   { label: "PDF",           icon: FileText,        color: "text-red-600",     bg: "bg-red-50" },
    doc:   { label: "Documento",     icon: FileText,        color: "text-blue-600",    bg: "bg-blue-50" },
    sheet: { label: "Hoja de cálculo", icon: FileSpreadsheet, color: "text-green-600", bg: "bg-green-50" },
    slide: { label: "Presentación",  icon: Presentation,    color: "text-orange-600",  bg: "bg-orange-50" },
    image: { label: "Imagen",        icon: ImageIcon,       color: "text-purple-600",  bg: "bg-purple-50" },
    audio: { label: "Audio",         icon: Music,           color: "text-pink-600",    bg: "bg-pink-50" },
    video: { label: "Video",         icon: Video,           color: "text-indigo-600",  bg: "bg-indigo-50" },
    zip:   { label: "Comprimido",    icon: FileArchive,     color: "text-amber-600",   bg: "bg-amber-50" },
    link:  { label: "Enlace",        icon: LinkIcon,        color: "text-gray-600",    bg: "bg-gray-100" }
};

const tipoDe = (t) => TIPOS[t] || TIPOS.link;

// Quita acentos y baja a minúsculas para que "guia" encuentre "Guía".
// ̀-ͯ = marcas diacríticas que NFD separa de la letra base.
const normalizar = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function ContentVault() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [cursoFiltro, setCursoFiltro] = useState("todos");
    const [tipoFiltro, setTipoFiltro] = useState("todos");
    const [cerrados, setCerrados] = useState(() => new Set());

    useEffect(() => {
        const cargar = async () => {
            try {
                const res = await axios.get("/courses/vault");
                setData(res.data);
            } catch (err) {
                console.error("Error al cargar el baúl", err);
                setError("No pudimos cargar tu baúl de contenido. Intenta de nuevo en un momento.");
            } finally {
                setLoading(false);
            }
        };
        cargar();
    }, []);

    const toggleModulo = (id) => {
        setCerrados(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };

    // Filtrado en cascada: curso → tipo → texto. Se descartan los módulos y
    // cursos que quedan vacíos para no dejar cabeceras huérfanas.
    const cursosFiltrados = useMemo(() => {
        if (!data?.courses) return [];
        const q = normalizar(busqueda.trim());

        return data.courses
            .filter(c => cursoFiltro === "todos" || c._id === cursoFiltro)
            .map(curso => {
                const modules = curso.modules
                    .map(mod => {
                        const resources = mod.resources.filter(r => {
                            if (tipoFiltro !== "todos" && r.type !== tipoFiltro) return false;
                            if (!q) return true;
                            return (
                                normalizar(r.label).includes(q) ||
                                normalizar(r.lessonTitle).includes(q) ||
                                normalizar(mod.title).includes(q) ||
                                normalizar(curso.title).includes(q)
                            );
                        });
                        return { ...mod, resources, resourceCount: resources.length };
                    })
                    .filter(m => m.resourceCount > 0);

                return {
                    ...curso,
                    modules,
                    resourceCount: modules.reduce((n, m) => n + m.resourceCount, 0)
                };
            })
            .filter(c => c.resourceCount > 0);
    }, [data, busqueda, cursoFiltro, tipoFiltro]);

    const totalVisible = cursosFiltrados.reduce((n, c) => n + c.resourceCount, 0);
    const hayFiltros = busqueda.trim() || cursoFiltro !== "todos" || tipoFiltro !== "todos";

    const limpiarFiltros = () => {
        setBusqueda("");
        setCursoFiltro("todos");
        setTipoFiltro("todos");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-[#905361]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-current"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">

            {/* HEADER */}
            <div className="mb-8 border-b border-gray-100 pb-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-[#1B3854] mb-2 flex items-center gap-3">
                            <span className="bg-[#FDE5E5] text-[#905361] p-2.5 rounded-2xl">
                                <Archive size={30} />
                            </span>
                            Baúl de Contenido
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Todo el material de tus cursos reunido en un solo lugar.
                        </p>
                    </div>

                    {data?.totalResources > 0 && (
                        <div className="flex gap-3">
                            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center min-w-[92px]">
                                <p className="text-2xl font-bold text-[#905361]">{data.totalResources}</p>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Recursos</p>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center min-w-[92px]">
                                <p className="text-2xl font-bold text-[#1B3854]">{data.totalCourses}</p>
                                <p className="text-[11px] text-gray-500 uppercase tracking-wide">Cursos</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 mb-6">
                    {error}
                </div>
            )}

            {/* FILTROS */}
            {data?.totalResources > 0 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar un documento, clase o módulo…"
                            className="w-full pl-10 pr-9 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/20 focus:border-[#905361] transition-all"
                        />
                        {busqueda && (
                            <button
                                type="button"
                                onClick={() => setBusqueda("")}
                                aria-label="Limpiar búsqueda"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <select
                        value={cursoFiltro}
                        onChange={(e) => setCursoFiltro(e.target.value)}
                        aria-label="Filtrar por curso"
                        className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#905361]/20 focus:border-[#905361] lg:w-56"
                    >
                        <option value="todos">Todos los cursos</option>
                        {data.courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>

                    <select
                        value={tipoFiltro}
                        onChange={(e) => setTipoFiltro(e.target.value)}
                        aria-label="Filtrar por tipo de archivo"
                        className="py-2.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#905361]/20 focus:border-[#905361] lg:w-48"
                    >
                        <option value="todos">Todos los tipos</option>
                        {(data.types || []).map(t => (
                            <option key={t} value={t}>{tipoDe(t).label}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* CONTENIDO */}
            {!data?.totalResources ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                    <div className="w-20 h-20 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mb-6">
                        <Archive size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#1B3854] mb-2">Tu baúl está vacío por ahora</h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Aquí aparecerán automáticamente todos los documentos, plantillas y
                        materiales que se vayan sumando a tus clases.
                    </p>
                </div>
            ) : cursosFiltrados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <Search size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-[#1B3854] mb-2">Sin resultados</h2>
                    <p className="text-gray-500 mb-5">No encontramos material que coincida con tu búsqueda.</p>
                    <button
                        type="button"
                        onClick={limpiarFiltros}
                        className="px-5 py-2.5 bg-[#905361] text-white rounded-xl hover:bg-[#7a4552] transition-colors font-medium"
                    >
                        Limpiar filtros
                    </button>
                </div>
            ) : (
                <>
                    {hayFiltros && (
                        <p className="text-sm text-gray-500 mb-5">
                            Mostrando <span className="font-bold text-[#905361]">{totalVisible}</span>{" "}
                            {totalVisible === 1 ? "recurso" : "recursos"}
                            <button
                                type="button"
                                onClick={limpiarFiltros}
                                className="ml-3 text-[#905361] underline underline-offset-2 hover:no-underline"
                            >
                                limpiar filtros
                            </button>
                        </p>
                    )}

                    <div className="space-y-8">
                        {cursosFiltrados.map(curso => (
                            <section key={curso._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                                {/* Cabecera del curso */}
                                <header className="flex items-center gap-4 p-5 bg-[#F7F2EF] border-b border-[#FDE5E5]">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white flex-shrink-0 border border-gray-100">
                                        {curso.thumbnail ? (
                                            <img
                                                src={curso.thumbnail}
                                                alt=""
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[#905361]">
                                                <FolderOpen size={24} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-xl font-bold text-[#1B3854] truncate">{curso.title}</h2>
                                        <p className="text-sm text-gray-500">
                                            {curso.resourceCount} {curso.resourceCount === 1 ? "recurso" : "recursos"} ·{" "}
                                            {curso.modules.length} {curso.modules.length === 1 ? "módulo" : "módulos"}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/course/${curso._id}`}
                                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#905361] bg-white px-4 py-2 rounded-xl border border-[#FDE5E5] hover:bg-[#905361] hover:text-white transition-colors flex-shrink-0"
                                    >
                                        <PlayCircle size={16} /> Ir al curso
                                    </Link>
                                </header>

                                {/* Módulos */}
                                <div className="divide-y divide-gray-100">
                                    {curso.modules.map(mod => {
                                        // Con filtros activos se abre todo: si no, el resultado
                                        // buscado podría quedar escondido en un módulo cerrado.
                                        const abierto = hayFiltros || !cerrados.has(mod._id);

                                        return (
                                            <div key={mod._id}>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleModulo(mod._id)}
                                                    aria-expanded={abierto}
                                                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                                                >
                                                    <ChevronDown
                                                        size={18}
                                                        className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${abierto ? "" : "-rotate-90"}`}
                                                    />
                                                    <h3 className="font-bold text-[#1B3854] flex-1 min-w-0 truncate">
                                                        {mod.title}
                                                    </h3>
                                                    <span className="text-xs font-medium text-[#905361] bg-[#FDE5E5] px-2.5 py-1 rounded-full flex-shrink-0">
                                                        {mod.resourceCount}
                                                    </span>
                                                </button>

                                                {abierto && (
                                                    <ul className="px-5 pb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                        {mod.resources.map(res => {
                                                            const t = tipoDe(res.type);
                                                            const Icono = t.icon;
                                                            return (
                                                                <li key={`${res.lessonId}-${res._id}`}>
                                                                    <a
                                                                        href={res.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="h-full flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 hover:border-[#905361]/40 hover:shadow-md transition-all group"
                                                                    >
                                                                        <div className={`${t.bg} ${t.color} p-2.5 rounded-xl flex-shrink-0`}>
                                                                            <Icono size={20} />
                                                                        </div>

                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-bold text-sm text-gray-800 group-hover:text-[#905361] transition-colors break-words">
                                                                                {res.label}
                                                                            </p>
                                                                            {res.lessonTitle && (
                                                                                <p className="text-xs text-gray-400 mt-1 truncate">
                                                                                    {res.lessonTitle}
                                                                                </p>
                                                                            )}
                                                                            <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-medium uppercase tracking-wide ${t.color}`}>
                                                                                {t.label} <ExternalLink size={9} />
                                                                            </span>
                                                                        </div>
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default ContentVault;
