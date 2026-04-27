import { useState } from "react";
import { Download, Smartphone, X, Share, CheckCircle2 } from "lucide-react";
import { usePwaInstall } from "../hooks/usePwaInstall";

// Botón "Descargar app" para el login.
// Siempre visible: si el navegador no soporta el prompt nativo, abre un modal
// con instrucciones específicas (iOS Safari, Android Chrome, escritorio).
const InstallPwaButton = ({ className = "" }) => {
  const { canInstall, isStandalone, isIOS, promptInstall } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);
  const [helpMode, setHelpMode] = useState("ios"); // 'ios' | 'android' | 'desktop' | 'installed'

  // Si ya está instalada, mostrar un confirm sutil en vez de ocultar.
  if (isStandalone) {
    return (
      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium ${className}`}>
        <CheckCircle2 size={16} /> App instalada
      </div>
    );
  }

  const detectMode = () => {
    if (isIOS) return "ios";
    const ua = navigator.userAgent || "";
    if (/Android/i.test(ua)) return "android";
    return "desktop";
  };

  const handleClick = async () => {
    const mode = detectMode();
    if (canInstall) {
      // En desktop, mostramos antes la guía con el tip del checkbox de
      // "Crear acceso directo en escritorio" — Chrome lo trae oculto en
      // un menú desplegable durante la instalación y la mayoría no lo ve.
      if (mode === "desktop") {
        setHelpMode("desktop-prompt");
        setShowHelp(true);
        return;
      }
      await promptInstall();
      return;
    }
    setHelpMode(mode);
    setShowHelp(true);
  };

  const triggerInstall = async () => {
    setShowHelp(false);
    if (canInstall) await promptInstall();
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

      {showHelp && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowHelp(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-[#FDE5E5] text-[#905361]">
                <Smartphone size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#1B3854]">
                {helpMode === "ios" && "Instala en tu iPhone"}
                {helpMode === "android" && "Instala en tu Android"}
                {helpMode === "desktop" && "Instala en tu computadora"}
                {helpMode === "desktop-prompt" && "Antes de instalar"}
              </h3>
            </div>

            {helpMode === "ios" && (
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
            )}

            {helpMode === "android" && (
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">1.</span>
                  <span>Abre el menú del navegador (los <strong>3 puntitos ⋮</strong> arriba a la derecha).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">2.</span>
                  <span>Toca <strong>"Instalar app"</strong> o <strong>"Añadir a pantalla principal"</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">3.</span>
                  <span>Confirma. La app aparecerá como un icono nativo.</span>
                </li>
              </ol>
            )}

            {helpMode === "desktop" && (
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">1.</span>
                  <span>En Chrome o Edge, busca el icono <strong>⊕ Instalar</strong> en la barra de direcciones (lado derecho).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">2.</span>
                  <span>O abre el menú ⋮ → <strong>"Instalar Arquitecta…"</strong>.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-[#905361]">3.</span>
                  <span>La app se abrirá en su propia ventana, como cualquier programa.</span>
                </li>
                <li className="text-xs text-gray-500 mt-3 pl-5">
                  Firefox y Safari de escritorio aún no soportan instalación nativa.
                </li>
              </ol>
            )}

            {helpMode === "desktop-prompt" && (
              <>
                <p className="text-sm text-gray-700 mb-3">
                  Cuando se abra el cuadro de Chrome para instalar, asegúrate de marcar:
                </p>
                <ul className="space-y-2 text-sm text-gray-700 mb-4">
                  <li className="flex items-start gap-2 bg-[#FDE5E5]/60 rounded-lg p-3">
                    <span className="text-[#905361] font-bold">☑</span>
                    <span><strong>Crear acceso directo en el escritorio</strong></span>
                  </li>
                  <li className="flex items-start gap-2 bg-[#FDE5E5]/60 rounded-lg p-3">
                    <span className="text-[#905361] font-bold">☑</span>
                    <span><strong>Anclar a la barra de tareas</strong> (opcional)</span>
                  </li>
                </ul>
                <p className="text-xs text-gray-500 mb-4">
                  Si no ves los checkboxes, despliega la flecha pequeña que aparece en el cuadro de instalación.
                </p>
              </>
            )}

            <button
              onClick={helpMode === "desktop-prompt" ? triggerInstall : () => setShowHelp(false)}
              className="mt-2 w-full py-2.5 bg-[#905361] text-white font-bold rounded-xl hover:bg-[#5E2B35] transition"
            >
              {helpMode === "desktop-prompt" ? "Continuar e instalar" : "Entendido"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallPwaButton;
