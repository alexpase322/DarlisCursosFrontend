import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Search, Loader2, Mail, Phone, CheckCircle2, XCircle } from "lucide-react";

const fmtDate = (d) => d ? new Date(d).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—";

const WebinarLeadsPage = () => {
    const [data, setData] = useState({ items: [], summary: {}, total: 0 });
    const [loading, setLoading] = useState(true);
    const [q, setQ] = useState("");
    const [page, setPage] = useState(1);
    const limit = 50;

    useEffect(() => { fetchData(); }, [page]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, limit });
            if (q) params.set("q", q);
            const { data } = await axios.get(`/webinar/admin/leads?${params.toString()}`);
            setData(data);
        } catch {
            toast.error("Error al cargar leads");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchData(); };

    const exportCsv = () => {
        const rows = [
            ["Nombre", "Email", "Teléfono", "Vio completo", "Convertida", "Fecha"],
            ...data.items.map(l => [
                l.name, l.email, l.phone || "",
                l.watchedFull ? "Sí" : "No",
                l.converted ? "Sí" : "No",
                fmtDate(l.createdAt)
            ])
        ];
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `webinar-leads-${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const s = data.summary || {};
    const totalPages = Math.max(1, Math.ceil(data.total / limit));

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Leads del webinar</h1>
                    <p className="text-gray-500 text-sm">Personas que se registraron para ver el webinar gratuito.</p>
                </div>
                <button onClick={exportCsv} className="px-4 py-2 bg-white border border-gray-200 text-[#1B3854] rounded-xl text-sm font-bold hover:bg-gray-50">
                    Exportar CSV
                </button>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <Card label="Total registros" value={s.total || 0} color="bg-blue-50 text-blue-700" />
                <Card label="Vieron completo" value={s.watched || 0} color="bg-emerald-50 text-emerald-700" />
                <Card label="Se convirtieron" value={s.converted || 0} color="bg-[#FDE5E5] text-[#905361]" />
            </div>

            {/* Búsqueda */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o email..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <button type="submit" className="px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold">Buscar</button>
            </form>

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
                ) : data.items.length === 0 ? (
                    <p className="p-10 text-center text-gray-500 text-sm">Aún no hay registros.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="text-left px-4 py-3">Nombre</th>
                                    <th className="text-left px-4 py-3">Contacto</th>
                                    <th className="text-left px-4 py-3">Vio completo</th>
                                    <th className="text-left px-4 py-3">Convertida</th>
                                    <th className="text-left px-4 py-3">Fuente</th>
                                    <th className="text-left px-4 py-3">Registro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map(l => (
                                    <tr key={l._id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                                        <td className="px-4 py-3 font-bold text-[#1B3854]">{l.name}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">
                                            <p className="flex items-center gap-1"><Mail size={11} /> {l.email}</p>
                                            {l.phone && <p className="flex items-center gap-1 mt-0.5"><Phone size={11} /> {l.phone}</p>}
                                        </td>
                                        <td className="px-4 py-3">
                                            {l.watchedFull
                                                ? <CheckCircle2 size={18} className="text-emerald-500" />
                                                : <XCircle size={18} className="text-gray-300" />}
                                        </td>
                                        <td className="px-4 py-3">
                                            {l.converted
                                                ? <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Sí ✓</span>
                                                : <span className="text-xs text-gray-400">No</span>}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{l.source}</td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(l.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">{data.total} resultados · página {page} de {totalPages}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Anterior</button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50">Siguiente</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Card = ({ label, value, color }) => (
    <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 inline-block px-2 py-0.5 rounded ${color}`}>{value}</p>
    </div>
);

export default WebinarLeadsPage;
