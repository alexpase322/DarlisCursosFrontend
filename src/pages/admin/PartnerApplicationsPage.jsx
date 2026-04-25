import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Loader2, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PartnerBadge from '../../components/PartnerBadge';

const PartnerApplicationsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('pending');
  const [acting, setActing] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/admin/partner-applications?status=${status}`);
      setItems(data);
    } catch (err) {
      toast.error('Error al cargar solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [status]);

  const approve = async (id) => {
    setActing(id);
    try {
      await axios.post(`/admin/partner-applications/${id}/approve`);
      toast.success('Solicitud aprobada — la alumna ya es Partner N2');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al aprobar');
    } finally {
      setActing(null);
    }
  };

  const reject = async (id) => {
    setActing(id);
    try {
      await axios.post(`/admin/partner-applications/${id}/reject`, { reason: rejectReason });
      toast.success('Solicitud rechazada');
      setRejectingId(null);
      setRejectReason('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al rechazar');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1B3854]">Solicitudes Partner</h1>
          <p className="text-gray-500 mt-1">Revisa y decide el paso de N1 → N2.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm">
          <option value="pending">Pendientes</option>
          <option value="approved">Aprobadas</option>
          <option value="rejected">Rechazadas</option>
          <option value="all">Todas</option>
        </select>
      </header>

      {loading ? (
        <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" /></div>
      ) : items.length === 0 ? (
        <div className="p-10 bg-white border border-gray-100 rounded-2xl text-center text-gray-500">No hay solicitudes con ese filtro.</div>
      ) : (
        <div className="space-y-4">
          {items.map(app => (
            <div key={app._id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={app.user?.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[#1B3854]">{app.user?.username}</p>
                    <p className="text-xs text-gray-400">{app.user?.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PartnerBadge level={app.user?.partnerLevel} size="sm" />
                      <span className="text-xs text-gray-400">
                        Suscripción: {app.user?.subscription?.status || 'sin'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Solicitada</p>
                  <p className="text-sm text-[#1B3854]">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {app.message && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3 italic">"{app.message}"</p>
              )}

              {app.status === 'pending' && (
                <div className="mt-4 flex gap-2 justify-end">
                  <button
                    onClick={() => setRejectingId(app._id)}
                    disabled={acting === app._id}
                    className="inline-flex items-center gap-1 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-bold text-sm disabled:opacity-60"
                  >
                    <X size={16} /> Rechazar
                  </button>
                  <button
                    onClick={() => approve(app._id)}
                    disabled={acting === app._id}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-[#905361] text-white rounded-xl hover:bg-[#5E2B35] font-bold text-sm disabled:opacity-60"
                  >
                    {acting === app._id ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
                    Aprobar
                  </button>
                </div>
              )}

              {app.status === 'rejected' && app.rejectionReason && (
                <p className="mt-3 text-xs text-red-600">Motivo: {app.rejectionReason}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-[#1B3854]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-[#1B3854] mb-3">Rechazar solicitud</h3>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo (opcional, lo verá la alumna)"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setRejectingId(null); setRejectReason(''); }} className="flex-1 py-2.5 text-gray-600 hover:bg-gray-50 rounded-xl">Cancelar</button>
              <button
                onClick={() => reject(rejectingId)}
                disabled={acting === rejectingId}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-60"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerApplicationsPage;
