import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA EL FORMULARIO DE CONTACTO ---
  const [sendingContact, setSendingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // --- DATOS DEL PROGRAMA ---
  const CURRICULUM = [
    {
      phase: "Fase 1: Los Cimientos",
      title: "Mentalidad y Organización",
      desc: "Prepara el terreno y demuele viejas estructuras de empleada.",
      topics: ["Ingeniería Mental y Reprogramación", "La Oficina de Proyectos (Notion & Time Blocking)"],
      icon: <Hammer size={24} />,
      color: "bg-blue-100 text-blue-700"
    },
    {
      phase: "Fase 2: Diseño de Interiores",
      title: "Creatividad y Fachada",
      desc: "Diseña una identidad visual en redes sociales y crea contenido que conecte.",
      topics: ["Estudio de Diseño (Canva Expert)", "Producción Visual (CapCut Pro)"],
      icon: <Palette size={24} />,
      color: "bg-pink-100 text-pink-700"
    },
    {
      phase: "Fase 3: Tecnología",
      title: "Inteligencia Artificial",
      desc: "Usa maquinaria pesada para trabajar menos, producir más y automatizar tu negocio.",
      topics: ["Ingeniería de Prompts", "Dobles Digitales & Avatares", "Redacción con ChatGPT"],
      icon: <Bot size={24} />,
      color: "bg-purple-100 text-purple-700"
    },
    {
      phase: "Fase 4: Vías de Acceso",
      title: "Redes Sociales & Tráfico",
      desc: "Cómo atraer clientes a tu negocio digital utilizando las diferentes plataformas.",
      topics: ["Instagram: La Gran Avenida", "TikTok, Live & Shop: La Autopista Viral"],
      icon: <Smartphone size={24} />,
      color: "bg-orange-100 text-orange-700"
    },
    {
      phase: "Fase 5: Arquitectura Web",
      title: "Desarrollo & Embudos",
      desc: "Aprende desde 0 a crear tu oficina virtual y sitios web.",
      topics: ["Tu Oficina Express (Beacons)", "Ingeniería de Landing Pages"],
      icon: <Layout size={24} />,
      color: "bg-teal-100 text-teal-700"
    },
    {
      phase: "Fase 6: Subcontratos",
      title: "Monetización Diversificada",
      desc: "Factura rápido trabajando con marcas y franquicias.",
      topics: ["Contratista UGC", "Franquicias Digitales (Amazon Influencer)"],
      icon: <DollarSign size={24} />,
      color: "bg-green-100 text-green-700"
    },
    {
      phase: "Fase 7: Inmobiliaria",
      title: "Tus Productos Digitales",
      desc: "Aprende a darle propósito a tu conocimiento: crea y vende tus propios productos digitales.",
      topics: ["Validación de Ideas", "Creación de Infoproductos", "Meta Ads (Publicidad)"],
      icon: <Package size={24} />,
      color: "bg-indigo-100 text-indigo-700"
    },
    {
      phase: "Fase 8: Administración",
      title: "Finanzas Inteligentes",
      desc: "Asegura que el edificio no colapse por falta de presupuesto.",
      topics: ["Mentalidad de Dueña", "Profit First & Tablas de Costos"],
      icon: <PieChart size={24} />,
      color: "bg-red-100 text-red-700"
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
  const PLAN_IDS = {
    MONTHLY: "price_1SnZK0DP5qCZDXVtTwJzTKDX", 
    QUARTERLY: "price_1SnZKwDP5qCZDXVtEhJsyc46"
  };

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      const payload = user ? { priceId, email: user.email } : { priceId };
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
            toast.success("¡Mensaje enviado con éxito! Te responderemos pronto.");
            setContactForm({ name: "", email: "", message: "" }); 
            e.target.reset(); 
        } else {
            toast.error("Hubo un problema al enviar el mensaje. Intenta de nuevo.");
        }

    } catch (error) {
        toast.error("Error de conexión. Verifica tu internet.");
    } finally {
        setSendingContact(false);
    }
  };

  // --- ANIMACIONES ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <>
      <Seo {...seoConfigs.home} />
    <div className="min-h-screen bg-[#F7F2EF] font-sans overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1400px] mx-auto relative z-20">
        <div className="text-2xl font-bold text-[#1B3854]">MomsDigitales<span className="text-[#905361]">.</span></div>
        
        <div className="flex items-center gap-8">
          <Link 
            to="/agencia" 
            className="hidden md:block font-bold text-[#1B3854] hover:text-[#905361] transition duration-300"
          >
            Agencia BluePrint
          </Link>

          {user ? (
              <Link 
              to="/dashboard" 
              className="px-6 py-2 rounded-full bg-[#1B3854] text-white font-bold hover:bg-[#905361] transition duration-300"
            >
              Ir al Dashboard
            </Link>
          ) : (
              <Link 
              to="/login" 
              className="px-6 py-2 rounded-full border-2 border-[#1B3854] text-[#1B3854] font-bold hover:bg-[#1B3854] hover:text-white transition duration-300"
            >
              Iniciar Sesión
            </Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative px-6 pt-16 pb-32 lg:pt-32 lg:pb-48 w-full max-w-[1400px] mx-auto flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
        <motion.div 
          className="lg:w-1/2 space-y-8 text-center lg:text-left"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDE5E5] text-[#5E2B35] font-semibold text-sm tracking-wide mb-2">
            <Sparkles size={16} /> Tu independencia financiera empieza hoy
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1B3854] leading-[1.1]">
            Conviértete en la <span className="text-[#905361]">arquitecta</span> de tu propio éxito.
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Una membresía para mujeres que quieren aprender, en vivo y en comunidad, a descubrir distintas formas de monetización digital, desarrollar la mentalidad correcta y encontrar el camino que mejor se adapta a su realidad, sus metas y la vida que desean construir.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <a href="#planes" className="px-10 py-4 bg-[#905361] text-white rounded-full font-bold text-lg shadow-xl hover:bg-[#5E2B35] hover:scale-105 transition transform duration-300 text-center">
              Quiero unirme hoy
            </a>
            
            {!user && (
                <Link to="/login" className="px-10 py-4 bg-white text-[#1B3854] border border-gray-200 rounded-full font-bold shadow hover:shadow-md transition text-center">
                Ya tengo una cuenta
                </Link>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
        >
          <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-[#FDE5E5] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 left-10 w-[400px] h-[400px] bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          
          {/* CUADRO DE IMAGEN AJUSTADO PARA SER MÁS ALARGADO */}
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 border-4 border-white aspect-[4/5] max-w-md mx-auto">
             <img src={equipoHeroImg} alt="Comunidad MomsDigitales" className="w-full h-full object-cover"/>
          </div>
        </motion.div>
      </header>

      {/* --- SECCIÓN 1: ¿QUÉ ES ESTA MEMBRESÍA? --- */}
      <section className="py-24 bg-white relative">
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
      <section className="py-24 bg-[#1B3854] relative overflow-hidden">
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
      <section className="py-24 bg-[#F7F2EF] relative">
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
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#FDE5E5] text-[#905361] rounded-2xl flex items-center justify-center mb-6">
                <Video size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Mentorías en vivo semanal</h3>
              <p className="text-gray-600 leading-relaxed">Acompañamiento directo para resolver tus dudas, ajustar tus estrategias y trazar tu plan de acción en tiempo real.</p>
            </motion.div>

            {/* 2. Módulos pre grabados */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-[#1B3854] text-white rounded-2xl flex items-center justify-center mb-6">
                <PlayCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Módulos pre grabados</h3>
              <p className="text-gray-600 leading-relaxed">Aprende a tu propio ritmo con lecciones paso a paso sobre distintas formas de monetización y habilidades digitales.</p>
            </motion.div>

            {/* 3. Contenido nuevo */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <CalendarPlus size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Contenido nuevo cada mes</h3>
              <p className="text-gray-600 leading-relaxed">Actualizaciones constantes para que siempre estés al día con las mejores y más actuales estrategias del mercado.</p>
            </motion.div>

            {/* 4. Comunidad */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow lg:col-span-1 md:col-start-1 lg:col-start-auto">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <HeartHandshake size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Comunidad privada de Arquitectas</h3>
              <p className="text-gray-600 leading-relaxed">Rodéate de mujeres con tu misma visión. Apoyo, motivación y networking disponible 24/7 en nuestro grupo privado.</p>
            </motion.div>

            {/* 5. Recursos listos */}
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg transition-shadow lg:col-span-1 md:col-start-2 lg:col-start-auto">
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
      <section className="py-32 bg-white relative">
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
                        variants={fadeInUp}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex gap-5 group"
                    >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color} bg-opacity-20 group-hover:scale-110 transition-transform`}>
                            {item.icon}
                        </div>
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">{item.phase}</span>
                            <h3 className="text-xl font-bold text-[#1B3854] mb-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
                            <ul className="space-y-1">
                                {item.topics.map((topic, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#905361]"></div>
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
      <section className="py-32 bg-[#F7F2EF] relative">
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
      <section className="py-24 bg-[#1B3854] text-white">
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
      <section id="planes" className="py-32 bg-[#F7F2EF]">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-[#1B3854] mb-4">Invierte en tu Futuro</h2>
                <p className="text-gray-500 text-lg">Elige el plan que mejor se adapte a tu ritmo.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* PLAN MENSUAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-10 bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all flex flex-col h-full"
                >
                    <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Mensual</h3>
                    <div className="mb-6"><span className="text-5xl font-bold text-[#1B3854]">$50</span><span className="text-gray-400 text-sm">/mes</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Acceso a cursos básicos", "Comunidad de alumnas", "Recursos descargables"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500 shrink-0"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.MONTHLY)} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-[#FDE5E5] text-[#905361] hover:bg-[#905361] hover:text-white transition-all text-lg">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Mensual"}
                    </button>
                </motion.div>

                {/* PLAN TRIMESTRAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="relative p-10 bg-white rounded-[2rem] border-2 border-[#905361] shadow-2xl scale-105 z-10 flex flex-col h-full"
                >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#905361] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Más Popular</div>
                    <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Trimestral</h3>
                    <div className="mb-6"><span className="text-5xl font-bold text-[#1B3854]">$120</span><span className="text-gray-400 text-sm">/trimestre</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Todo lo del plan mensual", "Ahorras $30 USD", "Acceso a talleres especiales", "Soporte prioritario"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500 shrink-0"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.QUARTERLY)} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-[#1B3854] text-white hover:bg-[#2a4d6e] shadow-lg transition-all text-lg">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Trimestral"}
                    </button>
                </motion.div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONTACTO --- */}
      <section id="contacto" className="py-24 bg-white relative">
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