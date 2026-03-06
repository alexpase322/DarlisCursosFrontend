import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  Building2, 
  Heart, 
  Award, 
  Megaphone, 
  ArrowRight,
  CheckCircle2,
  Copy,
  Terminal,
  Youtube // <-- NUEVO ICONO
} from "lucide-react";

const PilaresContenido = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Prompt copiado al portapapeles!");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  // --- EL PROMPT MAESTRO ---
  const promptMultiplicador = `Actúa como un estratega experto en creación de contenido para redes sociales y marca personal.

Voy a darte un dolor específico de mi avatar, y necesito que lo conviertas en ideas de contenido alineadas a los 3 pilares de contenido: identidad, autoridad y conversión.

Dolor de mi avatar:
[ESCRIBE AQUÍ EL DOLOR DE TU AVATAR]

Ahora necesito que desarrolles contenido basado en ese dolor utilizando tres pilares y tres formatos diferentes.

1️⃣ Pilar de IDENTIDAD (contenido para conectar emocionalmente)
Crea:
Formato 1: Reel corto de 7 segundos
    •    Frase gancho para el video (texto corto que aparezca en pantalla)
    •    Copy del post donde se desarrolla la reflexión y el mensaje emocional.
Formato 2: Carrusel
    •    Gancho en la primera diapositiva
    •    Estructura de las siguientes diapositivas para contar la idea.
Formato 3: Video hablando a cámara o mini-blog
    •    Un pequeño guion natural que pueda decir frente a la cámara.
⸻
2️⃣ Pilar de AUTORIDAD (contenido para enseñar algo)
Crea:
Formato 1: Reel corto de 7 segundos
    •    Frase gancho
    •    Copy del post donde explico el valor o aprendizaje.
Formato 2: Carrusel
    •    Gancho inicial
    •    Estructura de las diapositivas explicando el consejo o enseñanza.
Formato 3: Video hablando a cámara o mini-blog
    •    Guion corto donde explique la solución o aprendizaje.
⸻
3️⃣ Pilar de CONVERSIÓN (contenido para invitar o abrir la puerta a mi programa o mentoría)
Crea:
Formato 1: Reel corto de 7 segundos
    •    Frase gancho
    •    Copy del post donde conecto el dolor con mi acompañamiento o solución.
Formato 2: Carrusel
    •    Gancho inicial
    •    Estructura de las diapositivas que lleve naturalmente a una invitación.
Formato 3: Video hablando a cámara o mini-blog
    •    Guion corto donde invito de forma natural a mi servicio o programa.
⸻
IMPORTANTE:
    •    Los ganchos deben ser claros, emocionales y fáciles de entender.
    •    El tono debe ser humano, cercano y auténtico.
    •    El contenido debe conectar con el dolor del avatar.
    •    Evita frases genéricas como “tips para emprender”.
    •    Que el contenido sea natural para redes sociales.`;

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white pb-32">
      
      {/* --- BACKGROUND GRID --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: `radial-gradient(#1B3854 2px, transparent 2px)`, backgroundSize: '30px 30px' }}>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-24 pb-20 px-6 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#1B3854] font-bold text-xs uppercase tracking-widest mb-6 shadow-sm border border-gray-100"
        >
          <Building2 size={16} className="text-[#905361]" /> Material de Apoyo - Clase 2
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-[#1B3854] mb-6 leading-tight"
        >
          TUS PILARES DE <br/> <span className="text-[#905361]">CONTENIDO</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light"
        >
          Los pilares no son categorías (motivación, vida personal). Son <strong className="font-bold text-[#1B3854]">líneas estratégicas de comunicación</strong>.
        </motion.p>

        {/* --- NUEVO BOTÓN DE YOUTUBE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <a 
            href="https://youtu.be/OxtwbT6Bpg8" // Pon aquí tu link de YouTube
            target="_blank" 
            rel="noreferrer" 
            className="px-8 py-4 bg-[#FF0000] text-white font-black rounded-full hover:bg-[#CC0000] transition-all flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <Youtube size={24} /> VER CLASE EN YOUTUBE
          </a>
        </motion.div>
      </header>

      {/* --- THE REALITY CHECK --- */}
      <section className="max-w-4xl mx-auto px-6 mb-24 relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}
          className="bg-[#1B3854] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden text-center"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          
          <h2 className="text-3xl font-bold mb-8">La Gran Pregunta</h2>
          <p className="text-2xl md:text-3xl font-light italic leading-relaxed text-[#FDE5E5]">
            "¿Qué necesita ver mi avatar repetidamente para <span className="font-bold text-white">confiar, conectar y comprar</span>?"
          </p>
        </motion.div>
      </section>

      {/* --- LOS 3 PILARES ESTRUCTURALES --- */}
      <section className="max-w-6xl mx-auto px-6 mb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1B3854] mb-4 uppercase tracking-tighter">Los 3 Pilares Estructurales</h2>
          <p className="text-gray-500 text-lg">Toda marca que vende necesita estos tres. No es opcional, es estructura.</p>
        </div>

        <motion.div 
          className="grid lg:grid-cols-3 gap-8"
          initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true, margin: "-50px" }}
        >
          {/* IDENTIDAD */}
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[3rem] shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#FDE5E5] flex items-center justify-center mb-8">
              <Heart size={32} className="text-[#905361]" />
            </div>
            <h3 className="text-2xl font-black text-[#1B3854] mb-2">1. Identidad</h3>
            <p className="text-[#905361] font-bold text-sm uppercase tracking-widest mb-6">Conexión Emocional</p>
            <p className="text-gray-600 mb-6">Muestras lo que crees, tu historia, valores y procesos internos (maternidad, mentalidad). No es contar tu vida por contarla, es alinearla a tu mensaje.</p>
            <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-[#905361]">
              <p className="text-sm text-gray-700 italic"><strong>Ejemplo:</strong> "Ser mamá fue lo que me hizo decidir emprender."</p>
            </div>
          </motion.div>

          {/* AUTORIDAD */}
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[3rem] shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300 relative transform lg:-translate-y-8">
            <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-[#1B3854] text-white px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full">Clave</div>
            <div className="w-16 h-16 rounded-2xl bg-[#E0E7FF] flex items-center justify-center mb-8">
              <Award size={32} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-[#1B3854] mb-2">2. Autoridad</h3>
            <p className="text-blue-600 font-bold text-sm uppercase tracking-widest mb-6">Posicionamiento</p>
            <p className="text-gray-600 mb-6">Enseñas tu método, estrategia, pasos y errores comunes. Muestras resultados. Sin autoridad hay conexión, pero no hay ventas.</p>
            <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-blue-600">
              <p className="text-sm text-gray-700 italic"><strong>Ejemplo:</strong> "Te enseño cómo estructurar tu contenido aunque tengas miedo."</p>
            </div>
          </motion.div>

          {/* CONVERSIÓN */}
          <motion.div variants={fadeInUp} className="bg-white p-10 rounded-[3rem] shadow-lg border border-gray-100 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#D1FAE5] flex items-center justify-center mb-8">
              <Megaphone size={32} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-black text-[#1B3854] mb-2">3. Conversión</h3>
            <p className="text-green-600 font-bold text-sm uppercase tracking-widest mb-6">Invitación Estratégica</p>
            <p className="text-gray-600 mb-6">Hablas de tu oferta, invitas a clases, rompes objeciones. Lo haces sin miedo y sin culpa porque ya construiste identidad y autoridad.</p>
            <div className="bg-gray-50 p-5 rounded-2xl border-l-4 border-green-600">
              <p className="text-sm text-gray-700 italic"><strong>Ejemplo:</strong> "Si quieres aprender a hacerlo conmigo, entra al taller."</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- ESENCIA VS ESTRUCTURA --- */}
      <section className="max-w-4xl mx-auto px-6 mb-32 relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}
          className="bg-gradient-to-br from-[#905361] to-[#5E2B35] rounded-[3rem] p-10 md:p-14 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-black mb-6">Tu Esencia lo atraviesa todo</h2>
              <p className="text-pink-100 text-lg leading-relaxed mb-6">
                Tus gustos (mamá, espiritual, emprendedora) no son 4 pilares separados. <strong className="text-white">Son la energía que atraviesa los 3 pilares estratégicos.</strong>
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#FDE5E5] flex-shrink-0" size={20} /> Sin pilares → Publicas por emoción</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="text-[#FDE5E5] flex-shrink-0" size={20} /> Con pilares → Publicas con intención</li>
              </ul>
            </div>
            
            {/* Las 3 Preguntas */}
            <div className="w-full md:w-auto bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
              <h4 className="font-bold text-[#FDE5E5] mb-4 uppercase tracking-widest text-sm text-center">Define los tuyos:</h4>
              <div className="space-y-4">
                <div className="bg-white text-[#1B3854] px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center shadow-sm">
                  <span>¿Qué necesita sentir?</span> <span className="text-[#905361]">Identidad</span>
                </div>
                <div className="bg-white text-[#1B3854] px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center shadow-sm">
                  <span>¿Qué necesita aprender?</span> <span className="text-blue-600">Autoridad</span>
                </div>
                <div className="bg-white text-[#1B3854] px-4 py-3 rounded-xl text-sm font-bold flex justify-between items-center shadow-sm">
                  <span>¿Qué necesita escuchar?</span> <span className="text-green-600">Conversión</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- EL PROMPT MAESTRO --- */}
      <section className="max-w-5xl mx-auto px-6 mb-32 relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}
          className="bg-white rounded-[3rem] border-2 border-dashed border-[#905361] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-10 items-center shadow-2xl"
        >
          <Terminal className="text-gray-100 absolute -bottom-10 -right-10 pointer-events-none" size={300} />
          
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl font-black text-[#1B3854] mb-4 flex items-center gap-3">
              <Copy className="text-[#905361]" size={32} /> El Prompt Maestro
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Transforma un solo <strong>dolor de tu avatar</strong> en 9 piezas de contenido estratégico (3 pilares × 3 formatos). Copia este prompt, pégalo en ChatGPT y rellena el corchete.
            </p>
            
            <div className="bg-[#F7F2EF] p-6 rounded-2xl border border-gray-200 mb-6 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#F7F2EF] pointer-events-none"></div>
              <p className="text-sm text-gray-500 italic font-mono h-24 overflow-hidden">
                Actúa como un estratega experto en creación de contenido para redes sociales y marca personal.<br/><br/>
                Voy a darte un dolor específico de mi avatar, y necesito que lo conviertas en ideas de contenido alineadas a los 3 pilares...
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto shrink-0">
            <button 
              onClick={() => copyToClipboard(promptMultiplicador)}
              className="w-full md:w-auto px-10 py-6 bg-[#1B3854] text-white font-black rounded-3xl hover:bg-[#905361] hover:scale-105 transition-all flex flex-col items-center justify-center gap-2 shadow-xl"
            >
              <Copy size={28} />
              <span className="text-xl">COPIAR PROMPT</span>
              <span className="text-xs font-normal opacity-70 uppercase tracking-widest text-[#FDE5E5]">Multiplicador × 9</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* --- EL EDIFICIO DEL MÉTODO ADN --- */}
      <section className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-[#905361] font-bold tracking-widest uppercase text-sm">Tu Posicionamiento</span>
          <h2 className="text-4xl font-black text-[#1B3854] mt-2 mb-4">El Edificio del Método ADN</h2>
          <p className="text-gray-500 text-lg">Así se ve visualmente la arquitectura de tu marca digital.</p>
        </div>

        <motion.div 
          className="flex flex-col-reverse gap-4 max-w-2xl mx-auto"
          initial="hidden" whileInView="visible" variants={staggerContainer} viewport={{ once: true }}
        >
          {[
            { level: "Cimientos", name: "Manifiesto", desc: "Lo que creo", color: "bg-[#1B3854]", text: "text-white" },
            { level: "Columnas", name: "Discurso", desc: "Cómo lo cuento", color: "bg-[#2A4D6E]", text: "text-blue-100" },
            { level: "Dirección", name: "Avatar", desc: "A quién le hablo", color: "bg-[#905361]", text: "text-pink-100" },
            { level: "Estructura", name: "Pilares", desc: "Cómo organizo lo que publico", color: "bg-[#B06A7A]", text: "text-white" },
            { level: "Acabados", name: "Formato", desc: "Reels de 7-10 segundos", color: "bg-[#FDE5E5]", text: "text-[#905361]" },
          ].map((floor, i) => (
            <motion.div 
              key={i} variants={fadeInUp}
              className={`${floor.color} ${floor.text} p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between text-center md:text-left shadow-md transform hover:scale-[1.02] transition-transform`}
              style={{ width: `${100 - (4 - i) * 6}%`, margin: '0 auto' }}
            >
              <div>
                <span className="text-xs uppercase tracking-widest font-bold opacity-70">{floor.level}</span>
                <h3 className="text-2xl font-black">{floor.name}</h3>
              </div>
              <p className="font-medium mt-2 md:mt-0 opacity-90">{floor.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16 text-center">
          <button className="px-10 py-5 bg-[#1B3854] text-white rounded-full font-black text-lg shadow-xl hover:bg-[#905361] transition-all flex items-center gap-3 mx-auto">
            IR A LA SIGUIENTE LECCIÓN <ArrowRight size={20} />
          </button>
        </div>
      </section>

    </div>
  );
};

export default PilaresContenido;