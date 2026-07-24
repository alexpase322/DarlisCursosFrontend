import { useEffect, useState } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { Link2, Copy, Check, Share2, MousePointerClick, Loader2, Pencil, RefreshCw, X } from "lucide-react";

const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

// Tarjeta con el link único de la afiliada + botones de copiar/compartir.
const ReferralLinkCard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [customCode, setCustomCode] = useState("");
    const [savingCode, setSavingCode] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/affiliate/me/link");
                setData(data);
            } catch {
                // Si falla (ej. aún no es Partner) no mostramos la tarjeta.
            } finally { setLoading(false); }
        })();
    }, []);

    // Personaliza el código con el texto que escriba la afiliada.
    const saveCustom = async () => {
        if (savingCode || !customCode.trim()) return;
        setSavingCode(true);
        try {
            const { data: res } = await axios.put("/affiliate/me/link", { customCode });
            setData((d) => ({ ...d, code: res.code, link: res.link }));
            setEditing(false);
            setCustomCode("");
            toast.success("¡Tu link quedó personalizado!");
        } catch (err) {
            toast.error(err.response?.data?.message || "No se pudo actualizar");
        } finally { setSavingCode(false); }
    };

    // Regenera el código a partir del nombre actual (sin personalizar).
    const regenerate = async () => {
        if (savingCode) return;
        setSavingCode(true);
        try {
            const { data: res } = await axios.put("/affiliate/me/link", {});
            setData((d) => ({ ...d, code: res.code, link: res.link }));
            setEditing(false);
            toast.success("Link regenerado con tu nombre");
        } catch (err) {
            toast.error(err.response?.data?.message || "No se pudo regenerar");
        } finally { setSavingCode(false); }
    };

    const copy = async () => {
        if (!data?.link) return;
        try {
            await navigator.clipboard.writeText(data.link);
            setCopied(true);
            toast.success("¡Link copiado!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("No se pudo copiar. Selecciona el texto manualmente.");
        }
    };

    const share = async () => {
        if (!data?.link) return;
        const shareData = {
            title: "Arquitecta de tu Propio Éxito",
            text: "Te invito a construir tu negocio digital desde casa 💛",
            url: data.link
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch { /* cancelado */ }
        } else {
            const wa = `https://wa.me/?text=${encodeURIComponent(shareData.text + " " + data.link)}`;
            window.open(wa, "_blank", "noopener");
        }
    };

    if (loading) {
        return <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 h-32 animate-pulse" />;
    }
    if (!data?.link) return null;

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                    <Link2 size={18} className="text-[#905361]" />
                    <h2 className="font-bold text-[#1B3854]">Tu link de afiliada</h2>
                </div>
                <button
                    type="button"
                    onClick={() => { setEditing((v) => !v); setCustomCode(data.code || ""); }}
                    className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-[#905361] transition"
                >
                    {editing ? <X size={14} /> : <Pencil size={14} />}
                    {editing ? "Cerrar" : "Personalizar"}
                </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
                Comparte este link. Toda persona que compre desde él queda registrada como tu referida
                automáticamente (durante 60 días).
            </p>

            {/* Panel de personalización */}
            {editing && (
                <div className="bg-[#F7F2EF] border border-[#FDE5E5] rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-gray-600 mb-2">Personaliza el final de tu link</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <span className="pl-3 pr-1 text-xs text-gray-400 whitespace-nowrap">/r/</span>
                            <input
                                type="text"
                                value={customCode}
                                onChange={(e) => setCustomCode(e.target.value)}
                                placeholder="tu-nombre"
                                maxLength={40}
                                className="flex-1 py-2 pr-3 text-sm outline-none"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={saveCustom}
                            disabled={savingCode || !customCode.trim()}
                            className="px-4 py-2 bg-[#905361] text-white rounded-lg text-sm font-bold hover:bg-[#5E2B35] disabled:opacity-50 flex items-center justify-center gap-1"
                        >
                            {savingCode ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                            Guardar
                        </button>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            type="button"
                            onClick={regenerate}
                            disabled={savingCode}
                            className="flex items-center gap-1 text-xs font-bold text-[#905361] hover:underline disabled:opacity-50"
                        >
                            <RefreshCw size={12} /> O regenerarlo con mi nombre
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2">
                        Solo letras, números y guiones. Se convierte a minúsculas. Si ya está en uso, elige otro.
                    </p>
                </div>
            )}

            {/* Link + acciones */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="flex-1 bg-[#F7F2EF] border border-[#FDE5E5] rounded-xl px-4 py-3 font-mono text-sm text-[#5E2B35] overflow-x-auto whitespace-nowrap">
                    {data.link}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={copy}
                        className={`px-4 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition ${
                            copied
                                ? "bg-emerald-500 text-white"
                                : "bg-[#905361] text-white hover:bg-[#5E2B35]"
                        }`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copiado" : "Copiar"}
                    </button>
                    <button
                        onClick={share}
                        className="px-4 py-3 rounded-xl font-bold text-sm bg-white border border-gray-200 text-[#1B3854] hover:bg-gray-50 flex items-center gap-2"
                        title="Compartir"
                    >
                        <Share2 size={16} />
                        <span className="hidden sm:inline">Compartir</span>
                    </button>
                </div>
            </div>

            {/* Métricas del link */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-5">
                <span className="flex items-center gap-1.5">
                    <MousePointerClick size={13} className="text-gray-400" />
                    <strong className="text-[#1B3854]">{data.clicks || 0}</strong> clics en tu link
                </span>
            </div>

            {/* Cuánto gana por plan */}
            <div className="border-t border-gray-100 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-3">
                    Lo que ganas por cada venta
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { key: "monthly",  label: "Mensual" },
                        { key: "lifetime", label: "Pago único" }
                    ].map(({ key, label }) => {
                        const e = data.earnings?.[key];
                        if (!e) return null;
                        const destacado = key === "lifetime";
                        return (
                            <div
                                key={key}
                                className={`rounded-xl p-3 border ${
                                    destacado
                                        ? "bg-gradient-to-br from-[#1B3854] to-[#2a4d6e] border-[#1B3854] text-white"
                                        : "bg-gray-50 border-gray-100"
                                }`}
                            >
                                <p className={`text-[10px] uppercase font-bold tracking-wider ${destacado ? "text-white/60" : "text-gray-400"}`}>
                                    {label}
                                </p>
                                <p className={`text-lg font-bold ${destacado ? "text-[#F0D98C]" : "text-[#905361]"}`}>
                                    {fmtUSD(e.commission)}
                                </p>
                                <p className={`text-[10px] ${destacado ? "text-white/60" : "text-gray-400"}`}>
                                    de {fmtUSD(e.price)} {e.recurrente ? "· recurrente" : "· única vez"}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ReferralLinkCard;
