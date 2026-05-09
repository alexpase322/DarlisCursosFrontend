import { motion } from "framer-motion";

// Carrusel infinito de mensajes/items que se desplaza horizontalmente.
// Uso: <MarqueeStats items={[{icon, text}, ...]} />
const MarqueeStats = ({ items, speed = 30 }) => {
    const doubled = [...items, ...items]; // duplicar para loop infinito
    return (
        <div className="relative overflow-hidden py-6 bg-gradient-to-r from-[#1B3854] to-[#0d1f30] text-white">
            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ ease: 'linear', duration: speed, repeat: Infinity }}
            >
                {doubled.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm md:text-base font-bold opacity-90">
                        <span className="text-2xl">{item.icon}</span>
                        <span>{item.text}</span>
                        <span className="text-[#905361] mx-4">·</span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default MarqueeStats;
