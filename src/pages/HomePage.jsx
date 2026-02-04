import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Check, Loader2, Instagram, Video, Brain, Code, Cpu, Sparkles, Mail, Send } from "lucide-react";
import darlisImg from "../assets/DarlisFoto.png"
import lizbethImg from "../assets/Lizbeth foto.png"
import alexImg from "../assets/Alex foto.png"
import equipoHeroImg from "../assets/Fotogrupal.png"

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA EL FORMULARIO DE CONTACTO ---
  const [sendingContact, setSendingContact] = useState(false);
  
  // Mantenemos el estado para poder limpiar los campos visualmente después del envío
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

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
      name: "Lizbeth Andrade",
      role: "Mentalidad & Hábitos",
      desc: "Reprograma tu mente para el éxito. Trabajaremos en tu disciplina, hábitos de alto rendimiento y crecimiento en TikTok.",
      tags: ["Mindset", "TikTok", "Hábitos"],
      icon: <Brain size={20} />,
      image: lizbethImg
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
    QUARTERLY: "price_1SnZKwDP5qCZDXVtEhJsyc46",
    YEARLY: "price_1Qxxxxxxxxxxxxxx"
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

  // --- MANEJO DEL FORMULARIO (INTEGRACIÓN WEB3FORMS) ---
  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSendingContact(true);

    try {
        // 1. Creamos el FormData con los datos del formulario actual
        const formData = new FormData(e.target);
        
        // 2. Añadimos tu Access Key de Web3Forms
        formData.append("access_key", "df696c8e-5159-4f10-9179-230fa2e8f6c9");

        // 3. Enviamos la petición
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        // 4. Manejamos la respuesta
        if (data.success) {
            toast.success("¡Mensaje enviado con éxito! Te responderemos pronto.");
            setContactForm({ name: "", email: "", message: "" }); // Limpia el estado
            e.target.reset(); // Limpia el formulario HTML
        } else {
            toast.error("Hubo un problema al enviar el mensaje. Intenta de nuevo.");
            console.error("Web3Forms Error:", data);
        }

    } catch (error) {
        console.error("Error de red:", error);
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
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1400px] mx-auto relative z-20">
        <div className="text-2xl font-bold text-[#1B3854]">MomsDigitales<span className="text-[#905361]">.</span></div>
        
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
            Domina el <span className="text-[#905361]">Negocio Digital</span> sin descuidar a tu familia.
          </h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Una plataforma integral donde combinamos <strong>Estrategia, Mentalidad y Tecnología</strong>. Creada por expertos, pensada para mamás.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <a href="#planes" className="px-10 py-4 bg-[#905361] text-white rounded-full font-bold text-lg shadow-xl hover:bg-[#5E2B35] hover:scale-105 transition transform duration-300">
              Ver Planes
            </a>
            
            {!user && (
                <Link to="/login" className="px-10 py-4 bg-white text-[#1B3854] border border-gray-200 rounded-full font-bold shadow hover:shadow-md transition">
                Ya tengo cuenta
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
          <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 border-4 border-white">
             <img src={equipoHeroImg} alt="Comunidad MomsDigitales" className="w-full h-auto object-cover"/>
          </div>
        </motion.div>
      </header>

      {/* --- TEAM SECTION --- */}
      <section className="py-32 bg-white relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3">Equipo Fundador</h4>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1B3854] mb-6">Conoce a tus Mentores</h2>
            <p className="text-gray-600 text-lg">
              No somos solo una plataforma, somos un equipo multidisciplinario unido para darte todas las herramientas: 
              <strong> Creación, Mentalidad y Tecnología.</strong>
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-10"
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
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold text-[#1B3854] mb-4">Invierte en tu Futuro</h2>
                <p className="text-gray-500 text-lg">Elige el plan que mejor se adapte a tu ritmo.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* PLAN MENSUAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all flex flex-col h-[500px]"
                >
                    <h3 className="text-xl font-bold text-[#1B3854] mb-2">Mensual</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-[#1B3854]">$50</span><span className="text-gray-400 text-sm">/mes</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Acceso a cursos básicos", "Comunidad de alumnas", "Recursos descargables"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.MONTHLY)} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-[#FDE5E5] text-[#905361] hover:bg-[#905361] hover:text-white transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Mensual"}
                    </button>
                </motion.div>

                {/* PLAN ANUAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="relative p-10 bg-white rounded-[2rem] border-2 border-[#905361] shadow-2xl scale-110 z-10 flex flex-col h-[550px]"
                >
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-[#905361] text-white px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase shadow-md">Más Popular</div>
                    <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Anual</h3>
                    <div className="mb-6"><span className="text-5xl font-bold text-[#1B3854]">$500</span><span className="text-gray-400 text-sm">/año</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Todo lo del plan mensual", "Ahorras $100 USD", "Mentoría grupal mensual", "Certificados oficiales", "Acceso prioritario a eventos"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.YEARLY)} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-[#1B3854] text-white hover:bg-[#2a4d6e] shadow-lg transition-all text-lg">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Anual"}
                    </button>
                </motion.div>

                {/* PLAN TRIMESTRAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all flex flex-col h-[500px]"
                >
                    <h3 className="text-xl font-bold text-[#1B3854] mb-2">Trimestral</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-[#1B3854]">$120</span><span className="text-gray-400 text-sm">/trimestre</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Todo lo del plan mensual", "Ahorras $30 USD", "Acceso a talleres especiales", "Soporte prioritario"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.QUARTERLY)} disabled={loading} className="w-full py-4 rounded-xl font-bold bg-[#FDE5E5] text-[#905361] hover:bg-[#905361] hover:text-white transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Trimestral"}
                    </button>
                </motion.div>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONTACTO (NUEVA) --- */}
      <section id="contacto" className="py-24 bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
            <motion.div 
                className="bg-[#1B3854] rounded-[3rem] p-10 md:p-16 overflow-hidden relative shadow-2xl"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            >
                {/* Elementos decorativos de fondo */}
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

                    {/* Columna Derecha: Formulario (AHORA FUNCIONAL CON WEB3FORMS) */}
                    <div className="lg:w-1/2">
                        <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-5">
                            {/* Input oculto para Honeypot (Anti-spam de web3forms) */}
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
            <p>&copy; 2024 MomsDigitales. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;