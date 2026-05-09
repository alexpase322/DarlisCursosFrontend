import { motion } from "framer-motion";

// Wrapper genérico para revelar elementos al hacer scroll.
// Uso: <ScrollReveal delay={0.1}><tu contenido /></ScrollReveal>
const variants = {
    up:    { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    down:  { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } },
    left:  { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.85 }, visible: { opacity: 1, scale: 1 } },
    fade:  { hidden: { opacity: 0 }, visible: { opacity: 1 } }
};

const ScrollReveal = ({ children, direction = "up", delay = 0, duration = 0.7, className = "", once = true }) => (
    <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px" }}
        transition={{ duration, delay, ease: [0.21, 0.61, 0.35, 1] }}
        variants={variants[direction] || variants.up}
    >
        {children}
    </motion.div>
);

export default ScrollReveal;
