import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../api/axios";
import {
    PlayCircle, ArrowRight, CheckCircle2, Sparkles, Users,
    Clock, Loader2, Mail, User, Phone, Gift, Heart, Star, Zap
} from "lucide-react";
import Seo, { faqSchema } from "../components/Seo";
import FloatingCTA from "../components/FloatingCTA";
import ScrollReveal from "../components/ScrollReveal";

// ────────────────────────────────────────────────────────────
// CAMBIA AQUÍ EL VIDEO DEL WEBINAR
// Opciones soportadas:
//  - YouTube: 'https://www.youtube.com/watch?v=XXXX' o el embed
//  - Vimeo: 'https://player.vimeo.com/video/XXXX'
//  - Loom: 'https://www.loom.com/embed/XXXX'
//  - Cualquier URL .mp4 directa (se usará tag <video>)
const VIDEO_URL = import.meta.env.VITE_WEBINAR_VIDEO_URL ||
    "https://youtu.be/C7qxk5iIFQE"; // ← reemplaza por el real

const TITLE = "Cómo construir un negocio digital desde casa sin descuidar a tu familia";
const SUBTITLE = "Webinar gratuito — 30 minutos que pueden cambiar tu próxima década";

const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
        let videoId = "";
        if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
        else if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
    }
    return url;
};

