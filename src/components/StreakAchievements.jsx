import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Flame, Trophy, Lock, Sparkles } from "lucide-react";
import AvatarFrame from "./AvatarFrame";
import { useAuth } from "../context/AuthContext";

const TIER_LABEL = {
    bronze:  { name: 'Bronce',   color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    silver:  { name: 'Plata',    color: 'text-gray-500',  bg: 'bg-gray-50 border-gray-200' },
    gold:    { name: 'Oro',      color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' },
    diamond: { name: 'Diamante', color: 'text-cyan-600',  bg: 'bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200' }
};

const StreakAchievements = () => {
    const { user } = useAuth();
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

    const filtered = filter === 'all' ? data.achievements : data.achievements.filter(a => a.tier === filter);
    const unlockedFiltered = filtered.filter(a => a.unlocked);
    const lockedFiltered = filtered.filter(a => !a.unlocked);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Cabecera con avatar enmarcado + racha + top tier */}
            <div className="flex items-center gap-4 mb-5">
                <AvatarFrame
                    src={user?.avatar}
                    alt={user?.username}
                    tier={data.topAchievementTier}
                    size="xl"
                    showBadge
                    icon={data.topAchievement?.icon}
                />
                <div className="flex-1">
                    <p className="text-3xl font-bold text-[#1B3854] flex items-center gap-2">
                        <Flame size={24} className="text-orange-500" /> {data.currentStreak} {data.currentStreak === 1 ? "día" : "días"}
                    </p>
                    <p className="text-xs text-gray-500">Racha actual · récord {data.longestStreak}</p>
                    {data.topAchievement && (
                        <p className="text-xs mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDE5E5] text-[#905361] font-bold">
                            {data.topAchievement.icon} {data.topAchievement.title}
                        </p>
                    )}
                </div>
                <div className="text-right">
                    <Trophy size={20} className="text-amber-500 inline" />
                    <p className="text-sm font-bold text-[#1B3854]">{data.summary.unlockedCount}/{data.summary.totalCount}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">logros</p>
                </div>
            </div>

            {/* Filtros por tier */}
            <div className="flex flex-wrap gap-2 mb-5">
                {['all', 'bronze', 'silver', 'gold', 'diamond'].map(t => (
                    <button
                        key={t}
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
