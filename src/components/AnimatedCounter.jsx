import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Contador que cuenta desde 0 hasta `value` cuando entra en viewport.
const AnimatedCounter = ({ value, duration = 1800, prefix = "", suffix = "", decimals = 0, className = "" }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (!inView) return;
        const start = performance.now();
        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Easing: easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Number((value * eased).toFixed(decimals)));
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [inView, value, duration, decimals]);

    return (
        <motion.span
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className={className}
        >
            {prefix}{display.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
        </motion.span>
    );
};

export default AnimatedCounter;
