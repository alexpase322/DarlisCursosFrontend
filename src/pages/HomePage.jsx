import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { Check, Loader2 } from "lucide-react";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // --- CONFIGURACIÓN DE STRIPE ---
  // Reemplaza con tus IDs reales de Stripe Dashboard (Test Mode)
  const PLAN_IDS = {
    MONTHLY: "price_1SnZK0DP5qCZDXVtTwJzTKDX", 
    QUARTERLY: "price_1SnZKwDP5qCZDXVtEhJsyc46",
    YEARLY: "price_1Qxxxxxxxxxxxxxx"
  };

  const handleSubscribe = async (priceId) => {
    setLoading(true);
    try {
      // Lógica flexible:
      // Si el usuario está logueado, enviamos su email para que Stripe lo reconozca.
      // Si NO está logueado, enviamos solo el priceId y Stripe le pedirá el email allá.
      const payload = user ? { priceId, email: user.email } : { priceId };

      const { data } = await axios.post("/payment/create-checkout-session", payload);
      
      // Redirigir directamente a Stripe
      window.location.href = data.url; 
      
    } catch (error) {
      console.error(error);
      toast.error("Error al conectar con la pasarela de pago");
      setLoading(false);
    }
  };

  // --- CONFIG ANIMACIONES ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans overflow-x-hidden">
      
      {/* --- NAVBAR SIMPLE --- */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-20">
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
      <header className="relative px-6 pt-10 pb-20 lg:pt-20 lg:pb-32 max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">
        <motion.div 
          className="lg:w-1/2 space-y-6 text-center lg:text-left"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[#FDE5E5] text-[#5E2B35] font-semibold text-sm tracking-wide mb-2">
            ✨ Tu independencia financiera empieza hoy
          </span>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-[#1B3854] leading-tight">
            Domina el <span className="text-[#905361]">Marketing Digital</span> sin descuidar a tu familia.
          </h1>
          <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
            Aprende a generar ingresos desde casa con horarios flexibles. Una plataforma creada por mamás, para mamás.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#planes" className="px-8 py-4 bg-[#905361] text-white rounded-full font-bold text-lg shadow-lg hover:bg-[#5E2B35] hover:scale-105 transition transform duration-300">
              Ver Planes
            </a>
            
            {/* Solo mostrar botón de login si NO está logueado */}
            {!user && (
                <Link to="/login" className="px-8 py-4 bg-white text-[#1B3854] border border-gray-200 rounded-full font-bold shadow hover:shadow-md transition">
                Ya tengo cuenta
                </Link>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="lg:w-1/2 relative"
          initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
        >
          <div className="absolute top-0 right-10 w-96 h-96 bg-[#FDE5E5] rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500">
             <img src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mamá trabajando feliz" className="w-full h-auto object-cover"/>
          </div>
        </motion.div>
      </header>

      {/* --- QUIENES SOMOS --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="flex flex-col lg:flex-row items-center gap-16"
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          >
            <motion.div className="lg:w-1/2 grid grid-cols-2 gap-4" variants={fadeInUp}>
               <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg mt-8" alt="Team member" />
               <img src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80" className="rounded-2xl shadow-lg" alt="Team member" />
            </motion.div>
            <motion.div className="lg:w-1/2 space-y-6" variants={fadeInUp}>
              <h4 className="text-[#905361] font-bold tracking-widest uppercase text-sm">Nuestra Historia</h4>
              <h2 className="text-4xl font-bold text-[#1B3854]">Entendemos el reto de ser mamá y profesional</h2>
              <p className="text-gray-600 text-lg leading-relaxed">Somos un grupo de madres emprendedoras que, cansadas de elegir entre nuestra carrera y nuestros hijos, decidimos crear nuestro propio camino.</p>
              <div className="flex gap-8 pt-4">
                <div><h3 className="text-3xl font-bold text-[#5E2B35]">+5k</h3><p className="text-sm text-gray-500">Alumnas</p></div>
                <div><h3 className="text-3xl font-bold text-[#5E2B35]">+120</h3><p className="text-sm text-gray-500">Cursos</p></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- CARACTERÍSTICAS --- */}
      <section className="py-20 bg-[#1B3854] text-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-3xl lg:text-4xl font-bold mb-16">
            ¿Por qué elegir esta comunidad?
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Libertad de Horarios", desc: "Aprende de madrugada o durante la siesta. Tú pones el ritmo.", icon: "⏰" },
              { title: "Soporte 24/7", desc: "Nunca estarás sola. Nuestra comunidad siempre está activa.", icon: "🤝" },
              { title: "Monetización Real", desc: "Estrategias probadas para facturar desde el primer mes.", icon: "💸" },
            ].map((item, index) => (
              <motion.div key={index} className="bg-[#2a4d6e] p-8 rounded-2xl hover:bg-[#905361] transition-colors duration-300 cursor-pointer group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 }} viewport={{ once: true }}>
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-300 group-hover:text-white">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIOS --- */}
      <section className="py-24 bg-[#FDE5E5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1B3854]">Lo que dicen nuestras mamás</h2>
            <p className="text-[#905361] mt-2">Historias reales de éxito</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Lucía P.", role: "Mamá de 2", text: "Gracias a este curso pude renunciar a mi trabajo de oficina y ahora gano el doble desde mi sala." },
              { name: "Andrea M.", role: "Mamá primeriza", text: "Pensé que no tenía tiempo, pero las lecciones son tan puntuales que aprendí rapidísimo." },
              { name: "Carla R.", role: "Emprendedora", text: "La comunidad es lo mejor. Sentirme apoyada por otras mujeres no tiene precio." },
            ].map((testimonial, i) => (
              <motion.div key={i} className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#905361]" whileHover={{ y: -10 }} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <div className="flex gap-1 mb-4 text-yellow-400">★★★★★</div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1B3854] rounded-full flex items-center justify-center text-white font-bold">{testimonial.name.charAt(0)}</div>
                  <div><h4 className="font-bold text-[#1B3854]">{testimonial.name}</h4><span className="text-xs text-gray-500">{testimonial.role}</span></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN DE PRECIOS --- */}
      <section id="planes" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#1B3854] mb-4">Invierte en tu Futuro</h2>
                <p className="text-gray-500 text-lg">Elige el plan que mejor se adapte a tu ritmo. Cancela cuando quieras.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-center">
                
                {/* PLAN MENSUAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                    <h3 className="text-xl font-bold text-[#1B3854] mb-2">Mensual</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-[#1B3854]">$50</span><span className="text-gray-400 text-sm">/mes</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Acceso a cursos básicos", "Comunidad de alumnas", "Recursos descargables"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.MONTHLY)} disabled={loading} className="w-full py-3 rounded-xl font-bold bg-[#FDE5E5] text-[#905361] hover:bg-[#905361] hover:text-white transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Mensual"}
                    </button>
                </motion.div>

                {/* PLAN ANUAL (DESTACADO) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="relative p-8 bg-white rounded-3xl border border-[#905361] shadow-2xl scale-105 z-10 flex flex-col"
                >
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-[#905361] text-white px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase shadow-md">Más Popular</div>
                    <h3 className="text-xl font-bold text-[#1B3854] mb-2">Anual</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-[#1B3854]">$500</span><span className="text-gray-400 text-sm">/año</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Todo lo del plan mensual", "Ahorras $100 USD", "Mentoría grupal mensual", "Certificados oficiales", "Acceso prioritario a eventos"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.YEARLY)} disabled={loading} className="w-full py-3 rounded-xl font-bold bg-[#1B3854] text-white hover:bg-[#2a4d6e] shadow-lg transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Anual"}
                    </button>
                </motion.div>

                {/* PLAN TRIMESTRAL */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col"
                >
                    <h3 className="text-xl font-bold text-[#1B3854] mb-2">Trimestral</h3>
                    <div className="mb-6"><span className="text-4xl font-bold text-[#1B3854]">$120</span><span className="text-gray-400 text-sm">/trimestre</span></div>
                    <ul className="space-y-4 mb-8 flex-1">
                        {["Todo lo del plan mensual", "Ahorras $30 USD", "Acceso a talleres especiales", "Soporte prioritario"].map((f, i) => (
                            <li key={i} className="flex gap-3 text-sm text-gray-600"><Check size={18} className="text-green-500"/> {f}</li>
                        ))}
                    </ul>
                    <button onClick={() => handleSubscribe(PLAN_IDS.QUARTERLY)} disabled={loading} className="w-full py-3 rounded-xl font-bold bg-[#FDE5E5] text-[#905361] hover:bg-[#905361] hover:text-white transition-all">
                        {loading ? <Loader2 className="animate-spin mx-auto"/> : "Elegir Trimestral"}
                    </button>
                </motion.div>

            </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-20 px-6 text-center">
        <motion.div 
          className="max-w-4xl mx-auto bg-[#5E2B35] rounded-3xl p-12 lg:p-20 text-white relative overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#905361] rounded-full mix-blend-overlay filter blur-3xl opacity-50"></div>
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 relative z-10">¿Lista para cambiar tu vida?</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">Únete hoy y obtén acceso inmediato a los módulos de iniciación.</p>
          
          <a 
            href="#planes" 
            className="inline-block px-10 py-5 bg-[#FDE5E5] text-[#5E2B35] font-extrabold rounded-full text-xl hover:bg-white hover:scale-105 transition duration-300 shadow-lg relative z-10"
          >
            Quiero Suscribirme
          </a>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1B3854] text-gray-400 py-10 text-center border-t border-gray-700">
        <p>&copy; 2024 MomsDigitales. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-4 mt-4 text-sm">
          <a href="#" className="hover:text-white">Términos</a>
          <a href="#" className="hover:text-white">Privacidad</a>
          <a href="#" className="hover:text-white">Contacto</a>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;