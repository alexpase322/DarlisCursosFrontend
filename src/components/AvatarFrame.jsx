import { motion } from "framer-motion";

// Marco/aro alrededor del avatar según el tier de logro más alto.
// Props:
//   src        — URL del avatar
//   tier       — 'bronze' | 'silver' | 'gold' | 'diamond' | null
//   size       — 'xs' | 'sm' | 'md' | 'lg' | 'xl' | numeric (px)
//   alt        — alt text
//   showBadge  — si true, pinta un mini-icono de tier en la esquina
//   icon       — emoji opcional para mostrar en el badge (logro top)

const SIZES = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
};

const TIER_STYLES = {
    bronze: {
        ring: 'from-amber-700 via-amber-500 to-amber-700',
        glow: 'shadow-[0_0_15px_rgba(205,127,50,0.5)]',
        badgeBg: 'bg-amber-700',
        labelBg: 'bg-amber-700 text-white'
    },
    silver: {
        ring: 'from-gray-400 via-gray-200 to-gray-400',
        glow: 'shadow-[0_0_15px_rgba(168,168,168,0.55)]',
        badgeBg: 'bg-gray-400',
        labelBg: 'bg-gray-400 text-white'
    },
    gold: {
        ring: 'from-amber-500 via-yellow-300 to-amber-500',
        glow: 'shadow-[0_0_18px_rgba(212,175,55,0.65)]',
        badgeBg: 'bg-gradient-to-br from-amber-400 to-amber-600',
        labelBg: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    },
    diamond: {
        ring: 'from-cyan-400 via-purple-400 via-pink-400 to-cyan-400',
        glow: 'shadow-[0_0_22px_rgba(91,192,235,0.75)]',
        badgeBg: 'bg-gradient-to-br from-cyan-400 to-purple-500',
        labelBg: 'bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-white'
    }
};

const AvatarFrame = ({
    src, alt = "", tier = null, size = 'md', showBadge = false, icon = null, className = ""
}) => {
    const sizeCls = typeof size === 'string' ? SIZES[size] : '';
    const styleSize = typeof size === 'number' ? { width: size, height: size } : {};
    const t = tier && TIER_STYLES[tier];
    const isDiamond = tier === 'diamond';

    return (
        <div className={`relative inline-block ${className}`}>
            {t ? (
                <motion.div
                    className={`relative rounded-full p-[3px] bg-gradient-to-tr ${t.ring} ${t.glow}`}
                    style={styleSize}
                    animate={isDiamond ? { rotate: [0, 360] } : {}}
                    transition={isDiamond ? { duration: 8, ease: 'linear', repeat: Infinity } : {}}
                >
                    <div className="rounded-full bg-white p-[2px] w-full h-full">
                        <img
                            src={src}
                            alt={alt}
                            className={`rounded-full object-cover w-full h-full ${sizeCls}`}
                            // contra-rotación para que el avatar no gire en diamond
                            style={isDiamond ? { animation: 'avatarCounterRotate 8s linear infinite' } : {}}
                        />
                    </div>
                </motion.div>
            ) : (
                <img src={src} alt={alt} className={`rounded-full object-cover ${sizeCls}`} style={styleSize} />
            )}

            {showBadge && t && (
                <div
                    className={`absolute -bottom-1 -right-1 ${t.badgeBg} rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md border-2 border-white`}
                    title={icon ? `Logro tier ${tier}` : tier}
                >
                    {icon || tierIcon(tier)}
                </div>
            )}
        </div>
    );
};

const tierIcon = (tier) => {
    if (tier === 'diamond') return '💎';
    if (tier === 'gold') return '👑';
    if (tier === 'silver') return '⭐';
    if (tier === 'bronze') return '🔥';
    return '';
};

export default AvatarFrame;
