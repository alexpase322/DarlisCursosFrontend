import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import { ArrowLeft, Trophy, Loader2, Crown, Medal } from "lucide-react";

const monthLabel = (s) => {
    if (!s) return "";
    const [y, m] = s.split("-").map(Number);
    return new Date(y, m - 1, 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
};
const todayMonth = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const fmtUSD = (n) => `$${Number(n || 0).toFixed(2)}`;

const Leaderboard = () => {
    const [month, setMonth] = useState(todayMonth());
    const [data, setData] = useState({ items: [], myPosition: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, [month]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`/leaderboard/affiliates?month=${month}`);
            setData(data);
        } finally { setLoading(false); }
    };

    const podiumIcon = (rank) => {
        if (rank === 1) return <Crown size={20} className="text-amber-500" />;
        if (rank === 2) return <Medal size={20} className="text-gray-400" />;
        if (rank === 3) return <Medal size={20} className="text-amber-700" />;
        return <span className="text-gray-400 font-bold text-sm w-5 text-center">#{rank}</span>;
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/afiliada" className="text-gray-500 hover:text-[#1B3854] p-2 rounded-lg hover:bg-gray-100">
                    <ArrowLeft size={20} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854] flex items-center gap-2">
                        <Trophy size={24} className="text-amber-500" /> Top Afiliadas
                    </h1>
                    <p className="text-gray-500 text-sm capitalize">{monthLabel(data.month || month)}</p>
                </div>
                <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>

            {loading ? (
                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
            ) : data.items.length === 0 ? (
                <div className="bg-white rounded-2xl p-10 text-center text-gray-500 border border-gray-100">
                    Aún no hay comisiones registradas este mes.
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {data.items.map(it => (
                        <div key={it.user._id} className={`flex items-center gap-4 px-4 py-4 border-b last:border-b-0 ${
                            it.rank <= 3 ? 'bg-gradient-to-r from-[#FDE5E5]/40 to-transparent' : ''
                        }`}>
                            <div className="w-10 flex justify-center">{podiumIcon(it.rank)}</div>
                            <img src={it.user.avatar || '/icons/icon-192.png'} alt="" className="w-12 h-12 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#1B3854] truncate">{it.user.username}</p>
                                <p className="text-xs text-gray-500">{it.uniqueReferrals} referida{it.uniqueReferrals !== 1 ? 's' : ''} · {it.commissionsCount} comisiones</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-[#905361]">{fmtUSD(it.totalUSD)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data.myPosition && data.myPosition.rank > data.items.length && (
                <div className="mt-4 bg-[#1B3854] text-white rounded-2xl p-4 flex items-center gap-4">
                    <span className="text-amber-300 font-bold">#{data.myPosition.rank}</span>
                    <div className="flex-1">
                        <p className="text-sm font-bold">Tu posición este mes</p>
                        <p className="text-xs opacity-75">de {data.myPosition.totalAffiliates || '—'} afiliadas con comisiones</p>
                    </div>
                    <p className="text-lg font-bold text-amber-300">{fmtUSD(data.myPosition.totalUSD)}</p>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
