import { useEffect, useState, useMemo } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { X, Search, Loader2, UserMinus, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("es-ES", { day: '2-digit', month: 'short', year: 'numeric' }) : "—";

// Props:
//   userId       — alumna a la que se le reasigna referidora
//   userName     — para mostrar en header
//   onClose      — () => void
//   onSaved      — () => void   (se llama tras éxito)
const ReassignReferrerModal = ({ userId, userName, onClose, onSaved }) => {
    const [info, setInfo] = useState(null);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [q, setQ] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const [infoRes, partnersRes] = await Promise.all([
                    axios.get(`/admin/users/${userId}/referrer`),
                    axios.get(`/auth/affiliates-public`)
                ]);
                setInfo(infoRes.data);
                setPartners(partnersRes.data || []);
                setSelectedId(infoRes.data.user.referredBy?._id || null);
            } catch (e) {
                toast.error("Error al cargar info");
                onClose();
            } finally { setLoading(false); }
        })();
    }, [userId]);

    const filtered = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return partners;
        return partners.filter(p =>
            p.username?.toLowerCase().includes(term) || p.email?.toLowerCase().includes(term)
        );
    }, [partners, q]);

    const currentReferrer = info?.user?.referredBy;
    const isSameAsCurrent = String(selectedId || '') === String(currentReferrer?._id || '');

    const handleSave = async () => {
        if (saving) return;
        if (isSameAsCurrent) {
            toast("No hay cambios");
            return;
        }
        const confirmTxt = selectedId
            ? `Reasignar referidora a "${partners.find(p => p._id === selectedId)?.username}"?\n\nSe crearán comisiones por cada pago de ${userName}, fechadas a la fecha real del pago.`
            : `Quitar la referidora de ${userName}? Las comisiones existentes serán anuladas.`;
        if (!window.confirm(confirmTxt)) return;

        setSaving(true);
        const tId = toast.loading("Reasignando...");
        try {
            const { data } = await axios.put(`/admin/users/${userId}/referrer`, {
                referrerId: selectedId || null
            });
            const s = data.stats || {};
            const parts = [];
            if (s.created) parts.push(`${s.created} comisiones nuevas`);
            if (s.reassigned) parts.push(`${s.reassigned} reasignadas`);
            if (s.voided) parts.push(`${s.voided} anuladas`);
            if (s.unchanged) parts.push(`${s.unchanged} sin cambio`);
            toast.success(parts.length ? parts.join(" · ") : "Reasignación aplicada", { id: tId, duration: 7000 });
            onSaved?.();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al reasignar", { id: tId });
        } finally { setSaving(false); }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-[#1B3854]">Reasignar referidora</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Alumna: <span className="font-bold">{userName}</span></p>
                    </div>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        {/* Referidora actual */}
                        <div className="p-6 bg-gray-50 border-b border-gray-100">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Referidora actual</p>
                            {currentReferrer ? (
                                <div className="flex items-center gap-3">
                                    <img src={currentReferrer.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-bold text-[#1B3854] text-sm">{currentReferrer.username}</p>
                                        <p className="text-xs text-gray-500">{currentReferrer.email}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">Sin referidora asignada</p>
                            )}
                        </div>

                        {/* Historial de pagos del usuario */}
                        {info?.payments?.length > 0 && (
                            <div className="p-6 border-b border-gray-100">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">
                                    Pagos que generan comisión ({info.payments.length})
                                </p>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                    {info.payments.map(p => (
                                        <div key={p.stripeInvoiceId} className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                                            <span className="flex items-center gap-1 text-gray-600">
                                                <Calendar size={11} /> {fmtDate(p.paidAt)}
                                            </span>
                                            <span className="text-gray-500 capitalize">{p.plan}</span>
                                            <span className="font-bold text-[#1B3854]">{fmtUSD(p.amountUSD)}</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">
                                    Las nuevas comisiones se fechan a la fecha real del pago → entran en el mes correcto en los reportes.
                                </p>
                            </div>
                        )}

                        {/* Selector de nueva referidora */}
                        <div className="p-6">
                            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">Nueva referidora</p>

                            {/* Buscador */}
                            <div className="relative mb-3">
                                <Search size={14} className="absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text" value={q} onChange={(e) => setQ(e.target.value)}
                                    placeholder="Buscar por nombre o email..."
                                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                                />
                            </div>

                            {/* Opción "Sin referidora" */}
                            <button
                                type="button"
                                onClick={() => setSelectedId(null)}
                                className={`w-full mb-2 px-3 py-2.5 rounded-xl border-2 flex items-center gap-3 text-sm transition ${
                                    selectedId === null
                                        ? 'border-amber-400 bg-amber-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                }`}
                            >
                                <UserMinus size={16} className="text-amber-600" />
                                <span className="font-bold text-gray-700">Sin referidora</span>
                                <span className="text-xs text-gray-400 ml-auto">Anular comisiones existentes</span>
                            </button>

                            {/* Lista de partners */}
                            <div className="space-y-1 max-h-64 overflow-y-auto">
                                {filtered.length === 0 ? (
                                    <p className="text-xs text-gray-400 text-center py-4">Sin coincidencias</p>
                                ) : filtered.map(p => (
                                    <button
                                        key={p._id}
                                        type="button"
                                        onClick={() => setSelectedId(p._id)}
                                        disabled={String(p._id) === String(userId)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl border-2 text-left text-sm transition disabled:opacity-30 disabled:cursor-not-allowed ${
                                            String(selectedId) === String(p._id)
                                                ? 'border-[#905361] bg-[#FDE5E5]'
                                                : 'border-gray-100 hover:bg-gray-50'
                                        }`}
                                    >
                                        <img src={p.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#1B3854] text-xs truncate">{p.username}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{p.email}</p>
                                        </div>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1B3854] text-white">
                                            {p.role === 'admin' ? 'ADMIN' : `N${p.partnerLevel}`}
                                        </span>
                                        {String(selectedId) === String(p._id) && <CheckCircle2 size={16} className="text-[#905361]" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aviso si va a cambiar */}
                        {!isSameAsCurrent && (
                            <div className="px-6 pb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
                                    <AlertTriangle size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800">
                                        {selectedId
                                            ? "Las comisiones nuevas se crearán fechadas a la fecha real del pago. Las que ya existen se reasignarán a la nueva afiliada sin cambiar su fecha."
                                            : "Las comisiones existentes serán marcadas como anuladas. Los stats de la afiliada actual se ajustarán."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex gap-2 p-6 border-t border-gray-100 bg-gray-50/50">
                    <button onClick={onClose} type="button"
                        className="flex-1 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600">
                        Cancelar
                    </button>
                    <button onClick={handleSave} disabled={saving || isSameAsCurrent} type="button"
                        className="flex-1 px-4 py-2.5 bg-[#905361] text-white rounded-xl text-sm font-bold disabled:opacity-50">
                        {saving ? "Reasignando..." : "Reasignar"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReassignReferrerModal;
