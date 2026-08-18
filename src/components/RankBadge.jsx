import { useRef, useState, useCallback } from "react";
import { Download, Share2, Check, Loader2 } from "lucide-react";

// Lienzo vertical 4:5 — el formato que mejor se ve en historias y feed.
const W = 1080;
const H = 1350;

// Dibuja la tarjeta del rango en un canvas y devuelve el blob PNG.
// Se hace en canvas (y no con html2canvas) para que la imagen salga siempre
// idéntica, sin depender de las fuentes o el zoom del navegador de cada alumna.
async function renderBadge({ rank, username, avatarUrl }) {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");

    const [c1, c2] = rank.gradient;

    // Fondo degradado en diagonal
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Retícula de plano arquitectónico: guiña a la marca sin robar atención.
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Halo suave detrás del medallón
    const halo = ctx.createRadialGradient(W / 2, 470, 40, W / 2, 470, 330);
    halo.addColorStop(0, "rgba(255,255,255,0.22)");
    halo.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 140, W, 660);

    // Marco interior
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 3;
    ctx.strokeRect(44, 44, W - 88, H - 88);

    const texto = rank.text || "#FFFFFF";

    // Encabezado
    ctx.textAlign = "center";
    ctx.fillStyle = texto;
    ctx.globalAlpha = 0.75;
    ctx.font = "600 30px Helvetica, Arial, sans-serif";
    ctx.fillText("ARQUITECTA DE TU PROPIO ÉXITO", W / 2, 130);
    ctx.globalAlpha = 1;

    // ── Medallón ──
    const cx = W / 2, cy = 470, R = 190;

    ctx.beginPath();
    ctx.arc(cx, cy, R + 24, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fill();
    ctx.strokeStyle = rank.accent;
    ctx.lineWidth = 8;
    ctx.stroke();

    // Foto de la alumna dentro del medallón. Si Cloudinary no permite CORS,
    // el canvas quedaría "tainted" y no se podría exportar: en ese caso
    // caemos a las iniciales, que siempre funcionan.
    let fotoOk = false;
    if (avatarUrl) {
        try {
            const img = await new Promise((resolve, reject) => {
                const i = new Image();
                i.crossOrigin = "anonymous";
                i.onload = () => resolve(i);
                i.onerror = reject;
                i.src = avatarUrl;
                setTimeout(reject, 6000);
            });
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, R - 10, 0, Math.PI * 2);
            ctx.clip();
            const lado = Math.min(img.width, img.height);
            ctx.drawImage(
                img,
                (img.width - lado) / 2, (img.height - lado) / 2, lado, lado,
                cx - (R - 10), cy - (R - 10), (R - 10) * 2, (R - 10) * 2
            );
            ctx.restore();
            fotoOk = true;
        } catch { /* seguimos con iniciales */ }
    }

    if (!fotoOk) {
        const iniciales = (username || "A")
            .trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
        ctx.fillStyle = rank.accent;
        ctx.font = "700 150px Helvetica, Arial, sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillText(iniciales, cx, cy + 6);
        ctx.textBaseline = "alphabetic";
    }

    // Chapa con el número de nivel, colgando del medallón
    const chapaY = cy + R + 6;
    ctx.beginPath();
    ctx.arc(cx, chapaY, 46, 0, Math.PI * 2);
    ctx.fillStyle = rank.accent;
    ctx.fill();
    ctx.fillStyle = c1;
    ctx.font = "700 40px Helvetica, Arial, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(String(rank.level), cx, chapaY + 2);
    ctx.textBaseline = "alphabetic";

    // ── Título del rango ──
    // El rango es un título propio (Constructora, Urbanista, Leyenda…), así que
    // va solo: encima solo se indica de qué nivel de la escalera se trata.
    ctx.fillStyle = texto;
    ctx.font = "600 30px Helvetica, Arial, sans-serif";
    ctx.globalAlpha = 0.7;
    ctx.fillText("RANGO · NIVEL " + rank.level, W / 2, 828);
    ctx.globalAlpha = 1;

    // El nombre del rango se encoge si no cabe, para que nunca se desborde.
    const nombreRango = rank.short.toUpperCase();
    let size = 118;
    do {
        ctx.font = "700 " + size + "px Helvetica, Arial, sans-serif";
        if (ctx.measureText(nombreRango).width <= W - 200) break;
        size -= 6;
    } while (size > 50);
    ctx.fillStyle = rank.accent;
    ctx.fillText(nombreRango, W / 2, 940);

    // Nombre de la alumna
    ctx.fillStyle = texto;
    ctx.font = "600 46px Helvetica, Arial, sans-serif";
    ctx.fillText(username || "", W / 2, 1035);

    // Lema
    ctx.globalAlpha = 0.8;
    ctx.font = "italic 32px Georgia, serif";
    ctx.fillText(rank.lema || "", W / 2, 1100);
    ctx.globalAlpha = 1;

    // Separador y pie
    ctx.beginPath();
    ctx.moveTo(W / 2 - 90, 1160);
    ctx.lineTo(W / 2 + 90, 1160);
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.globalAlpha = 0.7;
    ctx.font = "500 28px Helvetica, Arial, sans-serif";
    ctx.fillText("arquitectadetupropioexito.com", W / 2, 1225);
    ctx.globalAlpha = 1;

    return new Promise(resolve => canvas.toBlob(resolve, "image/png", 0.95));
}

