import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  DraftingCompass, 
  Ruler, 
  Construction, 
  FileText, 
  MessageSquare, 
  UserSearch, 
  CheckSquare, 
  ArrowRight,
  Copy,
  Terminal
} from "lucide-react";

const MetodoADN = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("¡Prompt copiado al portapapeles!");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // --- PROMPTS COMPLETOS Y ESTRUCTURADOS ---
  const prompts = {
    manifiesto: `Actúa como un estratega experto en marca personal y copywriting emocional. Quiero que me ayudes a redactar mi Manifiesto de Marca (mi postura ante la industria). 

Aquí tienes mi información básica:
1. Quién soy y qué hago: [Describe brevemente tu profesión o negocio]
2. Qué verdad aprendí en mi historia: [Escribe esa lección o momento clave que te hizo cambiar de mentalidad]
3. Qué NO estoy dispuesta a negociar en mi industria (lo que odio o quiero cambiar): [Ej: Odio el contenido vacío, no tolero vender humo, etc.]
4. A quién quiero ayudar: [Describe a esa persona que necesita tu ayuda]
5. Por qué hago lo que hago: [Tu propósito más profundo]

Con esta información, redacta un manifiesto poderoso, inspirador y disruptivo, de unos 3-4 párrafos, que conecte emocionalmente con mi audiencia y deje clara mi autoridad y mis valores.`,

    discurso: `Actúa como un copywriter especializado en posicionamiento. Basado en la información de mi marca personal, necesito definir mi 'Elevator Pitch' o Discurso de Marca. 

Debe ser una frase clara, magnética y directa siguiendo esta fórmula exacta:
"Ayudo a [QUIÉN] a [LOGRAR QUÉ] aunque [OBSTÁCULO / SIN HACER QUÉ]".

Aquí tienes los datos que debes usar para rellenar la fórmula:
- A quién ayudo: [Ej: Mamás emprendedoras, coaches, dueños de negocios]
- Qué logran conmigo: [Ej: Escalar sus ventas, automatizar su negocio, recuperar su tiempo libre]
- Cuál es su mayor obstáculo o miedo: [Ej: Sin descuidar a su familia, sin saber de tecnología, aunque tengan poco tiempo]

Por favor, dame 5 opciones diferentes, desde una muy formal y directa, hasta una más disruptiva y emocional, para que yo pueda elegir la que mejor resuene con mi personalidad.`,

    avatar: `Actúa como un investigador de mercado y experto en psicología del consumidor. Quiero que me ayudes a definir a mi Cliente Ideal (Avatar) a un nivel muy profundo, no solo con datos demográficos, sino psicográficos.

Mi negocio consiste en: [Describe tu producto, servicio o curso]

Quiero que me entregues un perfil detallado dividido exactamente en estas 4 capas:
- Capa 1 (Datos básicos): Edad, género, ocupación, situación familiar y económica.
- Capa 2 (Pensamientos y Comportamientos): Qué piensa antes de dormir, qué consume en redes sociales, a quién sigue, qué formato prefiere.
- Capa 3 (Dolor Específico): Cuál es su mayor frustración diaria relacionada con mi nicho. Qué es eso que le quita la paz.
- Capa 4 (Deseo Profundo): Qué es lo que realmente anhela en el fondo (Identidad, libertad, estatus, validación). No me digas "quiere más dinero", dime *para qué* quiere ese dinero emocionalmente.

Entrégame este perfil en formato de viñetas claras, con un tono empático y muy realista.`
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white">
      
      {/* --- BACKGROUND GRID EFFECT --- */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: `linear-gradient(#1B3854 1.5px, transparent 1.5px), linear-gradient(90deg, #1B3854 1.5px, transparent 1.5px)`, backgroundSize: '40px 40px' }}>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-24 pb-16 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FDE5E5] text-[#905361] font-bold text-xs uppercase tracking-widest mb-6"
        >
          <DraftingCompass size={14} /> Material de Apoyo - Clase 1
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-[#1B3854] mb-4"
        >
          MÉTODO <span className="text-[#905361]">ADN</span>
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-500 font-light italic">"Arquitecta de tu Marca Digital"</p>
        
        <div className="mt-12 max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-[#1B3854]/10 relative">
            <Construction className="absolute -top-6 -left-6 text-[#905361] bg-[#F7F2EF] p-2 rounded-full" size={48} />
            <p className="text-gray-600 leading-relaxed text-lg">
                Aquí no estamos improvisando contenido. Estamos construyendo los <span className="font-bold text-[#1B3854]">cimientos de tu marca</span>. Antes de pensar en tendencias, necesitas claridad.
            </p>
        </div>
      </header>

      {/* --- LOS 3 PILARES --- */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
            {[
                { title: "Manifiesto", sub: "Los Cimientos", icon: <FileText />, step: "01" },
                { title: "Discurso", sub: "Las Columnas", icon: <MessageSquare />, step: "02" },
                { title: "Avatar", sub: "La Dirección", icon: <UserSearch />, step: "03" },
            ].map((pilar, i) => (
                <motion.div 
                    key={i} initial="hidden" whileInView="visible" variants={fadeInUp}
                    className="bg-white p-8 rounded-[2.5rem] border-b-4 border-[#905361] shadow-sm group hover:shadow-xl transition-all"
                >
                    <span className="text-5xl font-black text-gray-100 group-hover:text-[#FDE5E5] transition-colors">{pilar.step}</span>
                    <div className="text-[#905361] mb-4 mt-2">{pilar.icon}</div>
                    <h3 className="text-2xl font-bold text-[#1B3854]">{pilar.title}</h3>
                    <p className="text-gray-400 font-medium">{pilar.sub}</p>
                </motion.div>
            ))}
        </div>
      </section>

      {/* --- CONTENIDO DETALLADO --- */}
      <main className="max-w-5xl mx-auto px-6 space-y-24 pb-32">
        
        {/* PILLAR 1: MANIFIESTO */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-3xl font-black text-[#1B3854] uppercase tracking-tighter">01. Crea tu Manifiesto</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div className="space-y-6">
                    <p className="text-lg text-gray-600">Tu manifiesto es tu <span className="font-bold underline decoration-[#905361]">postura ante la industria</span>. Es lo que evita que copies contenido y te mantiene coherente.</p>
                    <div className="bg-[#1B3854] text-white p-6 rounded-3xl space-y-4 shadow-xl">
                        <h4 className="font-bold text-[#FDE5E5]">¿Qué debe responder?</h4>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li>• ¿Qué verdad aprendí en mi historia?</li>
                            <li>• ¿Qué no estoy dispuesta a negociar?</li>
                            <li>• ¿A quién quiero ayudar y por qué?</li>
                        </ul>
                    </div>
                </div>
                
                {/* PROMPT BOX */}
                <div className="bg-white rounded-3xl border-2 border-dashed border-[#905361] p-8 relative overflow-hidden flex flex-col h-full">
                    <Terminal className="text-gray-200 absolute -bottom-4 -right-4" size={120} />
                    <div className="relative z-10 flex-grow">
                      <h4 className="font-bold text-[#1B3854] mb-4 flex items-center gap-2">
                          <Copy size={16} className="text-[#905361]" /> Prompt para Manifiesto
                      </h4>
                      <p className="text-xs text-gray-500 mb-6 italic leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {prompts.manifiesto.substring(0, 100)}...<br/>
                        <span className="text-[#905361] font-semibold mt-2 block">(Contiene estructura de 5 variables)</span>
                      </p>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(prompts.manifiesto)}
                        className="w-full py-4 mt-auto relative z-10 bg-[#F7F2EF] text-[#905361] font-bold rounded-2xl hover:bg-[#905361] hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        COPIAR PROMPT <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </motion.section>

        {/* PILLAR 2: DISCURSO */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-3xl font-black text-[#1B3854] uppercase tracking-tighter">02. Crea tu Discurso</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            
            <div className="bg-[#905361] rounded-[3rem] p-10 text-white relative overflow-hidden">
                <Ruler className="absolute top-10 right-10 text-white/10 rotate-12" size={200} />
                <div className="max-w-3xl relative z-10 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-6">El Manifiesto es interno, el Discurso es externo.</h3>
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mb-8">
                          <p className="text-sm uppercase tracking-widest text-[#FDE5E5] mb-2">Fórmula Maestra</p>
                          <p className="text-2xl font-bold italic">"Ayudo a [QUIÉN] a [LOGRAR QUÉ] aunque [OBSTÁCULO]"</p>
                      </div>
                    </div>
                    <div className="w-full md:w-auto">
                      <button 
                          onClick={() => copyToClipboard(prompts.discurso)}
                          className="w-full md:w-auto px-8 py-5 bg-white text-[#905361] font-black rounded-2xl hover:scale-105 transition transform shadow-xl flex flex-col items-center gap-1"
                      >
                          <Copy size={24} />
                          <span>COPIAR PROMPT</span>
                          <span className="text-xs font-normal opacity-70">De Discurso / Pitch</span>
                      </button>
                    </div>
                </div>
            </div>
        </motion.section>

        {/* PILLAR 3: AVATAR */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <h2 className="text-3xl font-black text-[#1B3854] uppercase tracking-tighter">03. Define tu Avatar</h2>
                <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { t: "Capa 1", d: "Datos básicos", c: "bg-white" },
                        { t: "Capa 2", d: "Pensamientos", c: "bg-white" },
                        { t: "Capa 3", d: "Dolor Específico", c: "bg-white" },
                        { t: "Capa 4", d: "Deseo Profundo", c: "bg-[#FDE5E5]" },
                    ].map((capa, i) => (
                        <div key={i} className={`${capa.c} p-6 rounded-3xl border border-gray-100 shadow-sm`}>
                            <h5 className="font-bold text-[#905361] mb-1">{capa.t}</h5>
                            <p className="text-sm text-gray-600">{capa.d}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-6 flex flex-col justify-center">
                    <p className="text-gray-600">No buscan dinero. Buscan <span className="font-bold text-[#1B3854]">Identidad, Libertad, Validación.</span> No le hablas a todo el mundo, le hablas a una persona específica (casi siempre tu versión del pasado).</p>
                    <button 
                        onClick={() => copyToClipboard(prompts.avatar)}
                        className="w-full py-6 bg-[#1B3854] text-white font-black rounded-[2rem] hover:bg-[#905361] transition-colors flex items-center justify-center gap-4 shadow-lg"
                    >
                        <UserSearch /> COPIAR PROMPT AVATAR
                    </button>
                </div>
            </div>
        </motion.section>

        {/* --- TAREA OBLIGATORIA --- */}
        <motion.section 
            initial="hidden" whileInView="visible" variants={fadeInUp}
            className="bg-white p-12 rounded-[4rem] shadow-2xl border border-gray-100 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#905361] rounded-bl-full flex items-center justify-end p-6">
                <CheckSquare className="text-white" size={32} />
            </div>
            
            <h2 className="text-4xl font-black text-[#1B3854] mb-8">Tarea Obligatoria</h2>
            <div className="space-y-4 mb-12">
                {["Tu manifiesto redactado", "Tu discurso claro", "Tu avatar profundo en 4 capas"].map((task, i) => (
                    <div key={i} className="flex items-center gap-4 text-xl text-gray-700">
                        <div className="w-8 h-8 rounded-full border-2 border-[#905361] flex items-center justify-center text-[#905361]">✓</div>
                        {task}
                    </div>
                ))}
            </div>

            <div className="bg-[#FDE5E5] p-8 rounded-3xl border-l-8 border-[#905361]">
                <p className="text-[#905361] font-bold text-lg mb-2">En la siguiente clase:</p>
                <p className="text-[#1B3854]">Vamos a convertir dolores en reels, transformar emociones en frases magnéticas y crear tu primera semana de contenido estratégico.</p>
            </div>
        </motion.section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-[#1B3854] py-16 text-center text-white">
          <p className="text-sm tracking-widest opacity-50 mb-4 uppercase">Empieza a construir hoy</p>
          <h2 className="text-3xl font-bold mb-8 italic">Como Arquitecta.</h2>
      </footer>

    </div>
  );
};

export default MetodoADN;