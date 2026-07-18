import { useState, useEffect } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Star, Image as ImageIcon, X, Trash2, Quote, Send, Loader2, Award } from "lucide-react";
import AvatarFrame from "../components/AvatarFrame";

const StarRating = ({ value, onChange, size = 22, readonly = false }) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
            <button
                key={n}
                type="button"
                disabled={readonly}
                onClick={() => !readonly && onChange?.(n)}
                className={readonly ? "cursor-default" : "cursor-pointer transition-transform hover:scale-110"}
            >
                <Star
                    size={size}
                    className={n <= value ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                />
            </button>
        ))}
    </div>
);

function TestimonialsPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loadingList, setLoadingList] = useState(true);
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { fetchTestimonials(); }, []);

    const fetchTestimonials = async () => {
        setLoadingList(true);
        try {
            const { data } = await axios.get("/testimonials");
            setItems(data);
        } catch {
            toast.error("Error al cargar testimonios");
        } finally {
            setLoadingList(false);
        }
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const clearImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.error("Escribe tu testimonio");
            return;
        }
        setSubmitting(true);
        const formData = new FormData();
        formData.append("content", content);
        formData.append("rating", rating);
        if (image) formData.append("image", image);

        try {
            const { data } = await axios.post("/testimonials", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setItems([data, ...items]);
            setContent("");
            setRating(5);
            clearImage();
            toast.success("¡Gracias por compartir tu testimonio! 💛");
        } catch (err) {
            toast.error(err.response?.data?.message || "Error al publicar");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar este testimonio?")) return;
        try {
            await axios.delete(`/testimonials/${id}`);
            setItems(items.filter((t) => t._id !== id));
            toast.success("Testimonio eliminado");
        } catch {
            toast.error("No se pudo eliminar");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-6">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FDE5E5] text-[#905361] mb-3">
                    <Quote size={28} />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#1B3854]">Testimonios de Arquitectas</h1>
                <p className="text-gray-500 text-sm mt-1 max-w-lg mx-auto">
                    Comparte tu experiencia y lee las historias de otras mujeres que están construyendo su propio éxito.
                </p>
            </div>

            {/* Formulario para crear */}
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <AvatarFrame
                        src={user?.avatar}
                        alt={user?.username}
                        tier={user?.topAchievementTier}
                        size="md"
                    />
                    <div>
                        <p className="font-bold text-[#1B3854] text-sm">{user?.username}</p>
                        <p className="text-xs text-gray-400">Cuéntanos tu experiencia</p>
                    </div>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="¿Qué ha significado para ti ser parte de Arquitecta? ¿Qué resultados has visto?"
                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-[#905361] text-sm resize-none"
                />

                {preview && (
                    <div className="relative mt-3 inline-block">
                        <img src={preview} alt="preview" className="max-h-48 rounded-xl border border-gray-100" />
                        <button
                            type="button"
                            onClick={clearImage}
                            className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block mb-1">
                                Calificación
                            </span>
                            <StarRating value={rating} onChange={setRating} />
                        </div>
                        <label className="flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer hover:text-[#905361] mt-4">
                            <ImageIcon size={18} />
                            <span className="hidden sm:inline">Foto</span>
                            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                        </label>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#905361] text-white rounded-xl font-bold hover:bg-[#5E2B35] transition disabled:opacity-60"
                    >
                        {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {submitting ? "Publicando..." : "Compartir"}
                    </button>
                </div>
            </form>

            {/* Lista de testimonios */}
            {loadingList ? (
                <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#905361]" size={28} /></div>
            ) : items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                    <Quote size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Todavía no hay testimonios. ¡Sé la primera en compartir el tuyo!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((t) => {
                        const isOwner = user?._id === t.author?._id;
                        const canDelete = isOwner || user?.role === "admin";
                        return (
                            <div key={t._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 relative">
                                {t.featured && (
                                    <span className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                        <Award size={11} /> Destacado
                                    </span>
                                )}
                                <div className="flex items-start gap-3 mb-3">
                                    <AvatarFrame
                                        src={t.author?.avatar}
                                        alt={t.author?.username}
                                        tier={t.author?.topAchievementTier}
                                        size="md"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-[#1B3854] text-sm flex items-center gap-1.5">
                                            {t.author?.username}
                                            {t.author?.role === "admin" && (
                                                <span className="bg-[#1B3854] text-white px-1.5 py-0.5 rounded text-[9px] font-bold">ADMIN</span>
                                            )}
                                        </p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <StarRating value={t.rating} readonly size={13} />
                                            <span className="text-xs text-gray-400">
                                                {new Date(t.createdAt).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                                            </span>
                                        </div>
                                    </div>
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDelete(t._id)}
                                            className="text-gray-300 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                <Quote size={20} className="text-[#FDE5E5] mb-1" />
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">{t.content}</p>

                                {t.image && (
                                    <img src={t.image} alt="testimonio" className="mt-4 rounded-xl max-h-96 w-full object-cover border border-gray-50" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TestimonialsPage;