function RankBadge({ rank, username, avatarUrl }) {
    const [ocupado, setOcupado] = useState(false);
    const [listo, setListo] = useState(false);
    const [fallo, setFallo] = useState("");
    const timer = useRef(null);

    const marcarListo = useCallback(() => {
        setListo(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setListo(false), 2500);
    }, []);

    const slug = (username || "perfil")
        .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const nombreArchivo = "arquitecta-" + rank.code + "-" + slug + ".png";

    const descargar = async () => {
        setOcupado(true); setFallo("");
        try {
            const blob = await renderBadge({ rank, username, avatarUrl });
            if (!blob) throw new Error("No se pudo generar la imagen");
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a);
            a.click();
            a.remove();
            // Se libera después del clic: revocar de inmediato aborta la descarga.
            setTimeout(() => URL.revokeObjectURL(url), 10000);
            marcarListo();
        } catch (e) {
            console.error(e);
            setFallo("No pudimos generar tu tarjeta. Intenta de nuevo.");
        } finally {
            setOcupado(false);
        }
    };

    const compartir = async () => {
        setOcupado(true); setFallo("");
        try {
            const blob = await renderBadge({ rank, username, avatarUrl });
            if (!blob) throw new Error("No se pudo generar la imagen");
            const file = new File([blob], nombreArchivo, { type: "image/png" });

            if (navigator.canShare?.({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: rank.title,
                    text: "Alcancé el rango de " + rank.title + " en Arquitecta de tu Propio Éxito."
                });
                marcarListo();
            } else {
                await descargar();
            }
        } catch (e) {
            // Cancelar el diálogo nativo lanza AbortError: eso no es un error real.
            if (e?.name !== "AbortError") {
                console.error(e);
                setFallo("No pudimos compartir tu tarjeta. Prueba con Descargar.");
            }
        } finally {
            setOcupado(false);
        }
    };

    const puedeCompartir = typeof navigator !== "undefined" && !!navigator.canShare;

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    type="button"
                    onClick={descargar}
                    disabled={ocupado}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#1B3854] text-white rounded-xl font-medium hover:bg-[#152c42] transition-colors disabled:opacity-60"
                >
                    {ocupado ? <Loader2 size={18} className="animate-spin" />
                        : listo ? <Check size={18} /> : <Download size={18} />}
                    {listo ? "¡Lista!" : "Descargar tarjeta"}
                </button>

                {puedeCompartir && (
                    <button
                        type="button"
                        onClick={compartir}
                        disabled={ocupado}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-[#905361] text-white rounded-xl font-medium hover:bg-[#7a4552] transition-colors disabled:opacity-60"
                    >
                        <Share2 size={18} /> Compartir
                    </button>
                )}
            </div>

            {fallo && <p className="text-sm text-red-600 mt-3">{fallo}</p>}
        </div>
    );
}

export default RankBadge;
export { renderBadge };
