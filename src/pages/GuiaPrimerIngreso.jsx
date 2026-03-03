import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, Sparkles, CheckCircle2, MessageCircle, 
  TrendingUp, Lightbulb, Rocket, Target, DollarSign, 
  PlaneTakeoff, Globe, Instagram, Send, PlayCircle, Smartphone, Brain
} from "lucide-react";
import analiticas from "../assets/Analiticas.jpeg"
import perfilTiktok from "../assets/perfiltiktok.jpeg"
import darlisFoto from "../assets/DarlisFoto.png"
// --- CONFIGURACIÓN DE LINKS EXTERNOS (CÁMBIALOS AQUÍ) ---
const EXTERNAL_LINKS = {
  whatsappTribu: "https://chat.whatsapp.com/TU_CODIGO",
  productosListos: "https://links.darlisfrancofv.com",
  boletoAcademia: "https://darlisfrancofv.com/shop/1c392b69-a03b-4ff4-959a-62bd1022b270",
  tiktok: "https://www.tiktok.com/@darlisfv?_r=1&_t=ZS-94OR6yTfuCt",
  instagram: "https://www.instagram.com/darlisfrancov?igsh=MWdyNThneWJqdWx6dg=="
};

const GuiaPrimerIngreso = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const steps = [
    {
      id: "01",
      title: "Cambia la Mentalidad",
      subtitle: "Del miedo a la acción",
      desc: "El miedo nunca desaparece del todo, pero se vuelve más pequeño cuando tomas acción. La claridad no llega antes de comenzar, llega cuando te mueves.",
      icon: <Brain className="text-blue-500" />,
      exercise: 'Escribe hoy: "Estoy construyendo mi primer ingreso digital desde casa, paso a paso."'
    },
    {
      id: "02",
      title: "Descubre qué ofrecer",
      subtitle: "Tu conocimiento vale",
      desc: "Tu experiencia puede ser un Ebook, una Guía Rápida o un Mini Curso. Si no tienes nada aún, puedes empezar compartiendo productos de expertos y ganando comisiones.",
      icon: <Lightbulb className="text-yellow-500" />,
      badge: "Inicia con productos listos"
    },
    {
      id: "03",
      title: "Transforma tu Saber",
      subtitle: "Soluciones, no cosas",
      desc: "Si promueves un producto de $297, con solo 4 ventas al mes ya logras tus primeros $1000. Esa es la magia del marketing digital.",
      icon: <DollarSign className="text-green-500" />
    },
    {
      id: "04",
      title: "Crea sin complicarte",
      subtitle: "Hecho es mejor que perfecto",
      desc: "Usa Canva para el diseño, ChatGPT para la estructura y Beacons para vender sin tener página web compleja.",
      icon: <Smartphone className="text-purple-500" />
    },
    {
      id: "05",
      title: "Promueve y Vende",
      subtitle: "Comparte tu historia",
      desc: "No necesitas miles de seguidores, solo ser sincera. Tu proceso y tu transformación son tu mejor estrategia de venta.",
      icon: <Rocket className="text-pink-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <span className="bg-[#905361] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Guía Gratuita</span>
          <h1 className="text-5xl md:text-7xl font-black text-[#1B3854] mt-4 leading-none">
            DE <span className="text-[#905361]">0</span> A TU PRIMER <br /> 
            <span className="text-outline">INGRESO DIGITAL</span>
          </h1>
          <p className="text-xl text-gray-600 mt-6 leading-relaxed">
            Los 5 pasos para construir tu primera fuente de ingresos desde casa, aunque sientas que no sabes nada del mundo digital.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[#905361] font-bold italic">
             <CheckCircle2 size={20} /> "Tu punto de partida importa"
          </div>
        </motion.div>

        {/* ESPACIO PARA TU FOTO 1 */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
          className="relative h-[500px] bg-gray-200 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white"
        >
          <img 
            src={darlisFoto} 
            alt="Tu Foto"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-6 right-6 bg-white p-4 rounded-2xl shadow-xl">
             <p className="text-[#1B3854] font-black text-2xl leading-none">+$50,000 USD</p>
             <p className="text-gray-400 text-xs font-bold uppercase">Generados</p>
          </div>
        </motion.div>
      </header>

      {/* --- PRUEBA SOCIAL / RESULTADOS --- */}
      <section className="bg-[#1B3854] py-20 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
                <h2 className="text-4xl font-black mb-6">De Cero a los <span className="text-[#FDE5E5]">$50,000 USD</span></h2>
                <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                    Yo también empecé sin claridad. Aprendí habilidades que me parecían imposibles. Hoy, vivo 100% de mi negocio digital. Esta guía no es motivación vacía, es el paso a paso real.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                        <p className="text-3xl font-black">$49,237</p>
                        <p className="text-xs uppercase opacity-60 font-bold">Beacons</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl border border-white/20">
                        <p className="text-3xl font-black">$28,750</p>
                        <p className="text-xs uppercase opacity-60 font-bold">PayPal, Stan Store</p>
                    </div>
                </div>
            </div>
            
            {/* ESPACIO PARA TU FOTO 2 (RESULTADOS/SCREENSHOTS) */}
            <div className="bg-white p-4 rounded-3xl shadow-2xl transform rotate-2">
                <img 
                    src={analiticas} 
                    alt="Pruebas de ingresos"
                    className="w-full h-auto rounded-2xl"
                />
            </div>
        </div>
      </section>

      {/* --- CTA WHATSAPP --- */}
      <section className="py-16 px-6">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="max-w-4xl mx-auto bg-gradient-to-r from-[#905361] to-[#5E2B35] p-10 rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden"
          >
            <div className="relative z-10">
                <h3 className="text-3xl font-black mb-4">Sé arquitecta de tu propio éxito con Darlis</h3>
                <p className="text-pink-100 mb-8 max-w-xl mx-auto">¿Te gustaría recibir clases, talleres y entrenamientos gratuitos? Entra a mi grupo exclusivo.</p>
                <a 
                    href={EXTERNAL_LINKS.whatsappTribu}
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-[#905361] px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition"
                >
                    <MessageCircle size={24} /> ¡ÚNETE AQUÍ!
                </a>
            </div>
          </motion.div>
      </section>

      {/* --- LOS 5 PASOS --- */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-[#1B3854] text-center mb-16 uppercase italic">El Plano del Éxito</h2>
        
        <div className="space-y-12">
            {steps.map((step, i) => (
                <motion.div 
                    key={i} initial="hidden" whileInView="visible" variants={fadeInUp}
                    className="flex flex-col md:flex-row gap-8 items-start bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-xl transition-all"
                >
                    <div className="bg-[#FDE5E5] w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-black text-[#905361] flex-shrink-0">
                        {step.id}
                    </div>
                    <div className="flex-1">
                        <span className="text-[#905361] font-bold uppercase text-xs tracking-widest">{step.subtitle}</span>
                        <h3 className="text-2xl font-black text-[#1B3854] mb-3">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed mb-4">{step.desc}</p>
                        
                        {step.exercise && (
                            <div className="bg-[#F7F2EF] p-4 rounded-xl border-l-4 border-[#905361] text-sm">
                                <strong>Mini Ejercicio:</strong> {step.exercise}
                            </div>
                        )}

                        {step.id === "02" && (
                            <a 
                                href={EXTERNAL_LINKS.productosListos}
                                className="mt-4 inline-flex items-center gap-2 text-[#905361] font-black uppercase text-xs hover:underline"
                            >
                                <PlayCircle size={16}/> Productos Listos Aquí <ArrowRight size={14}/>
                            </a>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* --- ACADEMY SECTION (NUEVO) --- */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 text-[#905361] font-bold mb-4">
                <PlaneTakeoff /> Next Flight Academy
            </div>
            <h2 className="text-5xl font-black text-[#1B3854] mb-8">Escalas al Éxito</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-16 italic text-lg">
                ¿Estás lista para abordar pero no sabes por dónde empezar? Pasan los años y sigues en el mismo lugar... la academia es tu boleto al siguiente nivel.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
                {[
                    "Plataforma de Pagos", "Inteligencia Artificial", "CapCut", "Canva", "ADS", 
                    "Community Manager", "Reprogramación Mental", "Hábitos Poderosos", "Ejercicios", 
                    "Imagen Estratégica", "Marca Personal", "Todo sobre Ventas", "ManyChat", 
                    "Creación de Infoproductos", "Email Marketing", "Nicho y Subnicho", "Multinivel", 
                    "Oratoria", "Marca en Instagram", "Colaboraciones", "Amazon Influencer", 
                    "Factura con Retos", "Embudos Estratégicos", "Organización Semanal"
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-3 bg-[#F7F2EF] rounded-xl text-xs font-bold text-[#1B3854]">
                        <div className="w-5 h-5 bg-[#905361] text-white rounded-full flex items-center justify-center text-[10px]">{i+1}</div>
                        {item}
                    </div>
                ))}
            </div>

            <div className="mt-20">
                <a 
                    href={EXTERNAL_LINKS.boletoAcademia}
                    className="group bg-[#1B3854] text-white px-12 py-6 rounded-full font-black text-2xl shadow-2xl hover:bg-[#905361] transition-all flex flex-col items-center mx-auto w-fit"
                >
                    <span className="text-sm opacity-60 font-bold uppercase tracking-[0.3em] mb-1">Boarding Pass</span>
                    TU BOLETO AQUÍ
                    <ArrowRight className="group-hover:translate-x-2 transition-transform mt-2" />
                </a>
            </div>
        </div>
      </section>

      {/* --- SECCIÓN CONTACTO / FINAL --- */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
            {/* ESPACIO PARA TU FOTO 3 (FINAL) */}
            <div className="w-48 h-48 bg-gray-200 rounded-full mx-auto mb-8 border-4 border-[#FDE5E5] overflow-hidden shadow-lg">
                <img 
                    src={perfilTiktok} 
                    alt="Darlisfv"
                    className="w-full h-full object-cover"
                />
            </div>
            
            <h2 className="text-3xl font-black text-[#1B3854] mb-8">¡Contáctame!</h2>
            
            <div className="grid gap-4">
                <a href={EXTERNAL_LINKS.whatsappTribu} className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-between font-black text-[#1B3854] hover:border-[#905361] transition">
                    <span>Club digital "Emprende con Darlis"</span>
                    <MessageCircle className="text-[#905361]" />
                </a>
                <a href={EXTERNAL_LINKS.tiktok} className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-between font-black text-[#1B3854] hover:border-[#905361] transition">
                    <span>Tik Tok @Darlisfv</span>
                    <Globe className="text-[#905361]" />
                </a>
                <a href={EXTERNAL_LINKS.instagram} className="w-full p-6 bg-white border-2 border-gray-100 rounded-3xl flex items-center justify-between font-black text-[#1B3854] hover:border-[#905361] transition">
                    <span>Instagram @darlisfrancov</span>
                    <Instagram className="text-[#905361]" />
                </a>
            </div>
      </section>

      <footer className="py-12 bg-[#F7F2EF] text-center border-t border-gray-200">
         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">De 0 a tu Primer Ingreso Digital • 2026</p>
      </footer>

      {/* ESTILOS EXTRA PARA EL TEXTO OUTLINE */}
      <style dangerouslySetInnerHTML={{ __html: `
        .text-outline {
          -webkit-text-stroke: 1.5px #1B3854;
          color: transparent;
        }
      ` }} />
    </div>
  );
};

export default GuiaPrimerIngreso;