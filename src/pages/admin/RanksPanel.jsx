import { useState, useEffect, useMemo } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Landmark, RefreshCw, Search, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";

const usd = (n) =>
    "$" + Number(n || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 });

const normalizar = (s) =>
    (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const fecha = (d) =>
    d ? new Date(d).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// Insignia del rango con su propia paleta.
function Insignia({ rank, size = "md" }) {
    if (!rank) return <span className="text-xs text-gray-300">—</span>;
    const chico = size === "sm";
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap ${
                chico ? "pl-1 pr-2.5 py-1 text-xs" : "pl-1.5 pr-3.5 py-1.5 text-sm"
            }`}
            style={{
                background: `linear-gradient(135deg, ${rank.gradient[0]}, ${rank.gradient[1]})`,
                color: rank.accent
            }}
        >
            <span
                className={`rounded-full flex items-center justify-center ${chico ? "w-4 h-4 text-[9px]" : "w-5 h-5 text-[10px]"}`}
                style={{ background: rank.accent, color: rank.gradient[0] }}
            >
                {rank.level}
            </span>
            {rank.title}
        </span>
    );
}

function RanksPanel() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recalculando, setRecalculando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [filtroNivel, setFiltroNivel] = useState("todos");

    const cargar = async () => {
        try {
            const res = await axios.get("/admin/ranks");
            setData(res.data);
        } catch (err) {
            console.error("Error al cargar rangos", err);
            toast.error(err.response?.data?.message || "Error al cargar los rangos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { cargar(); }, []);

    const recalcular = async () => {
        const avisar = window.confirm(
            [
                "Aplicar a cada afiliada el rango que le corresponde por su total facturado.",
                "",
                "Aceptar = avisar a quienes suban (notificación + CORREO).",
                "Cancelar = aplicar en silencio.",
                "",
                "La primera vez usa Cancelar: si no, se enviaría un correo de golpe",
                "a todas las que ya superaron algún umbral."
            ].join("\n")
        );
        setRecalculando(true);
        const tId = toast.loading("Recalculando rangos...");
        try {
            const { data: r } = await axios.post(
                `/admin/ranks/recalculate-all${avisar ? "?notify=1" : ""}`, {}
            );
            toast.success(
                `${r.evaluadas} afiliadas · ${r.ascensos} ascensos` + (avisar ? " (avisadas)" : " (sin avisar)"),
                { id: tId, duration: 7000 }
            );
            await cargar();
        } catch (e) {
            toast.error(e.response?.data?.message || "Error al recalcular", { id: tId });
        } finally {
            setRecalculando(false);
        }
    };

    const filtradas = useMemo(() => {
        if (!data?.items) return [];
        const q = normalizar(busqueda.trim());
        return data.items.filter(i => {
            if (filtroNivel === "pendientes" && !i.pendiente) return false;
            if (filtroNivel !== "todos" && filtroNivel !== "pendientes" &&
                String(i.rank?.level ?? 0) !== filtroNivel) return false;
            if (!q) return true;
            return normalizar(i.username).includes(q) || normalizar(i.email).includes(q);
        });
    }, [data, busqueda, filtroNivel]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh] text-[#905361]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-current"></div>
            </div>
        );
    }

    const porRecalcular = data?.totales?.porRecalcular || 0;

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">

            {/* HEADER */}
            <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#905361] mb-4">
                <ArrowLeft size={16} /> Volver al panel
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-[#1B3854] mb-2 flex items-center gap-3">
                        <span className="bg-[#FDE5E5] text-[#905361] p-2.5 rounded-2xl">
                            <Landmark size={30} />
                        </span>
                        Rangos de Arquitecta
                    </h1>
                    <p className="text-gray-500 text-lg">
                        El título de cada afiliada según su total facturado, acumulado de por vida.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={recalcular}
                    disabled={recalculando}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-[#905361] text-white rounded-xl font-bold hover:bg-[#7a4552] transition-colors disabled:opacity-60 whitespace-nowrap"
                >
                    {recalculando
                        ? <Loader2 size={18} className="animate-spin" />
                        : <RefreshCw size={18} />}
                    Recalcular rangos
                </button>
            </div>

            {/* Aviso de pendientes: lo importante de esta pantalla */}
            {porRecalcular > 0 && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-900">
                            {porRecalcular} {porRecalcular === 1 ? "afiliada ya se ganó" : "afiliadas ya se ganaron"} un rango
                            que todavía no {porRecalcular === 1 ? "tiene" : "tienen"}
                        </p>
                        <p className="text-sm text-amber-800 mt-0.5">
                            Pulsa <strong>Recalcular rangos</strong> para aplicárselo. Hasta entonces siguen
                            viendo el rango anterior en su panel.
                        </p>
                    </div>
                </div>
            )}

            {/* Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <p className="text-3xl font-bold text-[#1B3854]">{data?.totales?.afiliadas || 0}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Afiliadas con ventas</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                    <p className="text-3xl font-bold text-[#905361]">{usd(data?.totales?.facturadoUSD)}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Comisiones generadas</p>
                </div>
                <div className={`rounded-2xl p-5 border ${porRecalcular ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200"}`}>
                    <p className={`text-3xl font-bold ${porRecalcular ? "text-amber-600" : "text-gray-300"}`}>
                        {porRecalcular}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Por recalcular</p>
                </div>
            </div>

            {/* Distribución por rango */}
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                Cuántas hay en cada rango
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
                {(data?.distribucion || []).map(r => {
                    const activo = filtroNivel === String(r.level);
                    return (
                        <button
                            key={r.code}
                            type="button"
                            onClick={() => setFiltroNivel(activo ? "todos" : String(r.level))}
                            aria-pressed={activo}
                            className={`rounded-2xl p-3 text-center transition-transform hover:-translate-y-0.5 ${
                                activo ? "ring-2 ring-offset-2 ring-[#905361]" : ""
                            }`}
                            style={{
                                background: `linear-gradient(135deg, ${r.gradient[0]}, ${r.gradient[1]})`,
                                color: r.accent
                            }}
                            title={`Desde ${usd(r.minUSD)}`}
                        >
                            <p className="text-2xl font-bold">{r.count}</p>
                            <p className="text-[11px] font-medium leading-tight mt-0.5 opacity-90">{r.title}</p>
                        </button>
                    );
                })}
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar por nombre o correo…"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/20 focus:border-[#905361]"
                    />
                </div>
                <select
                    value={filtroNivel}
                    onChange={(e) => setFiltroNivel(e.target.value)}
                    aria-label="Filtrar por rango"
                    className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#905361]/20 sm:w-56"
                >
                    <option value="todos">Todos los rangos</option>
                    <option value="pendientes">Solo por recalcular</option>
                    {(data?.distribucion || []).map(r => (
                        <option key={r.code} value={String(r.level)}>{r.title}</option>
                    ))}
                </select>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50 border-b">
                                <th className="px-4 py-3">Afiliada</th>
                                <th className="px-4 py-3">Rango actual</th>
                                <th className="px-4 py-3">Generado</th>
                                <th className="px-4 py-3">Progreso al siguiente</th>
                                <th className="px-4 py-3">Desde</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtradas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                                        No hay afiliadas que coincidan.
                                    </td>
                                </tr>
                            ) : filtradas.map(i => (
                                <tr key={i._id} className="border-b last:border-b-0 hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={i.avatar}
                                                alt=""
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0 bg-gray-100"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold text-[#1B3854] truncate">{i.username}</p>
                                                <p className="text-xs text-gray-400 truncate">{i.email}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3">
                                        <Insignia rank={i.rank} size="sm" />
                                        {i.pendiente && (
                                            <span className="block mt-1 text-[10px] font-bold text-amber-600">
                                                ⬆ le toca {i.pendiente.title}
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <p className="font-bold text-[#1B3854]">{usd(i.totalUSD)}</p>
                                        <p className="text-[11px] text-gray-400">
                                            {i.comisiones} {i.comisiones === 1 ? "comisión" : "comisiones"}
                                        </p>
                                    </td>

                                    <td className="px-4 py-3 min-w-[190px]">
                                        {i.next ? (
                                            <>
                                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                                    <div
                                                        className="h-full rounded-full bg-[#905361]"
                                                        style={{ width: `${i.percent}%` }}
                                                    />
                                                </div>
                                                <p className="text-[11px] text-gray-500">
                                                    Faltan <strong>{usd(i.remainingUSD)}</strong> para {i.next.title}
                                                </p>
                                            </>
                                        ) : (
                                            <span className="text-[11px] font-bold text-[#D4AF37]">Rango máximo 🏛️</span>
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                        {fecha(i.rankReachedAt)}
                                    </td>

                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <Link
                                            to={`/admin/afiliadas/${i._id}`}
                                            className="text-[#905361] font-bold hover:underline"
                                        >
                                            Ver
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default RanksPanel;