const Webinar = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [leadId, setLeadId] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        if (!form.name.trim() || !form.email.trim()) {
            toast.error("Por favor completa nombre y email");
            return;
        }
        setSubmitting(true);
        try {
            const { data } = await axios.post("/webinar/register", form);
            setRegistered(true);
            setLeadId(data.leadId);
            toast.success("¡Listo! Ya tienes acceso 🎬");
            // Scroll suave al video
            setTimeout(() => {
                document.getElementById("video-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 400);
        } catch (e) {
            toast.error(e.response?.data?.message || "No se pudo registrar");
        } finally {
            setSubmitting(false);
        }
    };

    // Cuando el video termina, marcamos como visto (si es un <video>)
    const handleVideoEnded = async () => {
        if (!leadId) return;
        try { await axios.post(`/webinar/mark-watched/${leadId}`); } catch { /* noop */ }
    };

    const isHTMLVideo = /\.(mp4|webm|ogg)$/i.test(VIDEO_URL);

    const faqs = [
        {
            q: "¿El webinar realmente es gratis?",
            a: "Sí, es completamente gratuito. Solo registras tu nombre y email y obtienes acceso inmediato."
        },
        {
            q: "¿Cuánto dura?",
            a: "Aproximadamente 30 minutos. Te recomendamos verlo sin interrupciones para sacarle máximo provecho."
        },
        {
            q: "¿Qué voy a aprender?",
            a: "Verás el método que usamos las Arquitectas para construir ingresos digitales desde casa, los errores más comunes que evitar y cómo empezar aunque tengas poco tiempo y nada de experiencia técnica."
        },
        {
            q: "¿Tengo que comprar algo al final?",
            a: "No estás obligada a nada. Al final del webinar te contamos sobre la membresía Arquitecta por si quieres dar el siguiente paso, pero la información del video es valiosa por sí sola."
        }
    ];

    return (
        <>
            <Seo
                title="Webinar gratuito — Cómo crear un negocio digital sin descuidar a tu familia"
                description="Reserva tu acceso al webinar gratuito de 30 minutos. Aprende el método para construir ingresos digitales desde casa con Darlis Franco."
                path="/webinar"
                jsonLd={faqSchema(faqs)}
            />
            <FloatingCTA />

            <div className="min-h-screen bg-gradient-to-b from-[#1B3854] via-[#1B3854] to-[#0d1f30] font-sans selection:bg-[#905361] selection:text-white">
                {/* Decoración */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-[#905361] opacity-20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#FDE5E5] opacity-10 rounded-full blur-3xl" />
                </div>

                {/* Navbar mínimo */}
                <nav className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 max-w-[1400px] mx-auto">
                    <Link to="/" className="text-xl font-bold text-white">
                        MomsDigitales<span className="text-[#FDE5E5]">.</span>
                    </Link>
                    <Link to="/#planes" className="text-sm text-white/80 hover:text-white">
                        Ver membresía
                    </Link>
                </nav>

                {/* HERO */}
                <header className="relative px-6 py-12 md:py-16 max-w-[1100px] mx-auto text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#905361]/20 border border-[#905361]/30 text-[#FDE5E5] font-bold text-xs tracking-wider uppercase mb-6">
                            <Gift size={14} /> 100% Gratuito · Sin compromiso
                        </span>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
                            {TITLE.split('familia')[0]}
                            <span className="text-[#FDE5E5]">familia</span>
                            {TITLE.includes('familia') ? '' : ''}
                        </h1>
                        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            {SUBTITLE}
                        </p>

                        {/* Stats bar */}
                        <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-white/70 mb-8">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-[#FDE5E5]" />
                                <span>30 minutos</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-[#FDE5E5]" />
                                <span>+500 mamás formadas</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star size={16} className="text-[#FDE5E5]" />
                                <span>Por Darlis Franco</span>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* SECCIÓN VIDEO + FORM */}
                <section id="video-section" className="relative px-6 pb-16">
                    <div className="max-w-[1100px] mx-auto grid lg:grid-cols-5 gap-8 items-start">
                        {/* Video */}
                        <motion.div
                            className="lg:col-span-3 relative"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video">
                                {registered ? (
                                    isHTMLVideo ? (
                                        <video
                                            ref={videoRef}
                                            controls
                                            autoPlay
                                            onEnded={handleVideoEnded}
                                            className="absolute inset-0 w-full h-full"
                                            src={VIDEO_URL}
                                        />
                                    ) : (
                                        <iframe
                                            src={getEmbedUrl(VIDEO_URL)}
                                            title="Webinar Arquitecta"
                                            className="absolute inset-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    )
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#5E2B35] to-[#1B3854] text-white p-8 text-center">
                                        <PlayCircle size={80} className="text-[#FDE5E5] mb-4 opacity-90" />
                                        <p className="text-lg md:text-2xl font-bold mb-2">El video aparecerá aquí</p>
                                        <p className="text-sm text-white/70 max-w-sm">
                                            Regístrate en el formulario para desbloquear el acceso instantáneo
                                        </p>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-xs text-white/40 mt-3">
                                Auto-play se activa solo después de registrarte
                            </p>
                        </motion.div>

                        {/* Form */}
                        <motion.div
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                        >
                            {!registered ? (
                                <div className="bg-white rounded-3xl p-7 shadow-2xl">
                                    <div className="text-center mb-5">
                                        <Zap size={32} className="text-[#905361] mx-auto mb-2" />
                                        <h2 className="text-xl font-bold text-[#1B3854]">
                                            Acceso instantáneo
                                        </h2>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Solo te tomará 10 segundos
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-3">
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tu nombre"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#905361]"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="Tu email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#905361]"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                                            <input
                                                type="tel"
                                                placeholder="WhatsApp (opcional)"
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#905361]"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-3.5 bg-[#905361] text-white font-bold rounded-xl hover:bg-[#5E2B35] transition flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {submitting ? <Loader2 size={18} className="animate-spin" /> : <PlayCircle size={18} />}
                                            {submitting ? "Registrando..." : "Ver el webinar gratis"}
                                        </button>
                                        <p className="text-[10px] text-gray-400 text-center">
                                            Tus datos están seguros. No haremos spam.
                                        </p>
                                    </form>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-7 text-white text-center shadow-2xl"
                                >
                                    <CheckCircle2 size={48} className="mx-auto mb-3" />
                                    <h2 className="text-xl font-bold mb-2">¡Listo, {form.name.split(' ')[0]}!</h2>
                                    <p className="text-sm text-white/90 mb-4">
                                        Tu acceso está activo. También enviamos copia a tu email.
                                    </p>
                                    <a
                                        href="/#planes"
                                        className="inline-block px-5 py-2.5 bg-white text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition text-sm"
                                    >
                                        Ver membresía →
                                    </a>
                                </motion.div>
                            )}

                            {/* Beneficios rápidos debajo del form */}
                            <div className="mt-5 space-y-2">
                                {[
                                    "Aprende el método paso a paso",
                                    "Sin tecnicismos ni jerga complicada",
                                    "Aplicable aunque tengas poco tiempo"
                                ].map((b, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                                        <CheckCircle2 size={14} className="text-[#FDE5E5] flex-shrink-0" />
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* SECCIÓN: LO QUE VAS A APRENDER */}
                <section className="bg-[#F7F2EF] py-20 px-6">
                    <div className="max-w-[1100px] mx-auto">
                        <ScrollReveal>
                            <div className="text-center mb-12">
                                <span className="inline-block px-3 py-1 rounded-full bg-[#FDE5E5] text-[#905361] text-xs font-bold tracking-wider uppercase mb-3">
                                    En este webinar
                                </span>
                                <h2 className="text-3xl md:text-5xl font-bold text-[#1B3854]">
                                    Lo que vas a descubrir
                                </h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: Sparkles,
                                    title: "El método Arquitecta",
                                    desc: "El proceso paso a paso que ha funcionado para más de 500 mamás emprendedoras."
                                },
                                {
                                    icon: Heart,
                                    title: "Sin descuidar lo importante",
                                    desc: "Cómo organizar tu tiempo para emprender sin sacrificar a tu familia."
                                },
                                {
                                    icon: Star,
                                    title: "Vías de monetización reales",
                                    desc: "Las distintas formas de generar ingresos digitales que se adaptan a tu realidad."
                                }
                            ].map((b, i) => (
                                <ScrollReveal key={i} delay={i * 0.1} direction="up">
                                    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow h-full">
                                        <div className="bg-[#905361]/10 text-[#905361] w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                                            <b.icon size={24} />
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1B3854] mb-2">{b.title}</h3>
                                        <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECCIÓN: TESTIMONIOS */}
                <section className="bg-white py-20 px-6">
                    <div className="max-w-[1000px] mx-auto">
                        <ScrollReveal>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-5xl font-bold text-[#1B3854] mb-3">
                                    Mamás que ya dieron el paso
                                </h2>
                                <p className="text-gray-500 max-w-xl mx-auto">
                                    Esto dicen quienes empezaron antes que tú.
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Mariana V.",
                                    text: "El webinar me dio claridad real. Empecé desde cero y hoy tengo mi primer producto digital vendiendo solo."
                                },
                                {
                                    name: "Andrea P.",
                                    text: "Lo que más me gustó es que no es humo. Darlis muestra el camino completo, sin promesas vacías."
                                },
                                {
                                    name: "Carolina M.",
                                    text: "Lo vi un martes a las 11pm. Para el viernes ya estaba aplicando lo aprendido. Vale más que cursos pagados."
                                }
                            ].map((t, i) => (
                                <ScrollReveal key={i} delay={i * 0.1} direction="up">
                                    <div className="bg-gradient-to-br from-[#F7F2EF] to-white rounded-2xl p-6 border border-[#FDE5E5] h-full">
                                        <div className="flex gap-1 mb-3">
                                            {[1, 2, 3, 4, 5].map(n => <Star key={n} size={14} className="text-amber-400 fill-amber-400" />)}
                                        </div>
                                        <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">"{t.text}"</p>
                                        <p className="text-xs font-bold text-[#905361] uppercase tracking-wider">{t.name}</p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA FINAL */}
                <section className="bg-gradient-to-br from-[#905361] to-[#5E2B35] py-20 px-6 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">
                                ¿Lista para construir tu propio camino?
                            </h2>
                            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                                Después del webinar, si quieres entrar al método completo y a la comunidad de Arquitectas, tu lugar te está esperando.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/#planes"
                                    className="px-8 py-4 bg-white text-[#905361] rounded-full font-bold hover:scale-105 transition text-base shadow-xl flex items-center justify-center gap-2"
                                >
                                    Ver la membresía <ArrowRight size={18} />
                                </Link>
                                <Link
                                    to="/"
                                    className="px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold hover:bg-white/10 transition text-base"
                                >
                                    Volver al inicio
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* FAQs */}
                <section className="bg-[#F7F2EF] py-20 px-6">
                    <div className="max-w-3xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold text-[#1B3854] text-center mb-10">
                                Preguntas frecuentes
                            </h2>
                        </ScrollReveal>
                        <div className="space-y-3">
                            {faqs.map((f, i) => (
                                <ScrollReveal key={i} delay={i * 0.05} direction="up">
                                    <details className="bg-white rounded-2xl p-5 border border-gray-100 group">
                                        <summary className="font-bold text-[#1B3854] cursor-pointer flex items-center justify-between">
                                            {f.q}
                                            <span className="text-[#905361] group-open:rotate-45 transition-transform">+</span>
                                        </summary>
                                        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{f.a}</p>
                                    </details>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer mini */}
                <footer className="bg-[#1B3854] text-white/60 py-8 px-6 text-center text-xs">
                    <p>© {new Date().getFullYear()} Arquitecta de tu Propio Éxito · Todos los derechos reservados</p>
                </footer>
            </div>
        </>
    );
};

export default Webinar;
