import { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, TrendingUp, DollarSign, Percent } from "lucide-react";

const fmtUSD = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtMonth = (s) => {
  const [y, m] = s.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("es-ES", { month: "short", year: "numeric" });
};

const PLAN_LABEL = { monthly: "Mensual", quarterly: "Trimestral", yearly: "Anual" };
const PLAN_COLOR = {
  monthly: "bg-blue-100 text-blue-700",
  quarterly: "bg-purple-100 text-purple-700",
  yearly: "bg-amber-100 text-amber-700"
};

const todayMonth = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const monthsAgo = (n) => {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const RevenuePanel = () => {
  const [from, setFrom] = useState(monthsAgo(11));
  const [to, setTo] = useState(todayMonth());
  const [plan, setPlan] = useState("");
  const [data, setData] = useState({ items: [], totals: {} });
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ from, to: addOneMonth(to) });
      if (plan) params.set("plan", plan);
      const { data } = await axios.get(`/admin/revenue/monthly?${params.toString()}`);
      setData(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar ingresos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [from, to, plan]);

  const totals = data.totals || {};
  const margin = totals.gross > 0 ? ((totals.net / totals.gross) * 100) : 0;

  const sortedItems = useMemo(() => (data.items || []).slice().reverse(), [data.items]);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Ingresos mensuales</h1>
          <p className="text-gray-500 text-sm">Bruto cobrado, comisiones de afiliadas y neto por mes.</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Desde</label>
          <input type="month" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Hasta</label>
          <input type="month" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Plan</label>
          <select value={plan} onChange={(e) => setPlan(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
            <option value="">Todos</option>
            <option value="monthly">Mensual</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
          </select>
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <SummaryCard icon={<DollarSign size={18} />} label="Bruto cobrado" value={fmtUSD(totals.gross)} hint={`${totals.paymentsCount || 0} pagos`} color="bg-emerald-50 text-emerald-700" />
        <SummaryCard icon={<TrendingUp size={18} />} label="Comisiones generadas" value={fmtUSD(totals.commissions)} hint={`${fmtUSD(totals.commissionsPaidOut)} pagadas`} color="bg-rose-50 text-rose-700" />
        <SummaryCard icon={<DollarSign size={18} />} label="Neto" value={fmtUSD(totals.net)} hint="Bruto − comisiones" color="bg-[#FDE5E5] text-[#905361]" />
        <SummaryCard icon={<Percent size={18} />} label="Margen" value={`${margin.toFixed(1)}%`} hint="Neto / bruto" color="bg-blue-50 text-blue-700" />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
        ) : sortedItems.length === 0 ? (
          <p className="p-10 text-center text-gray-500 text-sm">Sin datos para este rango.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Mes</th>
                  <th className="text-right px-4 py-3">Pagos</th>
                  <th className="text-right px-4 py-3">Bruto</th>
                  <th className="text-right px-4 py-3">Comisiones</th>
                  <th className="text-right px-4 py-3">Pagadas</th>
                  <th className="text-right px-4 py-3">Neto</th>
                  <th className="text-right px-4 py-3">Margen</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((b) => {
                  const m = b.gross > 0 ? (b.net / b.gross) * 100 : 0;
                  const isOpen = expanded === b.month;
                  return (
                    <>
                      <tr key={b.month} className="border-b last:border-b-0 hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-bold text-[#1B3854] capitalize">{fmtMonth(b.month)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{b.paymentsCount}</td>
                        <td className="px-4 py-3 text-right font-bold text-emerald-700">{fmtUSD(b.gross)}</td>
                        <td className="px-4 py-3 text-right text-rose-600">{fmtUSD(b.commissions)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{fmtUSD(b.commissionsPaidOut)}</td>
                        <td className="px-4 py-3 text-right font-bold text-[#1B3854]">{fmtUSD(b.net)}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{m.toFixed(1)}%</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setExpanded(isOpen ? null : b.month)}
                            className="text-xs font-bold text-[#905361] hover:underline"
                          >{isOpen ? "Ocultar" : "Ver planes"}</button>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-gray-50/50 border-b">
                          <td colSpan={8} className="px-4 py-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {Object.entries(b.byPlan).map(([p, v]) => (
                                <div key={p} className="bg-white rounded-xl p-3 border border-gray-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PLAN_COLOR[p]}`}>{PLAN_LABEL[p]}</span>
                                    <span className="text-xs text-gray-400">{v.count} pagos</span>
                                  </div>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <p className="text-gray-400">Bruto</p>
                                      <p className="font-bold text-emerald-700">{fmtUSD(v.gross)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Comis.</p>
                                      <p className="font-bold text-rose-600">{fmtUSD(v.commissions)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-400">Neto</p>
                                      <p className="font-bold text-[#1B3854]">{fmtUSD(v.net)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, hint, color }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
    <div className="flex items-start justify-between mb-2">
      <p className="text-xs text-gray-500 font-medium">{label}</p>
      <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
    </div>
    <p className="text-2xl font-bold text-[#1B3854]">{value}</p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const addOneMonth = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(y, m, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default RevenuePanel;
