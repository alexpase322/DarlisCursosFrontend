import { useEffect, useState, useCallback } from "react";

// Hook que expone el estado del install prompt y permite dispararlo.
// - canInstall: true si el navegador soporta beforeinstallprompt y aún no se instaló.
// - isStandalone: true si la app ya está corriendo como PWA (instalada).
// - isIOS: detecta iPhone/iPad (Safari no soporta beforeinstallprompt → mostramos guía manual).
// - promptInstall(): dispara el diálogo nativo. Retorna 'accepted' | 'dismissed' | 'unavailable'.
export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detectar standalone (instalada)
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Detectar iOS (Safari iPhone/iPad)
    const ua = window.navigator.userAgent || "";
    const iOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    setIsIOS(iOS);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
    };
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable";
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    return outcome; // 'accepted' | 'dismissed'
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt && !isStandalone,
    isStandalone,
    isIOS,
    promptInstall,
  };
}
