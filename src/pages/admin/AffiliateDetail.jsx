import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../api/axios';
import { Loader2, ArrowLeft, Edit3, CheckCircle2, X } from 'lucide-react';
import PartnerBadge from '../../components/PartnerBadge';
import { toast } from 'react-hot-toast';

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

const AffiliateDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [newLevel, setNewLevel] = useState(2);
  const [savingLevel, setSavingLevel] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [payNote, setPayNote] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/affiliates/${id}`);
      setData(res.data);
      setNewLevel(res.data.user.partnerLevel);
    } catch (err) {
      toast.error('Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const saveLevel = async () => {
    setSavingLevel(true);
    try {
      await axios.put(`/admin/affiliates/${id}/level`, { level: newLevel });
      toast.success('Nivel actualizado');
      setShowLevelModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar nivel');
    } finally {
      setSavingLevel(false);
    }
  };

  const markPaid = async (commissionId) => {
    setPayingId(commissionId);
    try {
      await axios.post(`/admin/commissions/${commissionId}/mark-paid`, { note: payNote });
      toast.success('Comisión marcada como pagada');
      setPayNote('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al marcar pagada');
    } finally {
      setPayingId(null);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" /></div>;
  if (!data) return null;

  const { user, referrals, commissions } = data;
  const stats = user.referralStats || {};

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <Link to="/admin/afiliadas" className="inline-flex items-center gap-2 text-[#905361] hover:underline text-sm mb-4">
        <ArrowLeft size={16} /> Volver al listado
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-[#1B3854]">{user.username}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <PartnerBadge level={user.partnerLevel} />
                {user.partnerLevelSetManually && <span className="text-[10px] uppercase text-gray-400">manual</span>}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowLevelModal(true)}
            className="inline-flex items-center gap-2 bg-[#1B3854] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#2a4d6e]"
          >
            <Edit3 size={16} /> Cambiar nivel
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Stat label="Referidas activas" value={stats.activeReferred || 0} />
          <Stat label="Total referidas" value={stats.totalReferred || 0} />
          <Stat label="Pendiente" value={fmtUSD(stats.pendingUSD)} accent="text-amber-600" />
          <Stat label="Pagado" value={fmtUSD(stats.paidUSD)} accent="text-green-600" />
        </div>
      </div>

      <Section title={`Referidas (${referrals.length})`}>
        {referrals.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no tiene referidas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b">
                <th className="py-2">Alumna</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Desde</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map(r => (
                <tr key={r._id} className="border-b last:border-b-0">
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <img src={r.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-bold text-[#1B3854]">{r.username}</span>
                      <span className="text-xs text-gray-400">{r.email}</span>
                    </div>
                  </td>
                  <td className="py-2 capitalize">{r.subscription?.plan || '—'}</td>
                  <td className="py-2 capitalize">{r.subscription?.status || 'sin suscripción'}</td>
                  <td className="py-2 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      <Section title={`Comisiones (${commissions.length})`}>
        {commissions.length === 0 ? (
          <p className="text-gray-500 text-sm">Aún no se han generado comisiones.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-gray-500 border-b">
                <th className="py-2">Fecha</th>
                <th className="py-2">Referida</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Comisión</th>
                <th className="py-2">Estado</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {commissions.map(c => (
                <tr key={c._id} className="border-b last:border-b-0">
                  <td className="py-2 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="py-2">{c.referredUser?.username || '—'}</td>
                  <td className="py-2 capitalize">{c.plan}</td>
                  <td className="py-2 font-bold text-[#1B3854]">{fmtUSD(c.commissionAmountUSD)}</td>
                  <td className="py-2"><CommissionStatusPill status={c.status} /></td>
                  <td className="py-2 text-right">
                    {c.status === 'available' && (
                      <button
                        onClick={() => markPaid(c._id)}
                        disabled={payingId === c._id}
                        className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-bold text-xs"
                      >
                        {payingId === c._id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        Marcar pagada
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {showLevelModal && (
        <div className="fixed inset-0 z-50 bg-[#1B3854]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setShowLevelModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-[#1B3854] mb-1">Cambiar nivel manualmente</h3>
            <p className="text-xs text-gray-500 mb-5">El usuario quedará marcado como "ajustado manualmente" y la auto-promoción no lo modificará automáticamente.</p>

            <div className="space-y-2">
              {[1, 2, 3, 4].map(lv => (
                <label key={lv} className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                  <input type="radio" checked={newLevel === lv} onChange={() => setNewLevel(lv)} />
                  <PartnerBadge level={lv} size="sm" />
                </label>
              ))}
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowLevelModal(false)} className="flex-1 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl">Cancelar</button>
              <button onClick={saveLevel} disabled={savingLevel} className="flex-1 py-2.5 bg-[#905361] text-white font-bold rounded-xl hover:bg-[#5E2B35] disabled:opacity-60">
                {savingLevel ? 'Guardando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, accent = 'text-[#1B3854]' }) => (
  <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">{label}</p>
    <p className={`text-xl font-bold ${accent}`}>{value}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
    <h2 className="text-lg font-bold text-[#1B3854] mb-4">{title}</h2>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

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

export default AffiliateDetail;
