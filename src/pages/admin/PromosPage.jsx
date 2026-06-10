import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Loader2, Gift, Save, CheckCircle2, XCircle, Calendar } from "lucide-react";

const PromosPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [promo, setPromo] = useState({
        enabled: false,
        extraMonths: 1,
        label: "¡Por la compra del trimestral, llévate 1 mes EXTRA!"
    });

    useEffect(() => { fetchPromo(); }, []);

    const fetchPromo = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get("/admin/promos/quarterly");
            setPromo({
                enabled: !!data.enabled,
                extraMonths: data.extraMonths || 1,
                label: data.label || ""
            });
        } catch (e) {
            toast.error("Error al cargar promo");
        } finally { setLoading(false); }
    };

    const save = async (next = promo) => {
        if (saving) return;
        setSaving(true);
        try {
            await axios.put("/admin/promos/quarterly", next);
            setPromo(next);
            toast.success(next.enabled ? "Promo activada" : "Promo desactivada");
        } catch (e) {
            toast.error("Error al guardar");
        } finally { setSaving(false); }
    };

    const toggleEnabled = () => save({ ...promo, enabled: !promo.enabled });

    if (loading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854] flex items-center gap-2">
                        <Gift size={24} className="text-[#905361]" /> Promociones
                    </h1>
                    <p className="text-gray-500 text-sm">Activa o desactiva las promos vigentes.</p>
                </div>
            </div>

            {/* Card promo trimestral */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className={`p-6 border-b ${promo.enabled ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-lg font-bold text-[#1B3854]">Trimestral + meses gratis</h2>
                                {promo.enabled ? (
                                    <span className="text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle2 size={12} /> ACTIVA
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <XCircle size={12} /> Desactivada
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                Cuando una alumna compra el plan trimestral, su próximo cobro se difiere {promo.extraMonths} mes{promo.extraMonths !== 1 ? 'es' : ''} extra. Después continúa con renovación trimestral normal.
                            </p>
                        </div>
                        <button
                            onClick={toggleEnabled}
                            disabled={saving}
                            type="button"
                            className={`relative w-14 h-7 rounded-full transition flex-shrink-0 ${promo.enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 ${promo.enabled ? 'left-7' : 'left-0.5'} w-6 h-6 bg-white rounded-full shadow transition-all`} />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                            <Calendar size={12} className="inline mr-1" /> Meses extra que se otorgan
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(n => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPromo({ ...promo, extraMonths: n })}
                                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${
                                        promo.extraMonths === n
                                            ? 'border-[#905361] bg-[#FDE5E5] text-[#5E2B35]'
                                            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    +{n} mes{n > 1 ? 'es' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">
                            Texto que verán las alumnas en la landing
                        </label>
                        <input
                            type="text"
                            value={promo.label}
                            onChange={(e) => setPromo({ ...promo, label: e.target.value })}
                            placeholder="Ej: ¡Por la compra del trimestral, llévate 1 mes EXTRA!"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => save(promo)}
                        disabled={saving}
                        className="w-full py-3 bg-[#905361] text-white rounded-xl font-bold hover:bg-[#5E2B35] flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>

                    {/* Preview */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-[#FDE5E5] to-[#fbd5d5] rounded-xl border border-[#905361]/20">
                        <p className="text-[10px] uppercase tracking-wider text-[#905361] font-bold mb-2">Vista previa</p>
                        <div className="flex items-center gap-2">
                            <Gift size={18} className="text-[#905361]" />
                            <span className="font-bold text-[#5E2B35]">{promo.label}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cómo funciona */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
                <p className="font-bold mb-2">¿Cómo funciona técnicamente?</p>
                <ol className="space-y-1.5 list-decimal pl-5 text-xs">
                    <li>La alumna paga el precio normal del trimestral ($120) en el checkout de Stripe.</li>
                    <li>Justo después, el sistema actualiza la suscripción en Stripe para extender el próximo cobro {promo.extraMonths} mes{promo.extraMonths !== 1 ? 'es' : ''}.</li>
                    <li>La alumna tiene acceso por {3 + promo.extraMonths} meses por el precio de 3 (acceso extendido).</li>
                    <li>Después de ese período, Stripe vuelve a cobrar normalmente cada 3 meses.</li>
                </ol>
                <p className="mt-3 text-xs italic">
                    Importante: la promo solo se aplica a suscripciones nuevas (no a renovaciones de alumnas existentes).
                </p>
            </div>
        </div>
    );
};

export default PromosPage;
