import { useState } from "react";
import { Download, Smartphone, X, Share } from "lucide-react";
import { usePwaInstall } from "../hooks/usePwaInstall";

// Botón "Descargar app" para el login (y donde se quiera reusar).
// Si el navegador soporta el prompt nativo → lo dispara.
// Si es iOS Safari → abre un mini-modal con instrucciones (Compartir → Añadir a Inicio).
// Si la app ya está instalada → se oculta.
const InstallPwaButton = ({ className = "" }) => {
  const { canInstall, isStandalone, isIOS, promptInstall } = usePwaInstall();
  const [showIOS, setShowIOS] = useState(false);

  if (isStandalone) return null;

  // Ni instalable nativo ni iOS → ocultamos (otros desktops sin soporte)
  if (!canInstall && !isIOS) return null;

  const handleClick = async () => {
    if (canInstall) {
      await promptInstall();
      return;
    }
    if (isIOS) setShowIOS(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-[#905361]/20 bg-white text-[#905361] font-bold hover:bg-[#FDE5E5] hover:border-[#905361]/40 transition-all ${className}`}
      >
        <Download size={18} />
        Descargar app
      </button>

      {showIOS && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowIOS(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowIOS(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#FDE5E5] text-[#905361]">
                <Smartphone size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#1B3854]">Instala en tu iPhone</h3>
            </div>

            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-2">
                <span className="font-bold text-[#905361]">1.</span>
                <span>
                  Toca el icono <Share size={14} className="inline align-text-bottom" /> <strong>Compartir</strong> en la barra inferior de Safari.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#905361]">2.</span>
                <span>Selecciona <strong>"Añadir a pantalla de inicio"</strong>.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-[#905361]">3.</span>
                <span>Toca <strong>"Añadir"</strong>. La app aparecerá en tu pantalla principal.</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOS(false)}
              className="mt-5 w-full py-2.5 bg-[#905361] text-white font-bold rounded-xl hover:bg-[#5E2B35] transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPwaButton;
