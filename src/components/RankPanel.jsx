import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Trophy, Lock, Check, ChevronRight } from "lucide-react";
import RankBadge from "./RankBadge";
import RankUpModal from "./RankUpModal";

const usd = (n) =>
    "$" + Number(n || 0).toLocaleString("es-CO", { maximumFractionDigits: 0 });

function RankPanel() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verEscalera, setVerEscalera] = useState(false);
    const [celebrar, setCelebrar] = useState(null);

    useEffect(() => {
        let vivo = true;
        axios.get("/affiliate/me/rank")
            .then(res => {
                if (!vivo) return;
                setData(res.data);
                // Ascenso que aun no se le ha mostrado: puede haber ocurrido
                // mientras no estaba conectada.
                if (res.data.pendingCelebration) setCelebrar(res.data.pendingCelebration);
            })
            .catch(err => console.error("Error al cargar el rango", err))
            .finally(() => { if (vivo) setLoading(false); });
        return () => { vivo = false; };
    }, []);

    // Se marca al cerrar, no al abrir: si recarga a medias, la vuelve a ver.
    const cerrarCelebracion = () => {
        setCelebrar(null);
        axios.post("/affiliate/me/rank/celebrated", {})
            .catch(err => console.error("Error al marcar la celebracion", err));
    };

    if (loading) {
        return (
            <div className="bg-white rounded-3xl border border-gray-100 p-8 animate-pulse">
                <div className="h-6 w-40 bg-gray-100 rounded mb-6" />
                <div className="h-32 bg-gray-50 rounded-2xl" />
            </div>
        );
    }

    if (!data?.current) return null;

    const { current, next, percent, remainingUSD, totalUSD, ladder } = data;
    const [c1, c2] = current.gradient;

    return (
        <>
        {celebrar && (
            <RankUpModal
                rank={celebrar}
                username={user?.username}
                avatarUrl={user?.avatar}
                onClose={cerrarCelebracion}
            />
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Tarjeta del rango actual */}
            <div
                className="relative p-8 text-center"
                style={{
                    background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
                    color: current.text
                }}
            >
                {/* Retícula sutil, igual que en la imagen descargable */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
                        backgroundSize: "28px 28px"
                    }}
                />

                <div className="relative">
                    <p className="text-[11px] font-semibold tracking-[0.2em] opacity-75 mb-4">
                        TU RANGO ACTUAL
                    </p>

                    {/* Medallón */}
                    <div className="inline-flex flex-col items-center mb-4">
                        <div
                            className="w-28 h-28 rounded-full flex items-center justify-center border-4 overflow-hidden bg-white/15"
                            style={{ borderColor: current.accent }}
                        >
                            {user?.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Trophy size={40} style={{ color: current.accent }} />
                            )}
                        </div>
                        <span
                            className="-mt-4 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/30"
                            style={{ background: current.accent, color: c1 }}
                        >
                            {current.level}
                        </span>
                    </div>

                    <h3 className="text-3xl font-bold mb-1" style={{ color: current.accent }}>
                        {current.title}
                    </h3>
                    <p className="text-sm opacity-85 italic mb-5">{current.lema}</p>

                    <div className="inline-block bg-black/20 rounded-xl px-5 py-2.5 backdrop-blur-sm">
                        <p className="text-2xl font-bold">{usd(totalUSD)}</p>
                        <p className="text-[10px] uppercase tracking-wider opacity-75">
                            Generado en total
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* Progreso al siguiente rango */}
                {next ? (
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-sm text-gray-500">
                                Siguiente: <span className="font-bold text-[#1B3854]">{next.title}</span>
                            </p>
                            <p className="text-sm font-bold text-[#905361]">{percent}%</p>
                        </div>

                        <div
                            className="h-3 bg-gray-100 rounded-full overflow-hidden"
                            role="progressbar"
                            aria-valuenow={percent}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Progreso hacia ${next.title}`}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${percent}%`,
                                    background: `linear-gradient(90deg, ${next.gradient[0]}, ${next.gradient[1]})`
                                }}
                            />
                        </div>

                        <p className="text-sm text-gray-500 mt-2">
                            Te faltan <span className="font-bold text-[#1B3854]">{usd(remainingUSD)}</span>{" "}
                            para llegar a {next.short}.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-2">
                        <p className="text-lg font-bold text-[#D4AF37]">
                            Llegaste al rango máximo 🏛️
                        </p>
                        <p className="text-sm text-gray-500">No hay nada por encima de esto.</p>
                    </div>
                )}

                {/* Descargar / compartir */}
                <div>
                    <p className="text-sm text-gray-500 mb-3">
                        Descarga tu tarjeta y compártela donde quieras.
                    </p>
                    <RankBadge
                        rank={current}
                        username={user?.username}
                        avatarUrl={user?.avatar}
                    />
                </div>

                {/* Escalera completa */}
                <div className="border-t border-gray-100 pt-4">
                    <button
                        type="button"
                        onClick={() => setVerEscalera(v => !v)}
                        aria-expanded={verEscalera}
                        className="w-full flex items-center justify-between text-sm font-medium text-[#1B3854] hover:text-[#905361] transition-colors"
                    >
                        Ver todos los rangos
                        <ChevronRight
                            size={18}
                            className={`transition-transform duration-200 ${verEscalera ? "rotate-90" : ""}`}
                        />
                    </button>

                    {verEscalera && (
                        <ul className="mt-4 space-y-2">
                            {ladder.map(r => {
                                const esActual = r.code === current.code;
                                return (
                                    <li
                                        key={r.code}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                            esActual
                                                ? "border-[#905361] bg-[#F7F2EF]"
                                                : r.reached
                                                    ? "border-gray-100 bg-white"
                                                    : "border-gray-100 bg-gray-50/60"
                                        }`}
                                    >
                                        <span
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                            style={
                                                r.reached
                                                    ? { background: `linear-gradient(135deg, ${r.gradient[0]}, ${r.gradient[1]})`, color: r.accent }
                                                    : { background: "#E5E7EB", color: "#9CA3AF" }
                                            }
                                        >
                                            {r.level}
                                        </span>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate ${r.reached ? "text-[#1B3854]" : "text-gray-400"}`}>
                                                {r.title}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Desde {usd(r.minUSD)}
                                            </p>
                                        </div>

                                        {esActual ? (
                                            <span className="text-[10px] font-bold uppercase tracking-wide text-[#905361] bg-white px-2.5 py-1 rounded-full border border-[#FDE5E5] flex-shrink-0">
                                                Estás aquí
                                            </span>
                                        ) : r.reached ? (
                                            <Check size={18} className="text-green-500 flex-shrink-0" />
                                        ) : (
                                            <Lock size={16} className="text-gray-300 flex-shrink-0" />
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default RankPanel;
