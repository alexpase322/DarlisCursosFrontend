import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, RefreshCw, Loader2, CreditCard, Plus, X } from "lucide-react";

const STATUS_STYLES = {
  active:    { label: "Activa",    cls: "bg-green-100 text-green-700" },
  trialing:  { label: "Trial",     cls: "bg-blue-100 text-blue-700" },
  past_due:  { label: "Atrasada",  cls: "bg-amber-100 text-amber-700" },
  canceled:  { label: "Cancelada", cls: "bg-red-100 text-red-700" },
  unpaid:    { label: "Impaga",    cls: "bg-red-100 text-red-700" },
  incomplete:{ label: "Incompleta",cls: "bg-gray-100 text-gray-700" },
  none:      { label: "Sin sub",   cls: "bg-gray-100 text-gray-500" }
};

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : "—");

const StatusPill = ({ status }) => {
  const m = STATUS_STYLES[status] || STATUS_STYLES.none;
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>;
};

const SubscriptionsPanel = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState("");
  const [manualFor, setManualFor] = useState(null);
  const [reconciling, setReconciling] = useState(false);
  const limit = 25;

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit });
      if (q) params.set("q", q);
      if (status) params.set("status", status);
      if (plan) params.set("plan", plan);
      const { data } = await axios.get(`/admin/subscriptions?${params.toString()}`);
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar suscripciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, status, plan]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleSync = async () => {
    if (syncing) return;
    if (!window.confirm("¿Sincronizar pagos y suscripciones desde Stripe?")) return;
    setSyncing(true);
    const tId = toast.loading("Sincronizando con Stripe...");
    try {
      const { data } = await axios.post("/admin/stripe/sync-payments", {});
      const c = data?.counters || {};
      toast.success(
        `Sync OK · nuevos: ${c.inserted ?? 0} · trials: ${c.trialsRecorded ?? 0} · usuarios: ${c.usersUpdated ?? 0}`,
        { id: tId, duration: 6000 }
      );
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al sincronizar", { id: tId });
    } finally {
      setSyncing(false);
    }
  };

  const handleReconcile = async () => {
    if (reconciling) return;
    if (!window.confirm("Rellenar suscripciones faltantes desde Stripe (solo usuarios sin sub, ignora pagos manuales)?")) return;
    setReconciling(true);
    const tId = toast.loading("Reconciliando...");
    try {
      const { data } = await axios.post("/admin/subscriptions/backfill-from-payments", {});
      const s = data?.stats || {};
      toast.success(
        `Listo · revisados: ${s.scanned ?? 0} · actualizados: ${s.updated ?? 0} · sin pago: ${s.noPayment ?? 0}`,
        { id: tId, duration: 6000 }
      );
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al reconciliar", { id: tId });
    } finally {
      setReconciling(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Suscripciones de alumnas</h1>
          <p className="text-gray-500 text-sm">Estado de membresía y pagos por usuaria.</p>
        </div>
        <button
          onClick={handleReconcile}
          disabled={reconciling}
          title="Rellena la sub solo en alumnas que aparezcan sin sub pero tengan un pago de Stripe registrado. No toca pagos manuales."
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition font-medium disabled:opacity-60"
        >
          <RefreshCw size={18} className={reconciling ? "animate-spin" : ""} />
          {reconciling ? "Reconciliando..." : "Reconciliar faltantes"}
        </button>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition font-medium disabled:opacity-60"
        >
          <RefreshCw size={18} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Sincronizando..." : "Actualizar desde Stripe"}
        </button>
      </div>

      {/* Filtros */}
      <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#905361] text-sm"
          />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Todos los estados</option>
          <option value="active">Activa</option>
          <option value="trialing">Trial</option>
          <option value="past_due">Atrasada</option>
          <option value="canceled">Cancelada</option>
          <option value="none">Sin suscripción</option>
        </select>
        <select value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Todos los planes</option>
          <option value="monthly">Mensual</option>
          <option value="quarterly">Trimestral</option>
          <option value="yearly">Anual</option>
        </select>
        <button type="submit" className="px-4 py-2 bg-[#905361] text-white rounded-lg hover:bg-[#5E2B35] text-sm font-bold">Buscar</button>
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-gray-500 text-sm">No hay alumnas que coincidan con los filtros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Alumna</th>
                  <th className="text-left px-4 py-3">Plan</th>
                  <th className="text-left px-4 py-3">Estado</th>
                  <th className="text-left px-4 py-3">Próximo cobro</th>
                  <th className="text-left px-4 py-3">Último pago</th>
                  <th className="text-right px-4 py-3">Total pagado</th>
                  <th className="text-right px-4 py-3">#</th>
                  <th className="text-right px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((u) => {
                  const sub = u.subscription;
                  const subStatus = sub?.status || "none";
                  const noSub = !sub || subStatus === "none" || subStatus === "canceled";
                  return (
                    <tr key={u._id} className="border-b last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={u.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-[#1B3854]">{u.username}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 capitalize">{sub?.plan || u.lastPayment?.plan || "—"}</td>
                      <td className="px-4 py-3"><StatusPill status={subStatus} /></td>
                      <td className="px-4 py-3 text-gray-500">{fmtDate(sub?.currentPeriodEnd)}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {u.lastPayment ? (
                          <div>
                            <p className={u.lastPayment.status === "failed" ? "text-red-600 font-bold" : ""}>
                              {fmtDate(u.lastPayment.paidAt)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {fmtUSD(u.lastPayment.amountUSD)} · <span className={u.lastPayment.status === "failed" ? "text-red-600 font-bold" : ""}>{u.lastPayment.status}</span>
                            </p>
                            {u.lastPayment.status === "failed" && u.lastPayment.failureReason && (
                              <p className="text-[11px] text-red-500 truncate max-w-[200px]" title={u.lastPayment.failureReason}>
                                {u.lastPayment.failureReason}
                              </p>
                            )}
                            {u.failedCount > 0 && u.lastPayment.status !== "failed" && (
                              <p className="text-[11px] text-amber-600">
                                {u.failedCount} intento{u.failedCount > 1 ? "s" : ""} fallido{u.failedCount > 1 ? "s" : ""} previo{u.failedCount > 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-[#1B3854]">{fmtUSD(u.totalPaidUSD)}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{u.paymentsCount}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setManualFor(u)}
                          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 ml-auto ${
                            noSub
                              ? "bg-[#905361] text-white hover:bg-[#5E2B35]"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}
                          title="Registrar pago manual (transferencia, beacons, etc.)"
                        >
                          <Plus size={12} /> Pago manual
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">{total} resultados · página {page} de {totalPages}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >Anterior</button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50"
              >Siguiente</button>
            </div>
          </div>
        )}
      </div>

      {manualFor && (
        <ManualPaymentModal
          user={manualFor}
          onClose={() => setManualFor(null)}
          onSaved={() => { setManualFor(null); fetchData(); }}
        />
      )}
    </div>
  );
};

const PLAN_DEFAULTS = { monthly: 50, quarterly: 120, yearly: 397 };

const ManualPaymentModal = ({ user, onClose, onSaved }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [plan, setPlan] = useState(user.lastPayment?.plan || "monthly");
  const [amountUSD, setAmountUSD] = useState(PLAN_DEFAULTS[user.lastPayment?.plan || "monthly"]);
  const [paidAt, setPaidAt] = useState(today);
  const [method, setMethod] = useState("transfer");
  const [note, setNote] = useState("");
  const [updateSubscription, setUpdateSubscription] = useState(true);
  const [saving, setSaving] = useState(false);

  const onPlanChange = (p) => {
    setPlan(p);
    setAmountUSD(PLAN_DEFAULTS[p]);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    const tId = toast.loading("Registrando pago...");
    try {
      await axios.post(`/admin/subscriptions/${user._id}/manual-payment`, {
        plan, amountUSD: Number(amountUSD), paidAt, method, note, updateSubscription
      });
      toast.success("Pago registrado", { id: tId });
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al registrar pago", { id: tId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#1B3854]">Registrar pago manual</h2>
            <p className="text-xs text-gray-500">{user.username} · {user.email}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => onPlanChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="monthly">Mensual</option>
              <option value="quarterly">Trimestral</option>
              <option value="yearly">Anual</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Monto USD</label>
              <input
                type="number" step="0.01" min="0"
                value={amountUSD}
                onChange={(e) => setAmountUSD(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Fecha de pago</label>
              <input
                type="date"
                value={paidAt}
                onChange={(e) => setPaidAt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Método</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="transfer">Transferencia</option>
              <option value="beacons">Beacons</option>
              <option value="cash">Efectivo</option>
              <option value="other">Otro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Nota (opcional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Referencia, comprobante, etc."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={updateSubscription}
              onChange={(e) => setUpdateSubscription(e.target.checked)}
            />
            Activar suscripción del usuario hasta el próximo cobro
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="button" onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600"
          >Cancelar</button>
          <button
            type="submit" disabled={saving}
            className="flex-1 px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold disabled:opacity-60"
          >{saving ? "Guardando..." : "Registrar pago"}</button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionsPanel;
