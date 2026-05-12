import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import {
    ArrowLeft, Search, Loader2, AlertTriangle, RefreshCw,
    CreditCard, FileText, Gift, HelpCircle
} from "lucide-react";

const fmtUSD = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (d) => d ? new Date(d).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" }) : "—";
const todayMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const STATUS_STYLES = {
    paid:     { label: "Pagado", cls: "bg-emerald-100 text-emerald-700" },
    failed:   { label: "Fallido", cls: "bg-red-100 text-red-700" },
    refunded: { label: "Devuelto", cls: "bg-amber-100 text-amber-700" }
};

const SOURCE_STYLES = {
    stripe:  { label: "Stripe", icon: <CreditCard size={11} />, cls: "bg-blue-100 text-blue-700" },
    manual:  { label: "Manual", icon: <FileText size={11} />, cls: "bg-purple-100 text-purple-700" },
    trial:   { label: "Trial", icon: <Gift size={11} />, cls: "bg-cyan-100 text-cyan-700" },
    unknown: { label: "?", icon: <HelpCircle size={11} />, cls: "bg-gray-100 text-gray-500" }
};

const PaymentsPage = () => {
    const [month, setMonth] = useState(todayMonth());
    const [status, setStatus] = useState("");
    const [plan, setPlan] = useState("");
    const [source, setSource] = useState("");
    const [q, setQ] = useState("");
    const [data, setData] = useState({ items: [], summary: {}, total: 0 });
    const [loading, setLoading] = useState(true);
    const [diagnostics, setDiagnostics] = useState(null);
    const [page, setPage] = useState(1);
    const limit = 50;

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ month, page, limit });
            if (status) params.set("status", status);
            if (plan) params.set("plan", plan);
            if (source) params.set("source", source);
            if (q) params.set("q", q);
            const { data } = await axios.get(`/admin/payments?${params.toString()}`);
            setData(data);
        } catch (e) {
            toast.error("Error al cargar pagos");
        } finally {
            setLoading(false);
        }
    };

    const fetchDiagnostics = async () => {
        try {
            const { data } = await axios.get("/admin/payments/diagnose");
            setDiagnostics(data);
        } catch (e) { /* noop */ }
    };

    useEffect(() => { fetchData(); }, [month, status, plan, source, page]);
    useEffect(() => { fetchDiagnostics(); }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchData();
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
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Detalle de pagos</h1>
                    <p className="text-gray-500 text-sm">Audita cada cobro del mes y detecta duplicados o inconsistencias.</p>
                </div>
                <button onClick={() => { fetchData(); fetchDiagnostics(); }} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RefreshCw size={18} />
                </button>
            </div>

            {/* Filtros */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Mes</label>
                    <input type="month" value={month} onChange={(e) => { setMonth(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Estado</label>
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        <option value="">Todos</option>
                        <option value="paid">Pagado</option>
                        <option value="failed">Fallido</option>
                        <option value="refunded">Devuelto</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Plan</label>
                    <select value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        <option value="">Todos</option>
                        <option value="monthly">Mensual</option>
                        <option value="quarterly">Trimestral</option>
                        <option value="yearly">Anual</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Fuente</label>
                    <select value={source} onChange={(e) => { setSource(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                        <option value="">Todas</option>
                        <option value="stripe">Stripe</option>
                        <option value="manual">Manual</option>
                        <option value="trial">Trial</option>
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-xs font-bold text-gray-600 mb-1">Buscar email</label>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ejemplo@correo.com"
                            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
                    </div>
                </div>
                <button type="submit" className="px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold hover:bg-[#5E2B35]">Buscar</button>
            </form>

            {/* Resumen */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-4">
                <StatCard label="Total registros" value={s.totalCount || 0} hint="incluye $0 y fallidos" />
                <StatCard label="Pagos con $" value={s.paidNonZeroCount || 0} hint={`+ ${s.zeroCount || 0} con $0`} accent="text-emerald-700" />
                <StatCard label="Suma pagada" value={fmtUSD(s.paidUSD)} accent="text-emerald-700" />
                <StatCard label="Fallidos" value={s.failedCount || 0} accent="text-red-600" />
                <StatCard label="Devueltos" value={s.refundedCount || 0} accent="text-amber-600" />
                <StatCard label="Mensuales / Trim / Anual" value={`${s.byPlan?.monthly || 0} / ${s.byPlan?.quarterly || 0} / ${s.byPlan?.yearly || 0}`} small />
            </div>

            {/* Alertas */}
            {s.duplicateSubscriptions?.length > 0 && (
                <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle size={20} className="text-amber-600 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold text-amber-900">
                            {s.duplicateSubscriptions.length} suscripción(es) tienen más de 1 cobro pagado este mes
                        </p>
                        <p className="text-xs text-amber-700 mt-1">Posibles cobros duplicados — revisa los IDs marcados en la tabla.</p>
                        <code className="text-[10px] block mt-2 text-amber-700">
                            {s.duplicateSubscriptions.map(d => `${d.subId} (${d.count})`).join(", ")}
                        </code>
                    </div>
                </div>
            )}

            {diagnostics?.activeWithoutPlan?.length > 0 && (
                <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle size={20} className="text-blue-600 flex-shrink-0" />
                    <div className="text-sm flex-1">
                        <p className="font-bold text-blue-900">
                            {diagnostics.activeWithoutPlan.length} usuaria(s) activas SIN plan asignado — afectan el MRR
                        </p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-0.5">
                            {diagnostics.activeWithoutPlan.slice(0, 5).map(u => (
                                <li key={u._id}>
                                    {u.username} ({u.email}) · status: {u.subscription?.status || '—'}
                                </li>
                            ))}
                            {diagnostics.activeWithoutPlan.length > 5 && (
                                <li>… y {diagnostics.activeWithoutPlan.length - 5} más</li>
                            )}
                        </ul>
                        <p className="text-xs text-blue-700 mt-2">→ Reconcilia desde "Suscripciones" o regístrales el plan a mano.</p>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
                ) : data.items.length === 0 ? (
                    <p className="p-10 text-center text-gray-500 text-sm">Sin pagos para estos filtros.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="text-left px-4 py-3">Alumna</th>
                                    <th className="text-left px-4 py-3">Fecha</th>
                                    <th className="text-left px-4 py-3">Plan</th>
                                    <th className="text-right px-4 py-3">Monto</th>
                                    <th className="text-left px-4 py-3">Estado</th>
                                    <th className="text-left px-4 py-3">Fuente</th>
                                    <th className="text-left px-4 py-3">Invoice / Sub</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.map(p => {
                                    const ss = STATUS_STYLES[p.status] || STATUS_STYLES.failed;
                                    const sr = SOURCE_STYLES[p.source] || SOURCE_STYLES.unknown;
                                    const isDuplicate = s.duplicateSubscriptions?.some(d => d.subId === p.stripeSubscriptionId);
                                    return (
                                        <tr key={p._id} className={`border-b last:border-b-0 hover:bg-gray-50/50 ${isDuplicate ? 'bg-amber-50/30' : ''}`}>
                                            <td className="px-4 py-3">
                                                {p.user ? (
                                                    <div className="flex items-center gap-2">
                                                        <img src={p.user.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                                                        <div>
                                                            <p className="font-bold text-[#1B3854] text-xs">{p.user.username}</p>
                                                            <p className="text-[10px] text-gray-400">{p.email}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-500">{p.email}</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">{fmtDate(p.paidAt)}</td>
                                            <td className="px-4 py-3 capitalize text-xs">{p.plan || '—'}</td>
                                            <td className="px-4 py-3 text-right font-bold text-[#1B3854]">{fmtUSD(p.amountUSD)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ss.cls}`}>{ss.label}</span>
                                                {p.status === 'failed' && p.failureReason && (
                                                    <p className="text-[10px] text-red-500 mt-0.5 max-w-[180px] truncate" title={p.failureReason}>{p.failureReason}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${sr.cls}`}>
                                                    {sr.icon} {sr.label}
                                                </span>
                                                {isDuplicate && (
                                                    <span className="block text-[10px] text-amber-600 mt-0.5 font-bold">⚠ DUPLICADO</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-[10px] text-gray-500">
                                                <p className="truncate max-w-[160px]" title={p.stripeInvoiceId}>{p.stripeInvoiceId || '—'}</p>
                                                {p.stripeSubscriptionId && (
                                                    <p className="truncate max-w-[160px] text-gray-400" title={p.stripeSubscriptionId}>{p.stripeSubscriptionId}</p>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
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

const StatCard = ({ label, value, hint, accent = "text-[#1B3854]", small = false }) => (
    <div className="bg-white rounded-2xl p-3 border border-gray-100">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider leading-tight">{label}</p>
        <p className={`${small ? 'text-base' : 'text-2xl'} font-bold mt-1 ${accent}`}>{value}</p>
        {hint && <p className="text-[10px] text-gray-400">{hint}</p>}
    </div>
);

export default PaymentsPage;
