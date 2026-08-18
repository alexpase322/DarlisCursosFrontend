import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import { Loader2, Search, Link2 } from 'lucide-react';
import PartnerBadge from '../../components/PartnerBadge';
import { toast } from 'react-hot-toast';

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

const AffiliatesCRM = () => {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (level) params.set('level', level);
      params.set('page', page);
      const { data } = await axios.get(`/admin/affiliates?${params.toString()}`);
      setItems(data.items);
      setTotal(data.total);
    } catch (err) {
      toast.error('Error al cargar afiliadas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [page, level]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B3854]">Afiliadas</h1>
          <p className="text-gray-500 mt-1">{total} afiliadas registradas</p>
          <button
            type="button"
            onClick={async () => {
              if (!window.confirm("Generar el link de afiliada para todas las Partners que aún no lo tengan?")) return;
              const tId = toast.loading("Generando links...");
              try {
                const { data } = await axios.post("/admin/affiliates/generate-links", {});
                toast.success(`Listo · ${data.created} links nuevos de ${data.scanned} revisadas`, { id: tId, duration: 6000 });
              } catch (e) {
                toast.error(e.response?.data?.message || "Error al generar links", { id: tId });
              }
            }}
            className="mt-3 inline-flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border border-gray-200 text-[#905361] rounded-lg hover:bg-[#FDE5E5] transition"
          >
            <Link2 size={14} /> Generar links de afiliada
          </button>
        </div>
        <form onSubmit={onSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nombre o email"
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#905361]/40"
            />
          </div>
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value="">Todos los niveles</option>
            <option value="2">N2 — Partner</option>
            <option value="3">N3 — Seller</option>
            <option value="4">N4 — Closer</option>
          </select>
          <button type="submit" className="bg-[#905361] text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#5E2B35]">Buscar</button>
        </form>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" /></div>
        ) : items.length === 0 ? (
          <p className="p-10 text-center text-gray-500">No hay afiliadas que cumplan los filtros.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50 border-b">
                  <th className="px-4 py-3">Afiliada</th>
                  <th className="px-4 py-3">Nivel</th>
                  <th className="px-4 py-3">Rango</th>
                  <th className="px-4 py-3">Referidas activas</th>
                  <th className="px-4 py-3">Pendiente</th>
                  <th className="px-4 py-3">Pagado</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a._id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={a.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-[#1B3854]">{a.username}</p>
                          <p className="text-xs text-gray-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><PartnerBadge level={a.partnerLevel} size="sm" /></td>

                    {/* Rango de Arquitecta. Si el guardado se quedo por debajo del
                        que le toca por su total, se avisa para recalcular. */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {a.rank ? (
                        <span
                          className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ background: `linear-gradient(135deg, ${a.rank.gradient[0]}, ${a.rank.gradient[1]})`, color: a.rank.accent }}
                          title={`Nivel ${a.rank.level}`}
                        >
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                            style={{ background: a.rank.accent, color: a.rank.gradient[0] }}
                          >
                            {a.rank.level}
                          </span>
                          {a.rank.title}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                      {a.rankPending && (
                        <span
                          className="block mt-1 text-[10px] font-bold text-amber-600"
                          title="Pulsa 'Rangos de Arquitecta' en el panel admin para aplicarlo"
                        >
                          ⬆ le toca {a.rankPending.title}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">{a.referralStats?.activeReferred || 0}</td>
                    <td className="px-4 py-3 text-amber-600 font-bold">{fmtUSD(a.referralStats?.pendingUSD)}</td>
                    <td className="px-4 py-3 text-green-600">{fmtUSD(a.referralStats?.paidUSD)}</td>
                    <td className="px-4 py-3 text-[#1B3854] font-bold">{fmtUSD(a.referralStats?.totalEarnedUSD)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/afiliadas/${a._id}`} className="text-[#905361] font-bold hover:underline">Ver</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > 20 && (
        <div className="flex justify-center gap-2 mt-6">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50">Anterior</button>
          <span className="px-3 py-1">Página {page}</span>
          <button disabled={page * 20 >= total} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded-lg bg-white border disabled:opacity-50">Siguiente</button>
        </div>
      )}
    </div>
  );
};

export default AffiliatesCRM;
