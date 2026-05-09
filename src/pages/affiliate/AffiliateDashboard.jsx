import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, DollarSign, Users, CheckCircle2, Clock, Wallet, TrendingUp, CalendarClock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import PartnerBadge from '../../components/PartnerBadge';
import { useAuth } from '../../context/AuthContext';

const StatCard = ({ icon: Icon, label, value, accent = '#1B3854' }) => (
  <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 rounded-xl" style={{ backgroundColor: `${accent}1a`, color: accent }}>
        <Icon size={18} />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</span>
    </div>
    <p className="text-2xl font-bold text-[#1B3854]">{value}</p>
  </div>
);

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

const AffiliateDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('summary');
  const [summary, setSummary] = useState(null);
  const [commissions, setCommissions] = useState({ items: [], total: 0 });
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      axios.get('/affiliate/me'),
      axios.get('/affiliate/me/commissions?limit=50'),
      axios.get('/affiliate/me/referrals'),
    ])
      .then(([s, c, r]) => {
        if (!mounted) return;
        setSummary(s.data);
        setCommissions(c.data);
        setReferrals(r.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Error al cargar tu panel de afiliada');
      })
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>;
  }

  const stats = summary?.stats || {};
  const monthly = summary?.monthly || { earnedThisMonth: 0, projectedThisMonth: 0, estimatedTotalThisMonth: 0, projectionBreakdown: {} };
  const monthName = new Date().toLocaleDateString(undefined, { month: 'long' });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1B3854]">Panel de Afiliada</h1>
          <p className="text-gray-500 mt-1">Hola {user?.username}, gestiona tus referidas y comisiones.</p>
        </div>
        <PartnerBadge level={summary?.partnerLevel || user?.partnerLevel} size="lg" />
      </header>

      {/* Este mes — proyección y ganancia */}
      <section className="bg-gradient-to-br from-[#1B3854] to-[#2a4d6e] text-white rounded-2xl p-6 mb-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} />
          <h2 className="text-sm font-bold uppercase tracking-wider">Este mes ({monthName})</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60">Estimado total</p>
            <p className="text-3xl font-bold mt-1">{fmtUSD(monthly.estimatedTotalThisMonth)}</p>
            <p className="text-xs text-white/60 mt-1">Ganado + por cobrar antes de fin de mes</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 flex items-center gap-1">
              <CheckCircle2 size={12} /> Ya generado
            </p>
            <p className="text-2xl font-bold mt-1">{fmtUSD(monthly.earnedThisMonth)}</p>
            <p className="text-xs text-white/60 mt-1">Comisiones acreditadas este mes</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 flex items-center gap-1">
              <CalendarClock size={12} /> Por cobrar
            </p>
            <p className="text-2xl font-bold mt-1">{fmtUSD(monthly.projectedThisMonth)}</p>
            <p className="text-xs text-white/60 mt-1">
              Renovaciones que caen en {monthName.toLowerCase()}
            </p>
          </div>
        </div>
        {(monthly.projectionBreakdown?.quarterly > 0 || monthly.projectionBreakdown?.yearly > 0) && (
          <p className="text-xs text-white/70 mt-4 border-t border-white/10 pt-3">
            Detalle por cobrar:
            {monthly.projectionBreakdown.monthly   > 0 && <> · Mensual {fmtUSD(monthly.projectionBreakdown.monthly)}</>}
            {monthly.projectionBreakdown.quarterly > 0 && <> · Trimestral {fmtUSD(monthly.projectionBreakdown.quarterly)}</>}
            {monthly.projectionBreakdown.yearly    > 0 && <> · Anual {fmtUSD(monthly.projectionBreakdown.yearly)}</>}
          </p>
        )}
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard icon={Users}        label="Referidas activas" value={stats.activeReferred || 0} accent="#905361" />
        <StatCard icon={Users}        label="Total referidas"   value={stats.totalReferred || 0} />
        <StatCard icon={Clock}        label="Pendiente cobro"   value={fmtUSD(stats.pendingUSD)} accent="#D4AF37" />
        <StatCard icon={CheckCircle2} label="Ya cobrado"        value={fmtUSD(stats.paidUSD)}    accent="#16a34a" />
      </div>

      <Link
        to="/afiliada/leaderboard"
        className="mb-8 flex items-center justify-between bg-gradient-to-r from-amber-50 to-[#FDE5E5]/60 border border-amber-200 rounded-2xl p-4 hover:shadow-md transition group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-400 rounded-xl text-white"><Trophy size={20} /></div>
          <div>
            <p className="font-bold text-[#1B3854]">Top afiliadas del mes</p>
            <p className="text-xs text-gray-500">Mira el ranking y tu posición</p>
          </div>
        </div>
        <span className="text-[#905361] font-bold text-sm group-hover:translate-x-1 transition">→</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-2">
        <div className="border-b border-gray-100 flex">
          {[
            { id: 'summary',     label: 'Resumen' },
            { id: 'referrals',   label: `Mis referidas (${referrals.length})` },
            { id: 'commissions', label: `Comisiones (${commissions.total})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors ${
                tab === t.id
                  ? 'border-[#905361] text-[#905361]'
                  : 'border-transparent text-gray-500 hover:text-[#1B3854]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'summary' && (
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-[#905361]" />
                <span>Total acumulado histórico: <strong>{fmtUSD(stats.totalEarnedUSD)}</strong></span>
              </div>
              <p>
                Tus comisiones se generan automáticamente cuando una alumna que te eligió como referidora paga su membresía.
                Mientras siga activa, sigues ganando: {' '}
                <strong>40%</strong> en mensual / trimestral y <strong>50%</strong> en anual.
              </p>
              {summary?.partnerActivatedAt && (
                <p className="text-xs text-gray-400">
                  Partner desde: {new Date(summary.partnerActivatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          {tab === 'referrals' && (
            <div className="overflow-x-auto">
              {referrals.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no tienes referidas. ¡Comparte tu invitación!</p>
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
                    {referrals.map((r) => (
                      <tr key={r._id} className="border-b last:border-b-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={r.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-[#1B3854]">{r.username}</p>
                              <p className="text-xs text-gray-400">{r.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 capitalize">{r.subscription?.plan || '—'}</td>
                        <td className="py-3">
                          <span className={`text-xs font-bold ${
                            r.subscription?.status === 'active' ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {r.subscription?.status || 'sin suscripción'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'commissions' && (
            <div className="overflow-x-auto">
              {commissions.items.length === 0 ? (
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
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.items.map((c) => (
                      <tr key={c._id} className="border-b last:border-b-0">
                        <td className="py-3 text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">{c.referredUser?.username || '—'}</td>
                        <td className="py-3 capitalize">{c.plan}</td>
                        <td className="py-3 font-bold text-[#1B3854]">{fmtUSD(c.commissionAmountUSD)}</td>
                        <td className="py-3">
                          <CommissionStatusPill status={c.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
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

export default AffiliateDashboard;
