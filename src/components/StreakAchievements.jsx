import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Flame, Trophy, Lock } from "lucide-react";

const StreakAchievements = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const unlocked = data.achievements.filter(a => a.unlocked);
    const locked = data.achievements.filter(a => !a.unlocked);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-5">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-4 rounded-2xl">
                    <Flame size={28} />
                </div>
                <div className="flex-1">
                    <p className="text-3xl font-bold text-[#1B3854]">{data.currentStreak} {data.currentStreak === 1 ? "día" : "días"}</p>
                    <p className="text-xs text-gray-500">Racha actual · récord {data.longestStreak}</p>
                </div>
                <div className="text-right">
                    <Trophy size={20} className="text-amber-500 inline" />
                    <p className="text-sm font-bold text-[#1B3854]">{unlocked.length}/{data.achievements.length}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">logros</p>
                </div>
            </div>

            {unlocked.length > 0 && (
                <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Desbloqueados</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {unlocked.map(a => (
                            <div key={a.code} className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-3 text-center">
                                <div className="text-2xl mb-1">{a.icon}</div>
                                <p className="text-xs font-bold text-[#1B3854] leading-tight">{a.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {locked.length > 0 && (
                <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Por desbloquear</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {locked.map(a => (
                            <div key={a.code} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center opacity-60" title={a.description}>
                                <div className="text-2xl mb-1 grayscale">{a.icon}</div>
                                <p className="text-xs font-bold text-gray-500 leading-tight flex items-center justify-center gap-1">
                                    <Lock size={10} /> {a.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StreakAchievements;
