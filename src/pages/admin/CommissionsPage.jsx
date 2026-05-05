import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

const CommissionsPage = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totals, setTotals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('available');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [note, setNote] = useState('');
  const [recalcing, setRecalcing] = useState(false);

  const handleRecalculate = async () => {
    if (recalcing) return;
    setRecalcing(true);
    const tId = toast.loading('Recalculando comisiones...');
    try {
      const { data } = await axios.post('/admin/commissions/recalculate', {});
      const s = data?.stats || {};
      toast.success(
        `Listo · creadas: ${s.totalCreated ?? 0} · saltadas: ${s.totalSkipped ?? 0} · usuarias: ${s.processedUsers ?? 0}`,
        { id: tId, duration: 6000 }
      );
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al recalcular', { id: tId });
    } finally {
      setRecalcing(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set('status', status);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      params.set('page', page);
      const { data } = await axios.get(`/admin/commissions?${params.toString()}`);
      setItems(data.items);
      setTotal(data.total);
      setTotals(data.totals || []);
      setSelected(new Set());
    } catch (err) {
      toast.error('Error al cargar comisiones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [status, from, to, page]);

  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.filter(i => i.status === 'available').map(i => i._id)));
    }
  };

  const bulkPay = async () => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      const { data } = await axios.post('/admin/commissions/bulk-mark-paid', { ids: Array.from(selected), note });
      toast.success(data.message);
      setNote('');
      fetchData();
    } catch (err) {
      toast.error('Error al marcar pagadas');
    } finally {
      setBulkLoading(false);
    }
  };

  const totalsByStatus = (s) => totals.find(t => t._id === s);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-[#1B3854] mb-1">Comisiones</h1>
          <p className="text-gray-500">Total registros: {total}</p>
        </div>
        <button
          onClick={handleRecalculate}
          disabled={recalcing}
          title="Recorre todas las referidas y crea comisiones faltantes desde sus pagos de Stripe. Idempotente: no duplica."
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-[#1B3854] rounded-xl hover:bg-[#FDE5E5] hover:border-[#FDE5E5] transition font-medium disabled:opacity-60"
        >
          <RefreshCw size={18} className={recalcing ? 'animate-spin' : ''} />
          {recalcing ? 'Recalculando...' : 'Recalcular comisiones'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {['available', 'paid', 'pending', 'voided'].map(s => {
          const t = totalsByStatus(s);
          return (
            <div key={s} className="bg-white rounded-xl border border-gray-100 p-4">
              <p className="text-xs uppercase font-bold text-gray-500 mb-1 capitalize">{s}</p>
              <p className="text-lg font-bold text-[#1B3854]">{fmtUSD(t?.sum)}</p>
              <p className="text-xs text-gray-400">{t?.count || 0} registros</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="">Todos</option>
          <option value="available">Disponibles</option>
          <option value="paid">Pagadas</option>
          <option value="pending">Pendientes</option>
          <option value="voided">Anuladas</option>
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />

        {selected.size > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota de pago (opcional)" className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            <button onClick={bulkPay} disabled={bulkLoading} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-green-700 disabled:opacity-60 flex items-center gap-2">
              {bulkLoading && <Loader2 size={14} className="animate-spin" />}
              Marcar {selected.size} como pagadas
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" /></div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No hay comisiones con esos filtros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50 border-b">
                  <th className="px-3 py-3 w-10">
                    <input type="checkbox"
                      checked={selected.size > 0 && selected.size === items.filter(i => i.status === 'available').length}
                      onChange={toggleAll} />
                  </th>
                  <th className="px-3 py-3">Fecha</th>
                  <th className="px-3 py-3">Afiliada</th>
                  <th className="px-3 py-3">Referida</th>
                  <th className="px-3 py-3">Plan</th>
                  <th className="px-3 py-3">Comisión</th>
                  <th className="px-3 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {items.map(c => (
                  <tr key={c._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-3 py-2">
                      {c.status === 'available' && (
                        <input type="checkbox" checked={selected.has(c._id)} onChange={() => toggle(c._id)} />
                      )}
                    </td>
                    <td className="px-3 py-2 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{c.affiliate?.username || '—'}</td>
                    <td className="px-3 py-2">{c.referredUser?.username || '—'}</td>
                    <td className="px-3 py-2 capitalize">{c.plan}</td>
                    <td className="px-3 py-2 font-bold text-[#1B3854]">{fmtUSD(c.commissionAmountUSD)}</td>
                    <td className="px-3 py-2"><CommissionStatusPill status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 30 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50">Anterior</button>
          <span className="px-3 py-1">Página {page}</span>
          <button disabled={page * 30 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50">Siguiente</button>
        </div>
      )}
    </div>
  );
};

const CommissionStatusPill = ({ status }) => {
  const map = {
    available: { label: 'Disponible', cls: 'bg-amber-100 text-amber-700' },
    pending:   { label: 'Pendiente',  cls: 'bg-gray-100 text-gray-700' },
    paid:      { label: 'Pagada',     cls: 'bg-green-100 text-green-700' },
    voided:    { label: 'Anulada',    cls: 'bg-red-100 text-red-700' }
  };
  const m = map[status] || map.pending;
  return <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${m.cls}`}>{m.label}</span>;
};

export default CommissionsPage;
