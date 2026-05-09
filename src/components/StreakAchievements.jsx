import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Flame, Trophy, Lock, Sparkles } from "lucide-react";

const TIER_LABEL = {
    bronze:  { name: 'Bronce',   color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    silver:  { name: 'Plata',    color: 'text-gray-500',  bg: 'bg-gray-50 border-gray-200' },
    gold:    { name: 'Oro',      color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' },
    diamond: { name: 'Diamante', color: 'text-cyan-600',  bg: 'bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200' }
};

const StreakAchievements = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("/engagement/me");
                setData(data);
            } finally { setLoading(false); }
        })();
    }, []);

    if (loading) return <div className="bg-white rounded-2xl p-6 border border-gray-100 h-40 animate-pulse" />;
    if (!data) return null;

    // Defensivo: el endpoint puede venir en versión vieja (sin summary/topAchievement).
    const achievements = Array.isArray(data.achievements) ? data.achievements : [];
    const summary = data.summary || {
        unlockedCount: achievements.filter(a => a.unlocked).length,
        totalCount: achievements.length
    };
    const topAchievement = data.topAchievement || null;
    const topAchievementTier = data.topAchievementTier || null;

    const filtered = filter === 'all' ? achievements : achievements.filter(a => a.tier === filter);
    const unlockedFiltered = filtered.filter(a => a.unlocked);
    const lockedFiltered = filtered.filter(a => !a.unlocked);

    // Si TODOS los logros vienen sin tier → estamos sirviendo respuesta antigua del SW.
    const noTierData = achievements.length > 0 && achievements.every(a => !a.tier);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Cabecera: racha + top tier + contador de logros (sin avatar duplicado) */}
            <div className="flex items-stretch gap-3 mb-5">
                {/* Bloque RACHA */}
                <div className="flex-1 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-3 rounded-xl shadow-md">
                        <Flame size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1B3854] leading-none">
                            {data.currentStreak}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {data.currentStreak === 1 ? "día" : "días"} seguidos
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">récord {data.longestStreak}</p>
                    </div>
                </div>

                {/* Bloque LOGROS */}
                <div className="flex-1 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3 rounded-xl shadow-md">
                        <Trophy size={22} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1B3854] leading-none">
                            {summary.unlockedCount}
                            <span className="text-sm text-gray-400 font-normal">/{summary.totalCount}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">logros</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">desbloqueados</p>
                    </div>
                </div>
            </div>

            {/* Top achievement chip a todo el ancho si existe */}
            {topAchievement && (
                <div className="mb-5 flex items-center gap-2 bg-gradient-to-r from-[#FDE5E5] to-[#fbd5d5] rounded-xl p-3">
                    <span className="text-2xl">{topAchievement.icon}</span>
                    <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#905361]/70 font-bold">Tu logro destacado</p>
                        <p className="font-bold text-[#5E2B35] text-sm">{topAchievement.title}</p>
                    </div>
                    {topAchievementTier && (
                        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-white text-[#905361]">
                            {TIER_LABEL[topAchievementTier]?.name}
                        </span>
                    )}
                </div>
            )}

            {/* Filtros por tier (ocultos si la respuesta vieja no trae tiers) */}
            {!noTierData && (
                <div className="flex flex-wrap gap-2 mb-5">
                    {['all', 'bronze', 'silver', 'gold', 'diamond'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setFilter(t)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition ${
                                filter === t
                                    ? 'bg-[#1B3854] text-white border-[#1B3854]'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {t === 'all' ? 'Todos' : TIER_LABEL[t]?.name}
                        </button>
                    ))}
                </div>
            )}

            {noTierData && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
                    Estamos sirviendo el catálogo viejo. Recarga con <kbd className="px-1.5 py-0.5 bg-white border border-amber-300 rounded text-[10px]">Ctrl+Shift+R</kbd> para ver los logros nuevos por tier.
                </div>
            )}

            {filter !== 'all' && filtered.length === 0 && !noTierData && (
                <div className="text-center py-8 text-gray-400 text-sm">
                    No hay logros del nivel <span className="font-bold">{TIER_LABEL[filter]?.name}</span>.
                </div>
            )}

            {unlockedFiltered.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                        <Sparkles size={12} /> Desbloqueados
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {unlockedFiltered.map(a => {
                            const tl = TIER_LABEL[a.tier];
                            return (
                                <div key={a.code} className={`relative rounded-xl p-3 text-center border ${tl?.bg || 'bg-amber-50 border-amber-200'}`} title={a.description}>
                                    <div className="text-2xl mb-1">{a.icon}</div>
                                    <p className="text-xs font-bold text-[#1B3854] leading-tight">{a.title}</p>
                                    <span className={`absolute top-1 right-1 text-[9px] font-bold uppercase ${tl?.color}`}>{tl?.name?.[0]}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {lockedFiltered.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por desbloquear</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {lockedFiltered.map(a => {
                            const tl = TIER_LABEL[a.tier];
                            return (
                                <div key={a.code} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center opacity-60" title={a.description}>
                                    <div className="text-2xl mb-1 grayscale">{a.icon}</div>
                                    <p className="text-xs font-bold text-gray-500 leading-tight flex items-center justify-center gap-1">
                                        <Lock size={10} /> {a.title}
                                    </p>
                                    <span className={`block text-[9px] font-bold uppercase mt-1 ${tl?.color}`}>{tl?.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakAchievements;
