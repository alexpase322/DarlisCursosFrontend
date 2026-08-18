import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { ArrowLeft, Flame, Trophy, MessageSquare, GraduationCap, Loader2, CalendarDays } from "lucide-react";
import AvatarFrame from "../components/AvatarFrame";
import PartnerBadge from "../components/PartnerBadge";

const TIER_STYLE = {
    bronze:  "bg-amber-50 border-amber-200",
    silver:  "bg-gray-50 border-gray-200",
    gold:    "bg-amber-50 border-amber-300",
    diamond: "bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200"
};

const fmtDate = (d) =>
    d ? new Date(d).toLocaleDateString("es-ES", { month: "long", year: "numeric" }) : "—";

const StatBox = ({ icon: Icon, value, label, color }) => (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
        <Icon size={20} className={`mx-auto mb-1.5 ${color}`} />
        <p className="text-2xl font-bold text-[#1B3854]">{value}</p>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">{label}</p>
    </div>
);

const PublicProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const { data } = await axios.get(`/users/${id}/public`);
                if (!cancelled) setProfile(data);
            } catch (err) {
                if (!cancelled) {
                    toast.error(err.response?.data?.message || "No se pudo cargar el perfil");
                    navigate(-1);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="p-16 flex justify-center">
                <Loader2 className="animate-spin text-[#905361]" size={30} />
            </div>
        );
    }
    if (!profile) return null;

    const esAdmin = profile.role === "admin";

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B3854] mb-4 transition"
            >
                <ArrowLeft size={16} /> Volver
            </button>

            {/* Cabecera */}
            <div className="bg-gradient-to-br from-[#1B3854] to-[#2a4d6e] rounded-3xl p-8 text-white text-center mb-4">
                <div className="flex justify-center mb-4">
                    <AvatarFrame
                        src={profile.avatar}
                        alt={profile.username}
                        tier={profile.topAchievementTier}
                        size={112}
                        showBadge={!!profile.topAchievementTier}
                    />
                </div>

                <h1 className="text-2xl font-bold">{profile.username}</h1>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                    {esAdmin && (
                        <span className="bg-white/15 border border-white/25 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide">
                            ADMINISTRADORA
                        </span>
                    )}
                    {!esAdmin && profile.partnerLevel >= 2 && (
                        <PartnerBadge level={profile.partnerLevel} />
                    )}
                </div>

                {/* Rango de Arquitecta. Se muestra el título, nunca el monto
                    facturado: eso es privado de cada afiliada. */}
                {profile.rank && (
                    <div
                        className="inline-flex items-center gap-2.5 mt-3 pl-2 pr-4 py-1.5 rounded-full border border-white/25"
                        style={{ background: `linear-gradient(135deg, ${profile.rank.gradient[0]}, ${profile.rank.gradient[1]})` }}
                        title={profile.rank.lema}
                    >
                        <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ background: profile.rank.accent, color: profile.rank.gradient[0] }}
                        >
                            {profile.rank.level}
                        </span>
                        <span className="text-sm font-bold" style={{ color: profile.rank.accent }}>
                            {profile.rank.title}
                        </span>
                    </div>
                )}

                {profile.bio && (
                    <p className="text-white/80 text-sm mt-4 max-w-md mx-auto leading-relaxed whitespace-pre-wrap">
                        {profile.bio}
                    </p>
                )}

                <p className="text-white/50 text-xs mt-4 flex items-center justify-center gap-1.5">
                    <CalendarDays size={13} /> En la comunidad desde {fmtDate(profile.memberSince)}
                </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <StatBox icon={Flame} value={profile.currentStreak} label="Racha" color="text-orange-500" />
                <StatBox icon={Trophy} value={profile.stats.achievementsCount} label="Logros" color="text-amber-500" />
                <StatBox icon={GraduationCap} value={profile.stats.coursesCompleted} label="Cursos" color="text-emerald-600" />
                <StatBox icon={MessageSquare} value={profile.stats.postsCount} label="Posts" color="text-blue-500" />
            </div>

            {/* Logros */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-[#1B3854] mb-1 flex items-center gap-2">
                    <Trophy size={18} className="text-amber-500" /> Logros desbloqueados
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    Récord de racha: <strong>{profile.longestStreak}</strong> días seguidos
                </p>

                {profile.achievements.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                        Todavía no ha desbloqueado logros. ¡Va empezando!
                    </p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {profile.achievements.map((a) => (
                            <div
                                key={a.code}
                                title={a.title}
                                className={`rounded-xl p-3 text-center border ${TIER_STYLE[a.tier] || TIER_STYLE.bronze}`}
                            >
                                <div className="text-2xl mb-1">{a.icon}</div>
                                <p className="text-[11px] font-bold text-[#1B3854] leading-tight">{a.title}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PublicProfilePage;
