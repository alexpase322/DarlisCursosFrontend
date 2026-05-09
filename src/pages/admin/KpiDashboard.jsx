import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import {
    ArrowLeft, Users, DollarSign, TrendingUp, TrendingDown, Loader2,
    UserPlus, AlertCircle, Activity, BookOpen, MessageCircle, Flame
} from "lucide-react";

const fmtUSD = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const KpiDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchKpis(); }, []);

    const fetchKpis = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/admin/kpis");
            setData(data);
        } finally { setLoading(false); }
    };

    if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>;
    if (!data) return null;

    const { users, subscriptions, revenue, content, plans, dailyRevenue, topActive } = data;
    const isUp = revenue.grossDeltaPct != null && revenue.grossDeltaPct >= 0;

    // Mini-chart de barras (últimos 30 días)
    const maxDaily = Math.max(...dailyRevenue.map(d => d.total), 1);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">KPIs del negocio</h1>
                    <p className="text-gray-500 text-sm">Vista general en tiempo real.</p>
                </div>
            </div>

            {/* KPIs principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card
                    icon={<DollarSign size={20} />}
                    color="bg-emerald-50 text-emerald-700"
                    label="MRR estimado"
                    value={fmtUSD(revenue.mrr)}
                    hint="Recurrencia mensual normalizada"
                />
                <Card
                    icon={<DollarSign size={20} />}
                    color="bg-[#FDE5E5] text-[#905361]"
                    label="Bruto este mes"
                    value={fmtUSD(revenue.grossThisMonth)}
                    hint={`${revenue.paymentsThisMonth} pagos`}
                    delta={revenue.grossDeltaPct}
                    deltaUp={isUp}
                />
                <Card
                    icon={<DollarSign size={20} />}
                    color="bg-blue-50 text-blue-700"
                    label="Neto este mes"
                    value={fmtUSD(revenue.netThisMonth)}
                    hint={`Bruto − ${fmtUSD(revenue.commissionsThisMonth)} comisiones`}
                />
                <Card
                    icon={<Users size={20} />}
                    color="bg-amber-50 text-amber-700"
                    label="Alumnas activas"
                    value={users.activeTotal}
                    hint={`${users.active7d} entraron en 7 días`}
                />
            </div>

            {/* Segunda fila: subs y conversión */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <MiniStat label="Suscripciones activas" value={subscriptions.active} />
                <MiniStat label="En trial" value={subscriptions.trialing} accent="text-blue-600" />
                <MiniStat label="Atrasadas" value={subscriptions.pastDue} accent="text-amber-600" />
                <MiniStat label="Canceladas mes" value={subscriptions.canceledThisMonth} accent="text-red-500" hint={`Churn ${subscriptions.churnRatePct}%`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                {/* Pagos diarios mini-chart */}
                <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-[#1B3854] flex items-center gap-2"><Activity size={18} /> Pagos por día (30 días)</h2>
                        <p className="text-sm text-gray-500">Total: {fmtUSD(dailyRevenue.reduce((s, d) => s + d.total, 0))}</p>
                    </div>
                    <div className="flex items-end gap-1 h-40">
                        {dailyRevenue.length === 0 ? (
                            <p className="text-sm text-gray-400 m-auto">Sin datos en este rango</p>
                        ) : dailyRevenue.map((d, i) => {
                            const h = Math.max((d.total / maxDaily) * 100, 2);
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center group" title={`${d.date} · ${fmtUSD(d.total)}`}>
                                    <div
                                        className="w-full bg-gradient-to-t from-[#905361] to-[#FDE5E5] rounded-t transition-all hover:from-[#5E2B35]"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Mix de planes */}
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h2 className="font-bold text-[#1B3854] mb-4">Mix de planes activos</h2>
                    <div className="space-y-3">
                        {[
                            { key: 'monthly', label: 'Mensual', color: 'bg-blue-500' },
                            { key: 'quarterly', label: 'Trimestral', color: 'bg-purple-500' },
                            { key: 'yearly', label: 'Anual', color: 'bg-amber-500' }
                        ].map(p => {
                            const count = plans[p.key] || 0;
                            const total = (plans.monthly || 0) + (plans.quarterly || 0) + (plans.yearly || 0);
                            const pct = total > 0 ? (count / total) * 100 : 0;
                            return (
                                <div key={p.key}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-gray-600">{p.label}</span>
                                        <span className="text-gray-500">{count} · {pct.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${p.color}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Tercera fila: nuevas, alertas, contenido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700"><UserPlus size={20} /></div>
                        <h3 className="font-bold text-[#1B3854]">Nuevas alumnas</h3>
                    </div>
                    <p className="text-3xl font-bold text-[#1B3854]">{users.newThisMonth}</p>
                    <p className="text-xs text-gray-500">este mes (vs {users.newPrevMonth} mes anterior)</p>
                    <p className="text-xs text-gray-400 mt-2">{users.pendingTotal} pendientes de activar</p>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-red-50 text-red-700"><AlertCircle size={20} /></div>
                        <h3 className="font-bold text-[#1B3854]">Alertas</h3>
                    </div>
                    <p className="text-sm text-gray-600">{revenue.failedPaymentsThisMonth} pagos fallidos este mes</p>
                    <p className="text-sm text-gray-600">{subscriptions.pastDue} suscripciones atrasadas</p>
                    <Link to="/admin/suscripciones" className="text-xs text-[#905361] font-bold mt-3 inline-block hover:underline">
                        Ver detalle →
                    </Link>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-700"><BookOpen size={20} /></div>
                        <h3 className="font-bold text-[#1B3854]">Contenido</h3>
                    </div>
                    <p className="text-sm text-gray-600">{content.coursesTotal} cursos publicados</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1"><MessageCircle size={14} /> {content.postsTotal} posts en el muro</p>
                    <p className="text-xs text-gray-400 mt-2">{users.active30d} alumnas activas (30d)</p>
                </div>
            </div>

            {/* Top alumnas más constantes */}
            {topActive.length > 0 && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5">
                    <h2 className="font-bold text-[#1B3854] mb-4 flex items-center gap-2"><Flame size={18} className="text-orange-500" /> Alumnas más constantes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        {topActive.map((u, i) => (
                            <div key={u._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                                <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm text-[#1B3854] truncate">{u.username}</p>
                                    <p className="text-xs text-orange-500">🔥 {u.currentStreak}d / récord {u.longestStreak}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Card = ({ icon, color, label, value, hint, delta, deltaUp }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-start justify-between mb-2">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
            <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        </div>
        <p className="text-2xl font-bold text-[#1B3854]">{value}</p>
        <div className="flex items-center justify-between mt-1">
            {hint && <p className="text-xs text-gray-400">{hint}</p>}
            {delta != null && (
                <span className={`text-xs font-bold flex items-center gap-1 ${deltaUp ? 'text-emerald-600' : 'text-red-500'}`}>
                    {deltaUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(delta).toFixed(1)}%
                </span>
            )}
        </div>
    </div>
);

const MiniStat = ({ label, value, hint, accent = 'text-[#1B3854]' }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{label}</p>
        <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
);

export default KpiDashboard;
