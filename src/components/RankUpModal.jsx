import { useEffect, useRef, useState } from "react";
import { X, Sparkles } from "lucide-react";
import RankBadge, { renderBadge } from "./RankBadge";

// Confeti sin librerías: unas cuantas piezas con retardo y deriva propios.
// 40 piezas es suficiente para la sensación de fiesta sin cargar el móvil.
const PIEZAS = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i % 10) * 0.12,
    dur: 2.6 + ((i * 7) % 18) / 10,
    size: 6 + (i % 4) * 3,
    rot: (i * 53) % 360
}));

function RankUpModal({ rank, username, avatarUrl, onClose }) {
    const [preview, setPreview] = useState(null);
    const cerrarRef = useRef(null);
    const urlRef = useRef(null);

    // Vista previa de la tarjeta que se va a compartir: verla es lo que da
    // ganas de descargarla.
    useEffect(() => {
        let vivo = true;
        renderBadge({ rank, username, avatarUrl })
            .then(blob => {
                if (!vivo || !blob) return;
                urlRef.current = URL.createObjectURL(blob);
                setPreview(urlRef.current);
            })
            .catch(() => { /* la tarjeta se puede generar igual desde el botón */ });
        return () => {
            vivo = false;
            if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        };
    }, [rank, username, avatarUrl]);

    // Foco al cerrar + salir con Escape.
    useEffect(() => {
        cerrarRef.current?.focus();
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const [c1, c2] = rank.gradient;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rank-up-title"
            onClick={onClose}
        >
            <style>{`
                @keyframes rankup-caida {
                    0%   { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
                }
                @keyframes rankup-entrada {
                    0%   { transform: scale(.88) translateY(16px); opacity: 0; }
                    100% { transform: scale(1) translateY(0); opacity: 1; }
                }
                @media (prefers-reduced-motion: reduce) {
                    .rankup-confeti { display: none; }
                    .rankup-panel { animation: none !important; }
                }
            `}</style>

            {/* Confeti */}
            <div aria-hidden="true" className="rankup-confeti fixed inset-0 pointer-events-none overflow-hidden">
                {PIEZAS.map(p => (
                    <span
                        key={p.id}
                        className="absolute top-0 rounded-sm"
                        style={{
                            left: `${p.left}%`,
                            width: p.size,
                            height: p.size * 1.6,
                            background: p.id % 3 === 0 ? rank.accent : p.id % 3 === 1 ? c2 : "#FFFFFF",
                            transform: `rotate(${p.rot}deg)`,
                            animation: `rankup-caida ${p.dur}s linear ${p.delay}s forwards`
                        }}
                    />
                ))}
            </div>

            <div
                className="rankup-panel relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl my-8"
                style={{ animation: "rankup-entrada .55s cubic-bezier(.16,1,.3,1) both" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    ref={cerrarRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/25 text-white flex items-center justify-center hover:bg-black/40 transition-colors"
                >
                    <X size={18} />
                </button>

                {/* Anuncio */}
                <div
                    className="px-6 pt-10 pb-8 text-center"
                    style={{ background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`, color: rank.text }}
                >
                    <p className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] opacity-80 mb-3">
                        <Sparkles size={13} /> SUBISTE DE RANGO
                    </p>

                    <p className="text-sm opacity-80 mb-1">Nivel {rank.level}</p>
                    <h2
                        id="rank-up-title"
                        className="text-4xl font-bold mb-3 leading-tight"
                        style={{ color: rank.accent }}
                    >
                        {rank.title}
                    </h2>
                    <p className="text-sm opacity-90 italic max-w-xs mx-auto">{rank.lema}</p>
                </div>

                {/* Tarjeta y acciones */}
                <div className="p-6 space-y-5">
                    {preview && (
                        <img
                            src={preview}
                            alt={`Tarjeta de reconocimiento: ${rank.title}`}
                            className="w-40 mx-auto rounded-2xl shadow-lg border border-gray-100"
                        />
                    )}

                    <p className="text-sm text-gray-500 text-center">
                        Esta es tu tarjeta de reconocimiento. Descárgala y compártela.
                    </p>

                    <RankBadge rank={rank} username={username} avatarUrl={avatarUrl} />

                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-2.5 text-sm text-gray-500 hover:text-[#1B3854] transition-colors"
                    >
                        Seguir a mi panel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RankUpModal;
