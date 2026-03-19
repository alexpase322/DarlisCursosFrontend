import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Youtube, Copy, Zap, Target, MessageSquare,
  Repeat, Smartphone, Layout, Video, ArrowRight,
  Sparkles, Quote, CheckCircle2, Mic2, Building2,
  Ruler, Construction, Box, Heart, Award, Megaphone
} from "lucide-react";
import Seo from "../components/Seo";
import { seoConfigs } from "../seo";

const MemoriaEmocional = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Contenido copiado");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <>
      <Seo {...seoConfigs.memoriaEmocional} />
      <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white pb-32 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <header className="relative pt-24 pb-16 px-6 text-center z-10 border-b border-gray-200 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1B3854] text-white font-bold text-xs uppercase tracking-widest mb-8 shadow-xl"
        >
          <Sparkles size={16} className="text-[#FDE5E5]" /> Laboratorio de Contenido ADN
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-[#1B3854] mb-6 leading-[0.9] tracking-tighter"
        >
          LA MÁQUINA DE <br/> <span className="text-[#905361]">CONTENIDO 1×9</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-500 max-w-4xl mx-auto font-light mb-10"
        >
          Deja de publicar por emoción y empieza a construir con <span className="text-[#1B3854] font-bold underline decoration-[#905361]">intención estratégica</span>. De un solo dolor, a una semana completa de ventas.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <a 
            href="https://youtu.be/QhMv33MT1JY" 
            target="_blank" rel="noreferrer"
            className="flex items-center gap-3 bg-[#FF0000] text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-[#CC0000] transition-all transform hover:-translate-y-1"
          >
            <Youtube size={32} /> VER CLASE EN YOUTUBE
          </a>
        </motion.div>
      </header>

      {/* --- FASE 1: ARQUITECTURA DEL EDIFICIO --- */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1B3854] uppercase tracking-tighter mb-4">La Estructura de tu Marca</h2>
          <p className="text-gray-500 text-lg">Tu posicionamiento se construye como un edificio. Sin cimientos, el contenido se cae.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" whileInView="visible" variants={staggerContainer} className="space-y-4">
            {[
              { l: "Cimientos", n: "Manifiesto", d: "Lo que crees y tu postura ante la industria.", c: "bg-[#1B3854]" },
              { l: "Columnas", n: "Discurso", d: "Cómo cuentas tu solución al mundo.", c: "bg-[#2A4D6E]" },
              { l: "Dirección", n: "Avatar", d: "A quién le hablas exactamente.", c: "bg-[#905361]" },
              { l: "Estructura", n: "Pilares", d: "Cómo organizas estratégicamente lo que publicas.", c: "bg-[#B06A7A]" },
              { l: "Acabados", n: "Formato", d: "Reels de 7s, Carruseles y Videos narrativos.", c: "bg-[#FDE5E5]", t: "text-[#905361]" }
            ].map((floor, i) => (
              <motion.div key={i} variants={fadeInUp} className={`${floor.c} ${floor.t || "text-white"} p-6 rounded-3xl shadow-lg flex items-center justify-between group hover:scale-[1.02] transition-transform`}>
                <div>
                  <span className="text-[10px] uppercase font-bold opacity-60 tracking-[0.2em]">{floor.l}</span>
                  <h4 className="text-xl font-black">{floor.n}</h4>
                </div>
                <p className="text-xs max-w-[200px] text-right opacity-80">{floor.d}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-2xl font-black text-[#1B3854] mb-6">Preguntas para tus Pilares</h3>
            <p className="text-gray-600 mb-8 italic">Responde esto antes de crear cualquier pieza de contenido:</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#FDE5E5] flex items-center justify-center shrink-0 font-bold text-[#905361]">1</div>
                <p className="text-gray-700"><strong>Identidad:</strong> ¿Qué necesita <span className="text-[#905361] underline">sentir</span> mi avatar para conectar conmigo?</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center shrink-0 font-bold text-blue-600">2</div>
                <p className="text-gray-700"><strong>Autoridad:</strong> ¿Qué necesita <span className="text-blue-600 underline">aprender</span> para confiar en mi método?</p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0 font-bold text-green-600">3</div>
                <p className="text-gray-700"><strong>Conversión:</strong> ¿Qué necesita <span className="text-green-600 underline">escuchar</span> para tomar acción hoy?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FASE 2: LA MEMORIA EMOCIONAL --- */}
      <section className="bg-[#1B3854] py-24 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial="hidden" whileInView="visible" variants={fadeInUp}>
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">De la Memoria al Guion</h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed">
                No uses frases genéricas. Busca en tu "caja de recuerdos" esos momentos que dispararon tu cambio. Eso es lo que tu avatar está viviendo ahora mismo.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <h5 className="font-bold text-[#FDE5E5] mb-2 uppercase text-xs">Situación</h5>
                  <p className="text-sm opacity-70 italic">"No pude ir a la presentación escolar de mi hija."</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <h5 className="font-bold text-[#FDE5E5] mb-2 uppercase text-xs">Conversación</h5>
                  <p className="text-sm opacity-70 italic">"Aquí vinimos a trabajar, no a soñar."</p>
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <Quote className="absolute -top-10 -left-10 text-white/5" size={200} />
              <div className="bg-white p-10 rounded-[3rem] text-[#1B3854] shadow-2xl relative z-10">
                <h3 className="text-2xl font-black mb-6">El Impacto del 1 × 9</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-500">1 Solo Dolor</span>
                    <span className="font-black">Situación real</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-500">3 Pilares</span>
                    <span className="font-black text-[#905361]">ADN Estratégico</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="font-medium text-gray-500">3 Formatos</span>
                    <span className="font-black">Reel, Carrusel, Hablado</span>
                  </div>
                  <div className="pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold">TOTAL</span>
                    <span className="text-4xl font-black text-[#905361]">9 PIEZAS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FASE 3: EL LABORATORIO (LOS 9 CONTENIDOS) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-[#1B3854] tracking-tighter uppercase">Laboratorio de Transmutación</h2>
          <p className="text-gray-500">Así es como un dolor se convierte en una semana de contenido estratégico.</p>
        </div>

        {/* --- BLOQUE 1: IDENTIDAD --- */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <Heart className="text-[#905361]" size={32} />
            <h3 className="text-3xl font-black text-[#1B3854]">Pilar: IDENTIDAD (Conectar)</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#905361] uppercase tracking-widest mb-4">Reel 7s</span>
              <p className="text-gray-700 italic flex-grow">"Hubo un día que mi hija me preguntó por qué nunca podía ir a sus actividades..."</p>
              <button onClick={() => copyToClipboard("Hubo un día que mi hija me preguntó por qué nunca podía ir a sus actividades...")} className="mt-6 w-full py-3 bg-[#F7F2EF] text-[#905361] font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#905361] hover:text-white transition-all"><Copy size={14}/> COPIAR GANCHO</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#905361] uppercase tracking-widest mb-4">Carrusel</span>
              <p className="text-gray-700 italic flex-grow">"S1: El día que no pude ir. S2: Cuando migras, muchas cosas cambian. S3: Mi tiempo con mis hijos no es negociable."</p>
              <button onClick={() => copyToClipboard("S1: El día que no pude ir. S2: Cuando migras, muchas cosas cambian. S3: Mi tiempo con mis hijos no es negociable.")} className="mt-6 w-full py-3 bg-[#F7F2EF] text-[#905361] font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#905361] hover:text-white transition-all"><Copy size={14}/> COPIAR ESTRUCTURA</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-[#905361] uppercase tracking-widest mb-4">Hablando</span>
              <p className="text-gray-700 italic flex-grow">"A veces estamos tan cansadas que solo decimos 'tengo que trabajar', pero por dentro sentimos que estamos fallando..."</p>
              <button onClick={() => copyToClipboard("A veces estamos tan cansadas que solo decimos 'tengo que trabajar', pero por dentro sentimos que estamos fallando...")} className="mt-6 w-full py-3 bg-[#F7F2EF] text-[#905361] font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#905361] hover:text-white transition-all"><Copy size={14}/> COPIAR GUION</button>
            </div>
          </div>
        </div>

        {/* --- BLOQUE 2: AUTORIDAD --- */}
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-10">
            <Award className="text-blue-600" size={32} />
            <h3 className="text-3xl font-black text-[#1B3854]">Pilar: AUTORIDAD (Posicionar)</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1B3854] text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col">
              <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-4">Reel 7s</span>
              <p className="italic flex-grow">"Si estás trabajando tanto que no puedes estar presente para tus hijos... esto te va a doler."</p>
              <button onClick={() => copyToClipboard("Si estás trabajando tanto que no puedes estar presente para tus hijos... esto te va a doler.")} className="mt-6 w-full py-3 bg-white/10 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-white hover:text-[#1B3854] transition-all"><Copy size={14}/> COPIAR GANCHO</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Carrusel</span>
              <p className="text-gray-700 italic flex-grow">"S1: Nadie te enseñó otra manera. S2: Habilidades digitales vs tiempo de calidad. S3: El Método ADN."</p>
              <button onClick={() => copyToClipboard("S1: Nadie te enseñó otra manera. S2: Habilidades digitales vs tiempo de calidad. S3: El Método ADN.")} className="mt-6 w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><Copy size={14}/> COPIAR ESTRUCTURA</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-4">Hablando</span>
              <p className="text-gray-700 italic flex-grow">"No vinimos a este país solo a sobrevivir. Vinimos a construir libertad. Te enseño cómo estructurar tu negocio."</p>
              <button onClick={() => copyToClipboard("No vinimos a este país solo a sobrevivir. Vinimos a construir libertad. Te enseño cómo estructurar tu negocio.")} className="mt-6 w-full py-3 bg-blue-50 text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"><Copy size={14}/> COPIAR GUION</button>
            </div>
          </div>
        </div>

        {/* --- BLOQUE 3: CONVERSIÓN --- */}
        <div>
          <div className="flex items-center gap-4 mb-10">
            <Megaphone className="text-green-600" size={32} />
            <h3 className="text-3xl font-black text-[#1B3854]">Pilar: CONVERSIÓN (Vender)</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-4">Reel 7s</span>
              <p className="text-gray-700 italic flex-grow">"Empezar desde cero también puede ser una oportunidad de decidir cómo quieres vivir."</p>
              <button onClick={() => copyToClipboard("Empezar desde cero también puede ser una oportunidad de decidir cómo quieres vivir.")} className="mt-6 w-full py-3 bg-green-50 text-green-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"><Copy size={14}/> COPIAR GANCHO</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-4">Carrusel</span>
              <p className="text-gray-700 italic flex-grow">"S1: ¿Reconstruirte desde donde estás? S2: Nuevas habilidades. S3: Comenta ACADEMIA para empezar."</p>
              <button onClick={() => copyToClipboard("S1: ¿Reconstruirte desde donde estás? S2: Nuevas habilidades. S3: Comenta ACADEMIA para empezar.")} className="mt-6 w-full py-3 bg-green-50 text-green-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"><Copy size={14}/> COPIAR ESTRUCTURA</button>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-4">Hablando</span>
              <p className="text-gray-700 italic flex-grow">"Hoy me enfoco en acompañar a mujeres que quieren empezar a construir algo diferente. Haz clic en el link de mi bio."</p>
              <button onClick={() => copyToClipboard("Hoy me enfoco en acompañar a mujeres que quieren empezar a construir algo diferente. Haz clic en el link de mi bio.")} className="mt-6 w-full py-3 bg-green-50 text-green-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-green-600 hover:text-white transition-all"><Copy size={14}/> COPIAR GUION</button>
            </div>
          </div>
        </div>
      </section>

      {/* --- CIERRE: LA POSTURA DE LA ARQUITECTA --- */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" variants={fadeInUp} className="space-y-10">
            <h2 className="text-5xl font-black text-[#1B3854] tracking-tighter italic">"Lo que no se comunica con estrategia, se pierde en el ruido."</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Ahora tienes el edificio, los planos y los acabados. Es momento de que salgas a construir tu rascacielos digital.
            </p>
            <div className="flex justify-center gap-4">
               <button className="px-12 py-5 bg-[#1B3854] text-white rounded-full font-black text-xl hover:bg-[#905361] transition-all flex items-center gap-3 shadow-xl">
                 TALLER FINALIZADO <CheckCircle2 />
               </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center">
         <p className="text-sm font-bold uppercase tracking-widest text-[#1B3854] opacity-30">@darlisfrancov • Taller Arquitecta de Contenido</p>
      </footer>

      </div>
    </>
  );
};

export default MemoriaEmocional;
