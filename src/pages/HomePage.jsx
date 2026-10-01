import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { 
  Check, Loader2, Instagram, Video, Brain, Code, Cpu, Sparkles, Mail, Send, 
  Hammer, Palette, Bot, Smartphone, Layout, DollarSign, Package, PieChart,
  CheckCircle2, Target, Users, PlayCircle, CalendarPlus, HeartHandshake, Rocket
} from "lucide-react";

import darlisImg from "../assets/DarlisFoto.png"
import alexImg from "../assets/Alex foto.png"
import equipoHeroImg from "../assets/FotoDarlisHero.jpeg"
import Seo from "../components/Seo";
import { seoConfigs } from "../seo";
import FloatingCTA from "../components/FloatingCTA";
import AnimatedCounter from "../components/AnimatedCounter";
import MarqueeStats from "../components/MarqueeStats";
import ScrollReveal from "../components/ScrollReveal";
import { getReferral, captureReferralFromUrl } from "../utils/referral";

const HomePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA EL FORMULARIO DE CONTACTO ---
  const [sendingContact, setSendingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // Captura la atribución de afiliada si llegan con ?ref=<codigo>
  useEffect(() => { captureReferralFromUrl(); }, []);

  // Price IDs vigentes traídos del servidor en runtime (así no dependen del build).
  const [priceConfig, setPriceConfig] = useState({});
  useEffect(() => {
    axios.get("/payment/config").then(({ data }) => setPriceConfig(data || {})).catch(() => {});
  }, []);

  // --- DATOS DEL PROGRAMA ---
  const CURRICULUM = [
    {
      phase: "Fase 1: Los Cimientos",
      title: "Mentalidad y Organización",
      desc: "Prepara el terreno y demuele viejas estructuras de empleada.",
      topics: ["Ingeniería Mental y Reprogramación", "La Oficina de Proyectos (Notion & Time Blocking)"],
      icon: <Hammer size={24} />,
    },
    {
      phase: "Fase 2: Diseño de Interiores",
      title: "Creatividad y Fachada",
      desc: "Diseña una identidad visual en redes sociales y crea contenido que conecte.",
      topics: ["Estudio de Diseño (Canva Expert)", "Producción Visual (CapCut Pro)"],
      icon: <Palette size={24} />,
    },
    {
      phase: "Fase 3: Tecnología",
      title: "Inteligencia Artificial",
      desc: "Usa maquinaria pesada para trabajar menos, producir más y automatizar tu negocio.",
      topics: ["Ingeniería de Prompts", "Dobles Digitales & Avatares", "Redacción con ChatGPT"],
      icon: <Bot size={24} />,
    },
    {
      phase: "Fase 4: Vías de Acceso",
      title: "Redes Sociales & Tráfico",
      desc: "Cómo atraer clientes a tu negocio digital utilizando las diferentes plataformas.",
      topics: ["Instagram: La Gran Avenida", "TikTok, Live & Shop: La Autopista Viral"],
      icon: <Smartphone size={24} />,
    },
    {
      phase: "Fase 5: Arquitectura Web",
      title: "Desarrollo & Embudos",
      desc: "Aprende desde 0 a crear tu oficina virtual y sitios web.",
      topics: ["Tu Oficina Express (Beacons)", "Ingeniería de Landing Pages"],
      icon: <Layout size={24} />,
    },
    {
      phase: "Fase 6: Subcontratos",
      title: "Monetización Diversificada",
      desc: "Factura rápido trabajando con marcas y franquicias.",
      topics: ["Contratista UGC", "Franquicias Digitales (Amazon Influencer)"],
      icon: <DollarSign size={24} />,
    },
    {
      phase: "Fase 7: Inmobiliaria",
      title: "Tus Productos Digitales",
      desc: "Aprende a darle propósito a tu conocimiento: crea y vende tus propios productos digitales.",
      topics: ["Validación de Ideas", "Creación de Infoproductos", "Meta Ads (Publicidad)"],
      icon: <Package size={24} />,
    },
    {
      phase: "Fase 8: Administración",
      title: "Finanzas Inteligentes",
      desc: "Asegura que el edificio no colapse por falta de presupuesto.",
      topics: ["Mentalidad de Dueña", "Profit First & Tablas de Costos"],
      icon: <PieChart size={24} />
    }
  ];

  // --- DATOS DEL EQUIPO ---
  const TEAM = [
    {
      name: "Darlis Franco",
      role: "Productos Digitales & Contenido",
      desc: "Experta en transformar ideas en infoproductos rentables. Te enseñaré a editar en CapCut como una pro y a estructurar tu negocio digital.",
      tags: ["Infoproductos", "CapCut", "Estrategia"],
      icon: <Video size={20} />,
      image: darlisImg 
    },
    {
      name: "Alexander Pastrana",
      role: "Tecnología & Automatización",
      desc: "El cerebro técnico. Aprenderás a usar IA, diseñar en Canva, crear webs y automatizar tus ventas con N8n para ganar tiempo.",
      tags: ["N8n", "IA", "Desarrollo Web"],
      icon: <Cpu size={20} />,
      image: alexImg
    }
  ];

  // --- CONFIGURACIÓN DE STRIPE ---
  // Prioridad: config del servidor (runtime) → variable de build → valor fijo.
  const PLAN_IDS = {
    MONTHLY: priceConfig.monthly || "price_1SnZK0DP5qCZDXVtTwJzTKDX",
    // Pago único $297 (acceso de por vida + activación como Partner).
    LIFETIME: priceConfig.lifetime || import.meta.env.VITE_STRIPE_PRICE_LIFETIME || ""
  };

  const handleSubscribe = async (priceId) => {
    if (!priceId) {
      toast.error("Este plan aún no está disponible. Escríbenos por WhatsApp.");
      return;
    }
    setLoading(true);
    try {
      const payload = { priceId };
      if (user) payload.email = user.email;
      // Atribución de afiliada (si llegó por un link /r/<codigo> o ?ref=)
      const ref = getReferral();
      if (ref) payload.referralCode = ref;

      const { data } = await axios.post("/payment/create-checkout-session", payload);
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con la pasarela de pago");
      setLoading(false);
    }
  };

  // --- MANEJO DEL FORMULARIO ---
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingContact(true);

    try {
        const formData = new FormData(e.target);
        formData.append("access_key", "df696c8e-5159-4f10-9179-230fa2e8f6c9");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            toast.success("Mensaje enviado. Te responderemos pronto.");
            setContactForm({ name: "", email: "", message: "" }); 
            e.target.reset(); 
        } else {
            toast.error("No pudimos enviar tu mensaje. Intenta de nuevo.");
        }

    } catch {
        toast.error("No pudimos enviar tu mensaje. Revisa tu conexión e intenta de nuevo.");
    } finally {
        setSendingContact(false);
    }
  };

  // --- ANIMACIONES ---
  // Muelle en vez de easing por duración: el movimiento tiene peso y frena
  // solo, en lugar de llegar y detenerse en seco.
  const MUELLE = { type: "spring", stiffness: 90, damping: 18, mass: 0.9 };

  const fadeInUp = {
    hidden: { opacity: 0, y: 44 },
    visible: { opacity: 1, y: 0, transition: MUELLE }
  };

  // Nada entra todo de golpe: los hijos se escalonan.
  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } }
  };

  const hijo = {
    hidden: { opacity: 0, y: 26 },
    visible: { opacity: 1, y: 0, transition: MUELLE }
  };

  // Barra de progreso de lectura. El muelle evita que dé saltos con la rueda.
  const { scrollYProgress } = useScroll();
  const progresoLectura = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  // Paralaje suave de la foto del hero: se mueve menos que la página, lo que
  // da sensación de profundidad sin marear.
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 70]);

  // La barra superior se vuelve de cristal al separarse del borde.
  const [scrolleado, setScrolleado] = useState(false);
  useEffect(() => {
    const alScroll = () => setScrolleado(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <>
      <Seo {...seoConfigs.home} />
      <FloatingCTA />
    <div className="min-h-screen bg-[#F7F2EF] font-sans overflow-x-hidden">
      
      {/* Progreso de lectura: una línea finísima arriba que dice cuánto queda.
          Da sensación de recorrido en una página larga. */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-gradient-to-r from-vino via-[#b8707f] to-marino"
        style={{ scaleX: progresoLectura }}
      />

      {/* --- NAVBAR --- */}
      {/* Fija y de cristal al separarse del borde: antes se iba con el scroll y
          la alumna perdía el acceso al CTA a mitad de página. */}
      <nav
        className={`sticky top-0 z-40 transition-all duration-500 ${
          scrolleado
            ? "bg-ivory/80 backdrop-blur-xl border-b border-marino/[0.07] shadow-suave"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className={`flex justify-between items-center px-6 md:px-12 w-full max-w-[1400px] mx-auto transition-all duration-500 ${scrolleado ? "py-3.5" : "py-6"}`}>
          <Link to="/" className="font-display text-2xl md:text-[1.7rem] font-bold text-marino tracking-tight">
            MomsDigitales<span className="text-vino">.</span>
          </Link>

          <div className="flex items-center gap-6 md:gap-8">
            <Link
              to="/agencia"
              className="hidden md:inline-block relative font-medium text-marino/80 hover:text-vino transition-colors duration-300 group"
            >
              Agencia BluePrint
              {/* Subrayado que se dibuja de izquierda a derecha */}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-vino transition-all duration-300 group-hover:w-full" />
            </Link>

            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-2.5 rounded-full bg-marino text-white font-semibold text-sm shadow-suave hover:bg-vino hover:shadow-vino active:scale-[0.97] transition-all duration-300"
              >
                Ir al Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-full border border-marino/25 text-marino font-semibold text-sm hover:bg-marino hover:text-white hover:border-marino active:scale-[0.97] transition-all duration-300"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO · PLANO DE OBRA --- */}
      {/* La marca se llama Arquitecta y el temario son fases de obra. El hero
          deja de ser "texto a la izquierda, foto a la derecha" y pasa a leerse
          como la primera lámina de un proyecto. */}
      <header className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden textura-grano">

        {/* Papel milimetrado, difuminado hacia los bordes */}
        <div aria-hidden="true" className="absolute inset-0 reticula-plano reticula-difuminada pointer-events-none" />

        {/* Orbes de color por detrás de la retícula */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none -z-10">
          <div className="absolute -top-48 -right-40 w-[720px] h-[720px] rounded-full bg-rosa opacity-70 blur-[130px] animate-blob" />
          <div className="absolute top-1/4 -left-48 w-[560px] h-[560px] rounded-full bg-vino opacity-[0.12] blur-[130px] animate-blob animation-delay-2000" />
        </div>

        {/* Trazos que se dibujan solos, como si alguien pasara el lápiz */}
        <svg aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <line x1="7%" y1="0" x2="7%" y2="100%" stroke="#1B3854" strokeWidth="1" strokeOpacity="0.14"
                className="trazo-dibujado" style={{ "--largo": 1400 }} />
          <line x1="0" y1="86%" x2="100%" y2="86%" stroke="#1B3854" strokeWidth="1" strokeOpacity="0.14"
                className="trazo-dibujado" style={{ "--largo": 2000, animationDelay: "0.35s" }} />
          <circle cx="7%" cy="86%" r="4" fill="none" stroke="#905361" strokeWidth="1.5" strokeOpacity="0.5"
                  className="trazo-dibujado" style={{ "--largo": 30, animationDelay: "1.6s" }} />
        </svg>

        <div className="relative w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-6 pb-10">

          {/* Cartela del plano */}
          <div className="flex items-center gap-4 mb-5 md:mb-8 text-marino/45">
            <span className="cota">Proyecto 01</span>
            <span className="linea-cota flex-1 max-w-[120px] h-px bg-marino/20" />
            <span className="cota">Membresía anual</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-6 items-center">

            {/* ── Titular: ocupa 7 de 12 columnas y se sale del margen ── */}
            <div className="lg:col-span-7 lg:-mr-16 relative z-20">
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-vino/15 text-vino-oscuro font-semibold text-[13px] shadow-suave mb-6"
                style={{ animation: "aparecerArriba .8s cubic-bezier(.16,1,.3,1) both", animationDelay: "1.1s" }}
              >
                <Sparkles size={15} className="text-vino" /> Tu independencia financiera empieza hoy
              </span>

              {/* Cada línea sube desde debajo de su propio renglón, escalonada.
                  Es lo que hace que el titular entre en vez de solo aparecer. */}
              <h1 className="font-display font-bold text-marino leading-[0.92] tracking-[-0.035em]"
                  style={{ fontSize: "clamp(2.6rem, min(7.8vw, 11.5vh), 6.4rem)" }}>
                <span className="mascara-linea"><span style={{ animationDelay: "0.15s" }}>Conviértete</span></span>
                <span className="mascara-linea"><span style={{ animationDelay: "0.28s" }}>en la{" "}
                  <em className="text-vino not-italic relative">
                    arquitecta
                    {/* Subrayado trazado a mano, se dibuja después del texto */}
                    <svg aria-hidden="true" className="absolute left-0 -bottom-1 w-full" height="16" viewBox="0 0 300 16" preserveAspectRatio="none">
                      <path d="M2 11 C 70 3, 150 14, 298 5" fill="none" stroke="#E9C9C5" strokeWidth="7" strokeLinecap="round"
                            className="trazo-dibujado" style={{ "--largo": 320, animationDelay: "0.95s" }} />
                    </svg>
                  </em>
                </span></span>
                <span className="mascara-linea"><span style={{ animationDelay: "0.41s" }}>de tu propio éxito.</span></span>
              </h1>

              <p className="mt-6 text-[17px] text-marino/65 max-w-[29rem] leading-relaxed"
                 style={{ animation: "aparecerArriba .8s cubic-bezier(.16,1,.3,1) both", animationDelay: "1.25s" }}>
                Aprende en vivo y en comunidad las distintas formas de monetización digital,
                y encuentra el camino que encaja con tu realidad y la vida que quieres construir.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-4"
                   style={{ animation: "aparecerArriba .8s cubic-bezier(.16,1,.3,1) both", animationDelay: "1.4s" }}>
                <a href="#planes"
                   className="brillo-hover group px-9 py-4 bg-vino text-white rounded-full font-semibold text-lg shadow-vino hover:bg-vino-oscuro hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 inline-flex items-center justify-center gap-2">
                  Quiero unirme hoy
                  <Rocket size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                </a>
                {!user && (
                  <Link to="/login"
                        className="px-9 py-4 bg-white/75 backdrop-blur-sm text-marino border border-marino/12 rounded-full font-semibold shadow-suave hover:shadow-media hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300 text-center">
                    Ya tengo una cuenta
                  </Link>
                )}
              </div>
            </div>

            {/* ── Foto: encuadrada como una lámina, con marcas de esquina ── */}
            <motion.div
              className="lg:col-span-5 relative"
              style={{ y: heroY }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...MUELLE, delay: 0.55 }}
            >
              <div className="relative max-w-[26rem] mx-auto lg:mx-0 lg:ml-auto">
                {/* Marcas de encuadre, como las de una lámina de dibujo */}
                <span aria-hidden="true" className="absolute -top-3 -left-3 w-7 h-7 border-t-2 border-l-2 border-vino/45 rounded-tl-sm" />
                <span aria-hidden="true" className="absolute -bottom-3 -right-3 w-7 h-7 border-b-2 border-r-2 border-vino/45 rounded-br-sm" />

                <div className="relative rounded-[1.6rem] overflow-hidden shadow-alta ring-1 ring-white/70 border-[6px] border-white aspect-[4/5]">
                  <img src={equipoHeroImg}
                       alt="Darlis Franco con la comunidad de alumnas de Arquitecta de tu Propio Éxito"
                       className="w-full h-full object-cover" />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-marino/40 to-transparent" />
                </div>

                {/* Cota lateral: la medida que acota la lámina */}
                <div aria-hidden="true" className="hidden lg:flex absolute -left-12 top-0 bottom-0 flex-col items-center justify-center gap-2 text-marino/35">
                  <span className="w-px flex-1 bg-marino/15" />
                  <span className="cota rotate-180" style={{ writingMode: "vertical-rl" }}>En vivo cada semana</span>
                  <span className="w-px flex-1 bg-marino/15" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MUELLE, delay: 1.5 }}
                  className="absolute -bottom-7 -left-6 lg:-left-16 z-20 flex items-center gap-3 bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-3.5 shadow-alta ring-1 ring-marino/5 whitespace-nowrap animate-flotar"
                >
                  <span className="w-10 h-10 rounded-xl bg-rosa flex items-center justify-center text-vino shrink-0">
                    <HeartHandshake size={20} />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-marino text-sm leading-tight">Comunidad en vivo</p>
                    <p className="text-xs text-marino/55">Mentorías cada mes con Darlis</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* ── Pie de lámina: las cifras como línea de cota ── */}
          <div
            className="mt-10 lg:mt-14 pt-6 border-t border-marino/10 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5"
            style={{ animation: "aparecerArriba .9s cubic-bezier(.16,1,.3,1) both", animationDelay: "1.6s" }}
          >
            {[
              { k: "01", v: "8 fases", d: "De los cimientos al negocio" },
              { k: "02", v: "En vivo", d: "Mentorías cada mes" },
              { k: "03", v: "Comunidad", d: "Privada y activa" },
              { k: "04", v: "A tu ritmo", d: "Biblioteca siempre abierta" }
            ].map((c) => (
              <div key={c.k} className="flex gap-3">
                <span className="cota text-vino/55 pt-1.5">{c.k}</span>
                <div>
                  <p className="font-display text-xl text-marino font-bold leading-tight">{c.v}</p>
                  <p className="text-[13px] text-marino/55 leading-snug mt-0.5">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* MARQUEE de stats / mensajes que se desliza */}
      <MarqueeStats items={[
        { icon: "👩‍💻", text: "Comunidad activa de mamás emprendedoras" },
        { icon: "🎓", text: "Cursos en vivo y biblioteca a tu ritmo" },
        { icon: "💛", text: "Sin abandonar a tu familia" },
        { icon: "📈", text: "Resultados reales y verificables" },
        { icon: "🚀", text: "Mentorías mensuales con Darlis" },
        { icon: "✨", text: "Comunidad privada de Arquitectas" }
      ]} />

      {/* Stats con counters animados */}
      <section className="py-20 bg-ivory textura-grano relative" style={{ backgroundImage: "radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, #FBF7F4 45%, #F7F2EF 100%)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1B3854]">Lo que hemos construido juntas</h2>
              <p className="text-gray-500 mt-2">Números reales, comunidad real.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 500, suffix: "+", label: "Mamás formadas", color: "#905361" },
              { value: 12,  suffix: "",  label: "Cursos disponibles", color: "#1B3854" },
              { value: 95,  suffix: "%", label: "Recomendarían", color: "#905361" },
              { value: 24,  suffix: "/7", label: "Comunidad activa", color: "#1B3854" }
            ].map((s, i) => (
              <ScrollReveal key={i} delay={i * 0.1} direction="scale">
                <div className="group bg-white/80 backdrop-blur-sm rounded-[1.4rem] p-7 text-center hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500">
                  <p className="font-display tabular text-5xl md:text-[3.4rem] font-bold mb-1.5 leading-none" style={{ color: s.color }}>
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="text-[13px] text-marino/60 font-medium tracking-wide">{s.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 1: ¿QUÉ ES ESTA MEMBRESÍA? --- */}
      <section className="py-24 bg-white textura-grano relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="lg:w-1/2 relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FDE5E5] rounded-full opacity-50 blur-2xl"></div>
              <div className="bg-[#1B3854] p-10 md:p-12 rounded-[3rem] text-white shadow-2xl relative z-10">
                <Users className="text-[#FDE5E5] mb-6" size={48} />
                <h3 className="text-2xl font-bold mb-4 leading-relaxed">
                  "Aquí no creemos que todas deban empezar igual."
                </h3>
                <p className="text-blue-100 font-light">
                  Te ayudamos a descubrir qué forma de monetización se adapta mejor a ti, a tus recursos, a tu personalidad, a tu tiempo y a las metas que quieres alcanzar.
                </p>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-6">
              <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-2">Descubre el Método</h4>
              <h2 className="text-4xl lg:text-5xl font-black text-[#1B3854] mb-6 leading-tight">
                ¿Qué es Arquitecta de tu Propio Éxito?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Arquitecta de tu Propio Éxito no es solo una membresía de contenido. Es un <strong>espacio de acompañamiento</strong> donde aprenderás a construir tu propio camino en el negocio digital.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Aprenderás con clases en vivo, guía práctica, comunidad y una mentalidad alineada para dejar de sentirte confundida y comenzar a <strong>avanzar con intención</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN 2: ¿PARA QUIÉN ES? --- */}
      <section className="py-24 bg-marino textura-grano relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-ivory before:to-transparent before:opacity-20 before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-24 after:bg-gradient-to-t after:from-ivory after:to-transparent after:opacity-20 after:pointer-events-none">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <Target className="text-[#FDE5E5] mx-auto mb-6" size={48} />
            <h2 className="text-4xl lg:text-5xl font-black text-white">Esta membresía es para ti si...</h2>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          >
            {[
              "Quieres generar ingresos digitales pero no sabes cuál camino tomar.",
              "Te sientes saturada de tanta información y necesitas dirección real.",
              "Quieres aprender en comunidad y no sola.",
              "Deseas monetizar desde casa sin desconectarte de lo que más amas.",
              "Necesitas fortalecer tu mentalidad mientras construyes algo propio.",
              "Quieres una mentora que te ayude a encontrar tu punto de partida."
            ].map((text, index) => (
              <motion.div 
                key={index} variants={fadeInUp}
                className="flex items-start gap-4 p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 hover:bg-white/20 transition-colors"
              >
                <CheckCircle2 className="text-[#FDE5E5] shrink-0 mt-1" size={28} />
                <p className="text-white text-lg font-light leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN 3: QUÉ INCLUYE LA MEMBRESÍA --- */}
      <section className="py-24 bg-ivory textura-grano relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3 block">Todo lo que necesitas</span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1B3854]">¿Qué incluye la membresía?</h2>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
          >
            {/* 1. Mentorías en vivo */}
            <motion.div variants={fadeInUp} className="group bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500">
              <div className="w-14 h-14 bg-[#FDE5E5] text-[#905361] rounded-2xl flex items-center justify-center mb-6">
                <Video size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Mentorías en vivo semanal</h3>
              <p className="text-gray-600 leading-relaxed">Acompañamiento directo para resolver tus dudas, ajustar tus estrategias y trazar tu plan de acción en tiempo real.</p>
            </motion.div>

            {/* 2. Módulos pre grabados */}
            <motion.div variants={fadeInUp} className="group bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500">
              <div className="w-14 h-14 bg-[#1B3854] text-white rounded-2xl flex items-center justify-center mb-6">
                <PlayCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Módulos pre grabados</h3>
              <p className="text-gray-600 leading-relaxed">Aprende a tu propio ritmo con lecciones paso a paso sobre distintas formas de monetización y habilidades digitales.</p>
            </motion.div>

            {/* 3. Contenido nuevo */}
            <motion.div variants={fadeInUp} className="group bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500">
              <div className="w-14 h-14 bg-rosa text-vino rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <CalendarPlus size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Contenido nuevo cada mes</h3>
              <p className="text-gray-600 leading-relaxed">Actualizaciones constantes para que siempre estés al día con las mejores y más actuales estrategias del mercado.</p>
            </motion.div>

            {/* 4. Comunidad */}
            <motion.div variants={fadeInUp} className="group bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500 lg:col-span-1 md:col-start-1 lg:col-start-auto">
              <div className="w-14 h-14 bg-arena text-marino rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <HeartHandshake size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Comunidad privada de Arquitectas</h3>
              <p className="text-gray-600 leading-relaxed">Rodéate de mujeres con tu misma visión. Apoyo, motivación y networking disponible 24/7 en nuestro grupo privado.</p>
            </motion.div>

            {/* 5. Recursos listos */}
            <motion.div variants={fadeInUp} className="group bg-white/70 backdrop-blur-sm p-8 rounded-[2rem] hover:bg-white hover:shadow-media hover:-translate-y-1 transition-all duration-500 lg:col-span-1 md:col-start-2 lg:col-start-auto">
              <div className="w-14 h-14 bg-[#905361] text-white rounded-2xl flex items-center justify-center mb-6">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Recursos para monetizar</h3>
              <p className="text-gray-600 leading-relaxed">Plantillas, guías y herramientas prácticas diseñadas para que comiences a generar ingresos desde el día 1.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN: CURRICULUM / QUE APRENDERÁS --- */}
      <section className="py-32 bg-white textura-grano relative">
        <div className="max-w-[1400px] mx-auto px-6">
            <div className="text-center mb-16 max-w-3xl mx-auto">
                <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3">Programa Académico</h4>
                <h2 className="text-4xl font-bold text-[#1B3854] mb-4">El Mapa de Construcción</h2>
                <p className="text-gray-600 text-lg">
                    Un viaje paso a paso desde los cimientos hasta el rascacielos. 8 Fases diseñadas para construir un negocio digital.
                </p>
            </div>

            <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer}
            >
                {CURRICULUM.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={hijo}
                        className="group relative bg-white/70 backdrop-blur-sm rounded-[1.4rem] p-6 pl-7 flex gap-5 transition-all duration-500 hover:bg-white hover:shadow-media hover:-translate-y-1"
                    >
                        {/* Barra de acento que crece al pasar el cursor: sustituye
                            al borde permanente de antes. */}
                        <span
                            aria-hidden="true"
                            className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-vino/15 transition-all duration-500 group-hover:bg-vino group-hover:top-3 group-hover:bottom-3"
                        />

                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-rosa text-vino transition-all duration-500 group-hover:bg-vino group-hover:text-white group-hover:rotate-[-6deg]">
                                {item.icon}
                            </div>
                            {/* El número de fase hace de ancla: da orden sin
                                necesitar un color distinto por tarjeta. */}
                            <span className="tabular absolute -top-2 -right-2 w-6 h-6 rounded-full bg-marino text-white text-[11px] font-bold flex items-center justify-center shadow-suave">
                                {index + 1}
                            </span>
                        </div>

                        <div className="min-w-0">
                            <span className="text-[11px] font-semibold text-vino/70 uppercase tracking-[0.12em]">{item.phase}</span>
                            <h3 className="text-xl font-bold text-marino mt-0.5 mb-2">{item.title}</h3>
                            <p className="text-sm text-marino/60 mb-3 leading-relaxed">{item.desc}</p>
                            <ul className="space-y-1.5">
                                {item.topics.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-marino/85 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-vino mt-[0.45rem] shrink-0" />
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-32 bg-ivory textura-grano relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3">Equipo Fundador</h4>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1B3854] mb-6">Conoce a tus Mentores</h2>
            <p className="text-gray-600 text-lg">
              No somos solo una plataforma, somos un equipo unido para darte todas las herramientas: 
              <strong> Creación, Mentalidad y Tecnología.</strong>
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 max-w-5xl mx-auto gap-10"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            {TEAM.map((member, index) => (
              <motion.div key={index} variants={fadeInUp} className="group relative">
                <div className="relative overflow-hidden rounded-3xl h-[500px] shadow-lg">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1B3854] via-transparent to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 p-8 w-full text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-[#905361] rounded-lg">
                        {member.icon}
                      </div>
                      <span className="text-sm font-medium tracking-wide bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {member.role}
                      </span>
                    </div>
                    <h3 className="text-3xl font-bold mb-3">{member.name}</h3>
                    <p className="text-gray-200 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                      {member.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.tags.map((tag, i) => (
                        <span key={i} className="text-xs font-semibold bg-white text-[#1B3854] px-2 py-1 rounded-md">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- CARACTERÍSTICAS --- */}
      <section className="py-24 bg-marino text-white textura-grano relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-gradient-to-b before:from-ivory before:to-transparent before:opacity-20 before:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-24 after:bg-gradient-to-t after:from-ivory after:to-transparent after:opacity-20 after:pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-between mb-16 gap-10">
            <motion.h2 initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="text-3xl lg:text-4xl font-bold max-w-xl">
              Todo lo que necesitas en un solo lugar, sin complicaciones técnicas.
            </motion.h2>
            <div className="flex gap-4">
               <div className="text-center px-6 py-4 bg-[#2a4d6e] rounded-2xl">
                 <h3 className="text-3xl font-bold text-[#FDE5E5]">+5k</h3>
                 <p className="text-sm text-gray-300">Alumnas</p>
               </div>
               <div className="text-center px-6 py-4 bg-[#2a4d6e] rounded-2xl">
                 <h3 className="text-3xl font-bold text-[#FDE5E5]">+120</h3>
                 <p className="text-sm text-gray-300">Lecciones</p>
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Libertad de Horarios", desc: "Aprende de madrugada o durante la siesta. Tú pones el ritmo.", icon: "⏰" },
              { title: "Soporte 24/7", desc: "Nunca estarás sola. Nuestra comunidad siempre está activa para resolver dudas.", icon: "🤝" },
              { title: "Monetización Real", desc: "Estrategias probadas para facturar. Desde crear el producto hasta automatizar la venta.", icon: "💸" },
            ].map((item, index) => (
              <motion.div key={index} className="bg-[#214363] p-10 rounded-3xl hover:bg-[#905361] transition-colors duration-300 cursor-pointer group border border-[#2a4d6e]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} viewport={{ once: true }}>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 group-hover:text-white text-lg leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRECIOS --- */}
      <section id="planes" className="py-32 bg-ivory textura-grano relative">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-[3.2rem] font-bold text-marino mb-4 leading-[1.08]">Invierte en tu futuro</h2>
                <p className="text-marino/60 text-lg">Elige el plan que mejor se adapte a tu ritmo.</p>
            </div>

            <div className="max-w-md mx-auto">
                {/* PLAN MENSUAL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-10 bg-white rounded-[2rem] shadow-media hover:shadow-alta hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
                >
                    <span className="inline-block self-start px-3 py-1 rounded-full bg-[#FDE5E5] text-[#905361] text-[11px] font-bold uppercase tracking-widest mb-3">
                        Suscripción
                    </span>
                    <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Mensual</h3>
                    <div className="mb-7 flex items-baseline gap-1"><span className="font-display tabular text-[3.4rem] font-bold text-marino leading-none">$50</span><span className="text-marino/45 text-sm font-medium">/mes</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {[
                            "Acceso completo a todos los cursos",
                            "Comunidad privada de alumnas",
                            "Clases en vivo y recursos descargables",
                            "Cancela cuando quieras"
                        ].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={17} className="text-vino shrink-0 mt-0.5"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.MONTHLY)} disabled={loading} className="brillo-hover w-full py-4 rounded-2xl font-semibold bg-rosa text-vino hover:bg-vino hover:text-white hover:shadow-vino active:scale-[0.98] transition-all duration-300 text-lg disabled:opacity-60">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Mensual"}
                    </button>
                </motion.div>
            </div>

            {/* Separador entre las dos opciones */}
            <div className="flex items-center gap-4 max-w-md mx-auto my-10">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">o</span>
                <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* --- PLAN DE PAGO ÚNICO: ACCESO DE POR VIDA + PARTNER --- */}
            <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-12 relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1B3854] via-[#24507a] to-[#905361] p-1 shadow-2xl"
            >
                <div className="relative rounded-[1.9rem] bg-[#1B3854] px-8 py-10 md:px-14 md:py-12 text-white overflow-hidden">
                    {/* Halos decorativos */}
                    <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#905361] opacity-30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-[#FDE5E5] opacity-10 rounded-full blur-3xl" />

                    <div className="relative flex flex-col lg:flex-row items-center gap-10">
                        {/* Copy */}
                        <div className="flex-1 text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F0D98C] font-bold text-xs tracking-widest uppercase mb-4">
                                👑 Pago único · Sin mensualidades
                            </span>
                            <h3 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
                                Acceso de por vida <span className="text-[#FDE5E5]">+ conviértete en Partner</span>
                            </h3>
                            <p className="text-white/80 text-base md:text-lg mb-6 max-w-xl mx-auto lg:mx-0">
                                Pagas una sola vez y el acceso es tuyo para siempre. Además quedas activada
                                como afiliada desde el día uno, con tu propio link para empezar a generar ingresos.
                            </p>

                            <ul className="space-y-3 mb-8 text-left max-w-md mx-auto lg:mx-0">
                                {[
                                    "Acceso permanente a todos los cursos, presentes y futuros",
                                    "Activación inmediata como Partner (afiliada)",
                                    "Tu link de afiliada personal desde el primer día",
                                    "Ganas $237.60 USD por cada persona que traigas con este plan",
                                    "Comunidad privada y mentorías incluidas de por vida"
                                ].map((f, i) => (
                                    <li key={i} className="flex gap-3 text-sm md:text-base text-white/90">
                                        <Check size={20} className="text-[#F0D98C] shrink-0 mt-0.5" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Precio + CTA */}
                        <div className="w-full lg:w-auto lg:min-w-[300px] bg-white/10 backdrop-blur border border-white/20 rounded-3xl p-8 text-center">
                            <p className="text-xs uppercase tracking-widest text-white/60 font-bold mb-2">Inversión única</p>
                            <div className="mb-1">
                                <span className="font-display tabular text-[4rem] font-bold leading-none">$297</span>
                                <span className="text-white/60 text-lg"> USD</span>
                            </div>
                            <p className="text-sm text-white/70 mb-6">Una sola vez. Nunca más.</p>

                            <button
                                onClick={() => handleSubscribe(PLAN_IDS.LIFETIME)}
                                disabled={loading}
                                className="brillo-hover w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#E3C25A] to-[#C9A227] text-marino hover:from-[#EBCE6E] hover:to-[#D6B13A] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-alta transition-all duration-300 text-lg disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Quiero mi acceso de por vida"}
                            </button>

                            <div className="mt-5 pt-5 border-t border-white/15">
                                <p className="text-xs text-white/70 leading-relaxed">
                                    Con <span className="font-bold text-[#F0D98C]">2 personas</span> que refieras
                                    con este plan, ya recuperaste tu inversión.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
      </section>

      {/* --- AFILIADAS --- */}
      <section id="afiliadas" className="py-32 bg-white textura-grano relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[#905361] font-bold tracking-widest uppercase text-sm">Plan de Afiliadas</span>
            <h2 className="text-4xl font-bold text-[#1B3854] mt-2 mb-4">Recomienda y gana ingresos recurrentes</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Cada alumna que recomiendes y se inscriba a la membresía te genera comisión cada vez que pague — mes tras mes, mientras siga activa.
            </p>
          </div>

          {/* Tarifas de comisión */}
          <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
            {[
              { plan: "Mensual", price: "$50", pct: "40%", win: "$20 cada mes" },
              { plan: "Pago único", price: "$297", pct: "80%", win: "$237.60 por venta" }
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-8 bg-[#F7F2EF] rounded-3xl border border-gray-100 text-center"
              >
                <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">{c.plan}</p>
                <p className="text-3xl font-bold text-[#1B3854] mt-2">{c.price}</p>
                <p className="text-[#905361] text-sm mt-1">→ comisión {c.pct}</p>
                <p className="mt-4 text-2xl font-bold text-[#1B3854]">{c.win}</p>
              </motion.div>
            ))}
          </div>

          {/* Frase destacada */}
          <div className="bg-[#1B3854] text-white rounded-[2rem] p-10 md:p-14 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#905361] rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
            <div className="relative z-10">
              <Sparkles className="text-[#FDE5E5] mb-4" size={32} />
              <h3 className="text-2xl md:text-3xl font-bold mb-3">Lo que hace especial esta comisión</h3>
              <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
                Tú refieres una vez y sigues ganando. Mientras la alumna que invitaste mantenga su membresía activa,
                cada cobro que ella haga genera ingresos recurrentes para ti. No es un pago único — es un flujo.
              </p>
            </div>
          </div>

          {/* 4 niveles */}
          <h3 className="text-2xl font-bold text-[#1B3854] text-center mb-2">Niveles de Partner</h3>
          <p className="text-gray-500 text-center mb-10">Avanza dentro de la academia y desbloquea más beneficios.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { name: "Alumna", color: "#94a3b8", blurb: "En formación, aún sin vender." },
              { name: "Partner activada", color: "#905361", blurb: "Recibe link, kit y comisión." },
              { name: "Seller autorizada", color: "#1B3854", blurb: "Capacitación comercial + CRM." },
              { name: "Closer interna", color: "#D4AF37", blurb: "High-ticket. Solo por invitación." }
            ].map((lv, i) => (
              <div key={i} className="p-6 bg-[#F7F2EF] rounded-2xl border border-gray-100">
                <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-3" style={{ backgroundColor: lv.color }}>
                  Nivel {i + 1}
                </span>
                <p className="font-bold text-[#1B3854] mb-1">{lv.name}</p>
                <p className="text-xs text-gray-500">{lv.blurb}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            {user ? (
              <Link
                to="/afiliada/aplicar"
                className="inline-block bg-[#905361] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#5E2B35] shadow-lg transition-all"
              >
                Solicitar pasar a Partner
              </Link>
            ) : (
              <a
                href="#planes"
                className="inline-block bg-[#905361] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#5E2B35] shadow-lg transition-all"
              >
                Suscríbete primero para ser Partner
              </a>
            )}
            <p className="text-xs text-gray-400 mt-3">Necesitas tener tu suscripción al día para aplicar.</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONTACTO --- */}
      <section id="contacto" className="py-24 bg-white textura-grano relative">
        <div className="max-w-[1200px] mx-auto px-6">
            <motion.div 
                className="bg-[#1B3854] rounded-[3rem] p-10 md:p-16 overflow-hidden relative shadow-2xl"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#905361] rounded-full mix-blend-screen filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="flex flex-col lg:flex-row gap-12 relative z-10">
                    
                    {/* Columna Izquierda: Información */}
                    <div className="lg:w-1/2 text-white space-y-8">
                        <div>
                            <span className="text-[#FDE5E5] font-bold tracking-widest uppercase text-sm">Hablemos</span>
                            <h2 className="text-4xl font-bold mt-2 mb-4">¿Tienes dudas antes de empezar?</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Estamos aquí para resolver cualquier pregunta sobre los cursos, los planes o la comunidad. No seas tímida.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Mail className="text-[#FDE5E5]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Escríbenos directamente</h4>
                                    <p className="text-gray-300">soporte@arquitectadetupropioexito.com</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <Instagram className="text-[#FDE5E5]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">Síguenos</h4>
                                    <p className="text-gray-300">@momsdigitales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario */}
                    <div className="lg:w-1/2">
                        <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-5">
                            <input type="checkbox" name="botcheck" className="hidden" style={{display: 'none'}} />

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Tu Nombre</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] outline-none transition"
                                    placeholder="María Pérez"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={contactForm.email}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] outline-none transition"
                                    placeholder="hola@correo.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mensaje</label>
                                <textarea 
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] outline-none transition resize-none"
                                    placeholder="¿Cómo funcionan las mentorías?..."
                                    required
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={sendingContact}
                                className="w-full py-4 bg-[#905361] text-white font-bold rounded-xl hover:bg-[#5E2B35] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                            >
                                {sendingContact ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>Enviar Mensaje <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B3854] text-gray-400 py-12 text-center border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-6">MomsDigitales<span className="text-[#905361]">.</span></h2>
            <div className="flex justify-center gap-8 mb-8 text-sm font-medium">
                <a href="#" className="hover:text-white transition">Términos</a>
                <a href="#" className="hover:text-white transition">Privacidad</a>
                <a href="#" className="hover:text-white transition">Soporte</a>
            </div>
            <p>&copy; 2026 MomsDigitales. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
    </>
  );
};

export default HomePage;