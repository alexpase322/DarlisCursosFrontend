import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, Sparkles, CheckCircle2, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const PartnerApply = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    // Si ya es N2+, redirigir lógico: usamos summary endpoint que está protegido a N2.
    // Si es N1, no podemos llamarlo. Hacemos un fetch ligero a /auth/profile (vía contexto) — ya tenemos user.
    setLoading(false);
    return () => { mounted = false; };
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post('/affiliate/apply', { message });
      setSummary({ application: { status: data.status, createdAt: data.createdAt } });
      toast.success('Solicitud enviada. Te avisaremos pronto.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" /></div>;
  }

  if ((user?.partnerLevel || 1) >= 2) {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <Sparkles className="mx-auto text-[#905361] mb-3" size={36} />
        <h1 className="text-2xl font-bold text-[#1B3854] mb-2">Ya eres Partner</h1>
        <p className="text-gray-500 mb-6">Tu panel de afiliada está disponible.</p>
        <Link to="/afiliada" className="inline-block bg-[#905361] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#5E2B35]">Ir al panel</Link>
      </div>
    );
  }

  const application = summary?.application;
  if (application && application.status === 'pending') {
    return (
      <div className="p-10 max-w-xl mx-auto text-center">
        <Clock className="mx-auto text-amber-500 mb-3" size={36} />
        <h1 className="text-2xl font-bold text-[#1B3854] mb-2">Solicitud en revisión</h1>
        <p className="text-gray-500">Recibimos tu solicitud el {new Date(application.createdAt).toLocaleDateString()}. Te escribimos en cuanto la revisemos.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-[#1B3854] mb-2">Solicita pasar a Partner</h1>
        <p className="text-gray-500 mb-6">
          Como Partner activada (Nivel 2) recibes catálogo de servicios, scripts de venta, link personalizado y comienzas a generar comisiones recurrentes.
        </p>

        <ul className="space-y-2 text-sm text-gray-600 mb-6">
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Tener tu suscripción al día</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Leer el Kit Partner que enviamos</li>
          <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-600" /> Asistir a la sesión de orientación (30 min)</li>
        </ul>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#1B3854] mb-1">Cuéntanos por qué quieres ser Partner (opcional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50"
              placeholder="Tu motivación, experiencia previa, etc."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#905361] text-white font-bold py-3 rounded-xl hover:bg-[#5E2B35] flex justify-center items-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerApply;
