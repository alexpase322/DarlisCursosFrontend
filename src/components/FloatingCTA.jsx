import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Sparkles } from "lucide-react";

// Botón flotante de WhatsApp / contacto rápido en la landing.
const FloatingCTA = ({
    whatsappNumber = "+573177644289", // Cambiar por tu número
    message = "Hola Darlis, vi tu landing y me gustaría más info."
}) => {
    const [visible, setVisible] = useState(false);
    const [pulse, setPulse] = useState(true);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!visible) return;
        const t = setTimeout(() => setPulse(false), 6000);
        return () => clearTimeout(t);
    }, [visible]);

    const waUrl = `https://wa.me/${whatsappNumber.replace(/[^\d]/g, "")}?text=${encodeURIComponent(message)}`;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.6, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 40 }}
                    className="fixed bottom-6 right-6 z-50 flex items-end gap-3"
                >
                    {pulse && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="bg-white rounded-2xl shadow-xl p-3 max-w-[220px] mb-1 hidden sm:block relative"
                        >
                            <button onClick={() => setPulse(false)} className="absolute top-1 right-1 text-gray-300 hover:text-gray-500">
                                <X size={14} />
                            </button>
                            <p className="text-xs font-bold text-[#1B3854] flex items-center gap-1">
                                <Sparkles size={12} className="text-[#905361]" /> ¿Hablamos?
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Te respondo en menos de 1 hora 💬</p>
                        </motion.div>
                    )}
                    <motion.a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-full p-4 shadow-2xl hover:shadow-emerald-500/40 transition-shadow"
                        aria-label="Abrir WhatsApp"
                    >
                        <MessageCircle size={26} fill="currentColor" />
                        {pulse && (
                            <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75 -z-10" />
                        )}
                    </motion.a>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCTA;
