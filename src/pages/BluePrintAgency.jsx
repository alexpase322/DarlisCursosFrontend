import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Building2, Target, Eye, Compass, Bot, Code2, 
  Smartphone, Layers, Zap, ChevronRight, CheckCircle2,
  Mail, Instagram, Send, Loader2
} from "lucide-react";

const BluePrintAgency = () => {
  // Hace que la página cargue desde arriba al entrar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- ESTADOS PARA EL FORMULARIO DE CONTACTO ---
  const [sendingContact, setSendingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  // --- MANEJO DEL FORMULARIO (WEB3FORMS) ---
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
            toast.success("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans overflow-x-hidden selection:bg-[#905361] selection:text-white">
      
      {/* --- NAVBAR SIMPLIFICADO --- */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 w-full max-w-[1400px] mx-auto absolute top-0 left-0 right-0 z-50">
        <Link to="/" className="text-2xl font-bold text-[#1B3854]">
          BluePrint<span className="text-[#905361]">Digital</span>
        </Link>
        <Link to="/" className="text-sm font-bold text-[#1B3854] hover:text-[#905361] transition">
          Volver a MomsDigitales
        </Link>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-20 lg:pt-52 lg:pb-32 px-6 overflow-hidden flex items-center min-h-[90vh]">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#FDE5E5] rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        <div className="max-w-[1200px] mx-auto relative z-10 w-full flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#905361]/20 text-[#905361] font-bold text-sm uppercase tracking-widest mb-8 shadow-sm"
          >
            <Building2 size={16} /> Arquitectura Digital de Alto Nivel
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#1B3854] leading-[1.05] tracking-tight mb-8"
          >
            Construimos el <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B3854] to-[#905361]">Rascacielos</span><br className="hidden md:block" /> de tu Marca.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mb-12 leading-relaxed"
          >
            Diseño estético impecable, inteligencia artificial y automatización avanzada. Entregamos soluciones llave en mano para que habites la cima de tu industria.
          </motion.p>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
            <a href="#contacto" className="px-10 py-5 bg-[#1B3854] text-white rounded-full font-bold text-lg shadow-2xl hover:bg-[#905361] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              Agendar Auditoría Gratuita <ChevronRight size={20} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- MISIÓN & VISIÓN --- */}
      <section className="py-24 bg-[#1B3854] text-[#F7F2EF] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#905361] flex items-center justify-center mb-8 shadow-lg">
                <Target size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Nuestra Misión</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Ser la firma constructora que materializa la visión de marcas y emprendedores. Diseñamos, edificamos y automatizamos infraestructuras digitales de alto rendimiento y estética premium.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                A través de la <span className="text-[#FDE5E5] font-semibold">inteligencia artificial, el desarrollo web y la gestión estratégica</span>, entregamos soluciones integrales "llave en mano" para que nuestros clientes escalen sus negocios sobre cimientos tecnológicos sólidos, permitiéndoles habitar la cima de tu industria sin el desgaste operativo.
              </p>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#FDE5E5] flex items-center justify-center mb-8 shadow-lg">
                <Eye size={32} className="text-[#905361]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Nuestra Visión</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Ser la agencia de arquitectura digital de referencia internacional, reconocida por fusionar el diseño estético impecable con la inteligencia artificial y la automatización avanzada.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Visualizamos un ecosistema donde no solo construimos los <span className="text-[#FDE5E5] font-semibold">'rascacielos digitales'</span> de las marcas más innovadoras, sino que también actuamos como la firma consultora que respalda y eleva el estándar de calidad del talento emergente.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- SERVICIOS A LA CARTA --- */}
      <section className="py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3">Servicios a la Carta</h4>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1B3854] mb-6">Herramientas Individuales</h2>
            <p className="text-gray-600 text-lg">
              Ideales para clientes que ya tienen una base, necesitan delegar tareas específicas o buscan escalar áreas puntuales de su negocio.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="bg-[#F7F2EF] p-10 rounded-[2.5rem] hover:shadow-xl transition-shadow border border-white">
              <Compass size={40} className="text-[#1B3854] mb-6" />
              <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Consultoría y Respaldo</h3>
              <ul className="space-y-6">
                <li>
                  <strong className="block text-[#1B3854] mb-1">Mentorías Estratégicas 1:1</strong>
                  <span className="text-gray-600 text-sm">Diseñamos tu "plano maestro" (monetización, embudos, técnica y visibilidad).</span>
                </li>
                <li>
                  <strong className="block text-[#1B3854] mb-1">Supervisión (Back-Office)</strong>
                  <span className="text-gray-600 text-sm">Auditoría y respaldo técnico para freelancers que necesitan asegurar un trabajo impecable.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeInUp} className="bg-[#F7F2EF] p-10 rounded-[2.5rem] hover:shadow-xl transition-shadow border border-white">
              <Bot size={40} className="text-[#905361] mb-6" />
              <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Estudio Creativo & IA</h3>
              <ul className="space-y-6">
                <li>
                  <strong className="block text-[#1B3854] mb-1">Photostudio Digital IA</strong>
                  <span className="text-gray-600 text-sm">Sesiones virtuales de alta calidad ahorrando costos de producción.</span>
                </li>
                <li>
                  <strong className="block text-[#1B3854] mb-1">Avatares con IA & UGC</strong>
                  <span className="text-gray-600 text-sm">Representantes virtuales y contenido generado por usuarios para pauta.</span>
                </li>
                <li>
                  <strong className="block text-[#1B3854] mb-1">Edición Short-Form & Diseño</strong>
                  <span className="text-gray-600 text-sm">Reels/TikToks enfocados en retención y diseño de flyers de alto impacto.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="bg-[#F7F2EF] p-10 rounded-[2.5rem] hover:shadow-xl transition-shadow border border-white">
              <Code2 size={40} className="text-[#1B3854] mb-6" />
              <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Desarrollo y Autom.</h3>
              <ul className="space-y-6">
                <li>
                  <strong className="block text-[#1B3854] mb-1">Ingeniería de Landing Pages</strong>
                  <span className="text-gray-600 text-sm">Páginas de alta conversión (Constructores visuales o React/Tailwind).</span>
                </li>
                <li>
                  <strong className="block text-[#1B3854] mb-1">Flujos, DMs & n8n</strong>
                  <span className="text-gray-600 text-sm">Respuestas automáticas en IG y conexión de aplicaciones complejas.</span>
                </li>
                <li>
                  <strong className="block text-[#1B3854] mb-1">Community Management</strong>
                  <span className="text-gray-600 text-sm">Gestión integral, interacción y link in bio avanzado (Beacons).</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- PAQUETES PREMIUM (LLAVE EN MANO) --- */}
      <section className="py-32 bg-[#FDE5E5] relative">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm mb-3">Proyectos Llave en Mano</h4>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1B3854] mb-6">Paquetes Premium</h2>
            <p className="text-gray-700 text-lg">
              Soluciones integrales de alto valor (high-ticket) donde agrupamos servicios para ofrecer una transformación completa.
            </p>
          </div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl flex flex-col shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className="p-4 bg-[#F7F2EF] rounded-2xl w-fit mb-6"><Smartphone className="text-[#1B3854]"/></div>
              <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Fachada Digital</h3>
              <p className="text-sm font-semibold text-[#905361] mb-6">Redes, IA y Contenido</p>
              <p className="text-gray-600 text-sm mb-8 flex-grow">Ideal para marcas que necesitan mejorar su presencia visual, innovar y mantener constancia.</p>
              <ul className="space-y-3 mb-8">
                {["Estrategia mensual", "Identidad y Flyers", "Photostudio IA / Avatares", "Edición de Reels/TikToks", "Community Management"].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700"><CheckCircle2 size={18} className="text-green-500 flex-shrink-0"/> {item}</li>
                ))}
              </ul>
              <a href="#contacto" className="w-full block text-center py-3 rounded-xl font-bold border-2 border-[#1B3854] text-[#1B3854] hover:bg-[#1B3854] hover:text-white transition">Cotizar Proyecto</a>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl flex flex-col shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className="p-4 bg-[#F7F2EF] rounded-2xl w-fit mb-6"><Zap className="text-[#1B3854]"/></div>
              <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Sistema de Ventas</h3>
              <p className="text-sm font-semibold text-[#905361] mb-6">Embudos y Conversión</p>
              <p className="text-gray-600 text-sm mb-8 flex-grow">Para creadores o empresas que quieren lanzar un infoproducto o servicio de alto valor.</p>
              <ul className="space-y-3 mb-8">
                {["Landing Page + Copywriting", "Configuración del embudo", "Integración de dominio", "Automatización de emails", "Link in bio avanzado"].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700"><CheckCircle2 size={18} className="text-green-500 flex-shrink-0"/> {item}</li>
                ))}
              </ul>
              <a href="#contacto" className="w-full block text-center py-3 rounded-xl font-bold border-2 border-[#1B3854] text-[#1B3854] hover:bg-[#1B3854] hover:text-white transition">Cotizar Proyecto</a>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl flex flex-col shadow-sm hover:shadow-2xl transition-all duration-300">
              <div className="p-4 bg-[#F7F2EF] rounded-2xl w-fit mb-6"><Layers className="text-[#1B3854]"/></div>
              <h3 className="text-2xl font-bold text-[#1B3854] mb-2">Ecosistema Auto.</h3>
              <p className="text-sm font-semibold text-[#905361] mb-6">Desarrollo y Escalamiento</p>
              <p className="text-gray-600 text-sm mb-8 flex-grow">Negocios establecidos que delegan la tecnología pesada para optimizar tiempo.</p>
              <ul className="space-y-3 mb-8">
                {["Todo el Sistema de Ventas", "Automatización con n8n", "ManyChat (Ventas 24/7)", "Diseño de app/plataforma a medida"].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700"><CheckCircle2 size={18} className="text-green-500 flex-shrink-0"/> {item}</li>
                ))}
              </ul>
              <a href="#contacto" className="w-full block text-center py-3 rounded-xl font-bold border-2 border-[#1B3854] text-[#1B3854] hover:bg-[#1B3854] hover:text-white transition">Cotizar Proyecto</a>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[#1B3854] p-8 rounded-3xl flex flex-col shadow-2xl relative transform lg:-translate-y-4 border border-[#905361]/30">
              <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-[#905361] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">VIP 360º</div>
              <div className="p-4 bg-white/10 rounded-2xl w-fit mb-6"><Building2 className="text-[#FDE5E5]"/></div>
              <h3 className="text-2xl font-bold text-white mb-2">El Rascacielos</h3>
              <p className="text-sm font-semibold text-[#FDE5E5] mb-6">Agencia Aliada Integral</p>
              <p className="text-gray-300 text-sm mb-8 flex-grow">Emprendedores que quieren delegar absolutamente todo el brazo digital de su empresa.</p>
              <ul className="space-y-3 mb-8">
                {["Fachada Digital Completa", "Ecosistema Automatizado", "Mentoría Estratégica mensual", "Análisis de métricas", "Proyección a largo plazo"].map((item, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-200"><CheckCircle2 size={18} className="text-[#905361] flex-shrink-0"/> {item}</li>
                ))}
              </ul>
              <a href="#contacto" className="w-full block text-center py-3 rounded-xl font-bold bg-[#905361] text-white hover:bg-[#5E2B35] transition shadow-lg">Agendar Call VIP</a>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN DE CONTACTO (Añadida desde HomePage) --- */}
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
                            <span className="text-[#FDE5E5] font-bold tracking-widest uppercase text-sm">Cotiza tu Proyecto</span>
                            <h2 className="text-4xl font-bold mt-2 mb-4">¿Lista para construir tu Rascacielos?</h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                Déjanos tus datos y nos pondremos en contacto contigo para agendar una auditoría gratuita o discutir cómo podemos escalar tu negocio.
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
                                    <p className="text-gray-300">@arquitectadetupropioexito</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna Derecha: Formulario */}
                    <div className="lg:w-1/2">
                        <form onSubmit={handleContactSubmit} className="bg-white p-8 rounded-3xl shadow-lg space-y-5">
                            {/* Input oculto para Honeypot (Anti-spam de web3forms) */}
                            <input type="checkbox" name="botcheck" className="hidden" style={{display: 'none'}} />

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Tu Nombre o Marca</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={contactForm.name}
                                    onChange={handleContactChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] outline-none transition"
                                    placeholder="Ej. María Pérez / Mi Tienda"
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
                                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Háblanos de tu proyecto</label>
                                <textarea 
                                    name="message"
                                    value={contactForm.message}
                                    onChange={handleContactChange}
                                    rows="4"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] outline-none transition resize-none"
                                    placeholder="Me interesa el Paquete 'Fachada Digital' porque..."
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
                                    <>Enviar Solicitud <Send size={18} /></>
                                )}
                            </button>
                        </form>
                    </div>

                </div>
            </motion.div>
        </div>
      </section>

      {/* --- FOOTER SIMPLIFICADO --- */}
      <footer className="bg-[#F7F2EF] text-[#1B3854] py-12 text-center border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-4">BluePrint<span className="text-[#905361]">Digital</span></h2>
            <p className="text-sm text-gray-500">&copy; 2026 BluePrint Digital Agency. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};

export default BluePrintAgency;