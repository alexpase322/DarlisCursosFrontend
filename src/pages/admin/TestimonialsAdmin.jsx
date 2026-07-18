import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, Star, Award, Eye, EyeOff, Trash2, Quote, Search } from "lucide-react";

const StatCard = ({ label, value, color }) => (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 inline-block px-2 py-0.5 rounded ${color}`}>{value}</p>
    </div>
);

const Stars = ({ value }) => (
    <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={12} className={n <= value ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
        ))}
    </div>
);

const TestimonialsAdmin = () => {
    const [data, setData] = useState({ items: [], summary: {}, total: 0 });
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");
    const [featured, setFeatured] = useState("");
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const limit = 30;

    useEffect(() => { fetchData(); }, [status, featured, page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit });
            if (status) params.set("status", status);
            if (featured) params.set("featured", featured);
            if (q) params.set("q", q);
            const { data } = await axios.get(`/testimonials/admin/all?${params.toString()}`);
            setData(data);
        } catch {
            toast.error("Error al cargar testimonios");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

    const toggleFeatured = async (t) => {
        try {
            await axios.patch(`/testimonials/${t._id}/feature`, { featured: !t.featured });
            setData((d) => ({ ...d, items: d.items.map((x) => x._id === t._id ? { ...x, featured: !x.featured } : x) }));
            toast.success(!t.featured ? "Destacado en la landing" : "Quitado de destacados");
        } catch {
            toast.error("Error");
        }
    };

    const toggleStatus = async (t) => {
        const next = t.status === "approved" ? "hidden" : "approved";
        try {
            await axios.patch(`/testimonials/${t._id}/status`, { status: next });
            setData((d) => ({ ...d, items: d.items.map((x) => x._id === t._id ? { ...x, status: next } : x) }));
            toast.success(next === "hidden" ? "Ocultado" : "Visible de nuevo");
        } catch {
            toast.error("Error");
        }
    };

    const remove = async (id) => {
        if (!window.confirm("¿Eliminar este testimonio permanentemente?")) return;
        try {
            await axios.delete(`/testimonials/${id}`);
            setData((d) => ({ ...d, items: d.items.filter((x) => x._id !== id) }));
            toast.success("Eliminado");
        } catch {
            toast.error("Error al eliminar");
        }
    };

    const s = data.summary || {};
    const totalPages = Math.max(1, Math.ceil(data.total / limit));

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854] flex items-center gap-2">
                        <Quote size={24} className="text-[#905361]" /> Testimonios
                    </h1>
                    <p className="text-gray-500 text-sm">Modera y destaca los testimonios de las arquitectas.</p>
                </div>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatCard label="Total" value={s.total || 0} color="bg-gray-100 text-gray-700" />
                <StatCard label="Visibles" value={s.approved || 0} color="bg-emerald-50 text-emerald-700" />
                <StatCard label="Ocultos" value={s.hidden || 0} color="bg-red-50 text-red-600" />
                <StatCard label="Destacados" value={s.featured || 0} color="bg-amber-50 text-amber-700" />
            </div>

            {/* Filtros */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3 items-end">
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en el texto..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Todos los estados</option>
                    <option value="approved">Visibles</option>
                    <option value="hidden">Ocultos</option>
                </select>
                <select value={featured} onChange={(e) => { setFeatured(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                    <option value="">Destacados y no</option>
                    <option value="true">Solo destacados</option>
                    <option value="false">No destacados</option>
                </select>
                <button type="submit" className="px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold">Buscar</button>
            </form>

            {/* Lista */}
            {loading ? (
                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
            ) : data.items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-500 text-sm">
                    Sin testimonios para estos filtros.
                </div>
            ) : (
                <div className="space-y-3">
                    {data.items.map((t) => (
                        <div key={t._id} className={`bg-white rounded-2xl border p-4 flex gap-4 ${t.status === "hidden" ? "border-red-100 opacity-70" : "border-gray-100"}`}>
                            <img src={t.author?.avatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className="font-bold text-[#1B3854] text-sm">{t.author?.username || "—"}</p>
                                    <Stars value={t.rating} />
                                    {t.featured && (
                                        <span className="text-[9px] font-bold uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                            <Award size={10} /> Destacado
                                        </span>
                                    )}
                                    {t.status === "hidden" && (
                                        <span className="text-[9px] font-bold uppercase text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full">Oculto</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{t.content}</p>
                                {t.image && <img src={t.image} alt="" className="mt-2 rounded-lg max-h-40 border border-gray-50" />}
                                <p className="text-[11px] text-gray-400 mt-1">
                                    {new Date(t.createdAt).toLocaleDateString("es-ES", { dateStyle: "medium" })}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1.5 flex-shrink-0">
                                <button
                                    onClick={() => toggleFeatured(t)}
                                    title={t.featured ? "Quitar de destacados" : "Destacar en landing"}
                                    className={`p-2 rounded-lg border transition ${t.featured ? "bg-amber-50 border-amber-200 text-amber-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    <Award size={16} />
                                </button>
                                <button
                                    onClick={() => toggleStatus(t)}
                                    title={t.status === "approved" ? "Ocultar" : "Mostrar"}
                                    className={`p-2 rounded-lg border transition ${t.status === "approved" ? "border-gray-200 text-gray-400 hover:bg-gray-50" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}
                                >
                                    {t.status === "approved" ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                                <button
                                    onClick={() => remove(t._id)}
                                    title="Eliminar"
                                    className="p-2 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 bg-white rounded-2xl border border-gray-100 px-4 py-3">
                    <p className="text-xs text-gray-500">{data.total} resultados · página {page} de {totalPages}</p>
                    <div className="flex gap-2">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Anterior</button>
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Siguiente</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialsAdmin;
