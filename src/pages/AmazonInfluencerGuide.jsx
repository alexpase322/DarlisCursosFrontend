import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star, Youtube, HelpCircle, ShieldCheck,
  TrendingUp, Users, CheckCircle2, Image as ImageIcon,
  AlertTriangle, MousePointerClick, Smartphone, BarChart, ShoppingBag
} from "lucide-react";
import Seo from "../components/Seo";
import { seoConfigs } from "../seo";

const AmazonInfluencerGuide = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Componente reutilizable para los placeholders de imagen
  const ImagePlaceholder = ({ title, desc }) => (
    <div className="bg-gray-50 rounded-3xl overflow-hidden border-2 border-dashed border-[#905361]/30 relative group flex flex-col items-center justify-center p-8 text-center min-h-[250px] shadow-sm my-8">
      <ImageIcon className="text-[#905361] opacity-40 mb-3" size={48} />
      <span className="text-[#1B3854] font-bold text-sm uppercase tracking-widest">{title}</span>
      <span className="text-gray-500 text-xs mt-2">{desc}</span>
      {/* <img src="RUTA_DE_TU_IMAGEN.png" alt={title} className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity" /> */}
    </div>
  );

  return (
    <>
      <Seo {...seoConfigs.amazonInfluencer} />
      <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white pb-32">
      
      {/* --- HERO & VIDEO SECTION --- */}
      <header className="relative pt-24 pb-16 px-6 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1B3854] text-white font-bold text-xs uppercase tracking-widest mb-6 shadow-sm"
        >
          <Star size={16} className="text-[#FDE5E5]" /> @Darlisfv • Guía Definitiva
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-[#1B3854] mb-4 leading-tight"
        >
          AMAZON <span className="text-[#905361]">INFLUENCER</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto font-light mb-12"
        >
          Todo lo que necesitas saber para postularte, ser aprobada y monetizar tus recomendaciones en la tienda más grande del mundo.
        </motion.p>

        {/* REPRODUCTOR DE YOUTUBE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100"
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-900 relative flex items-center justify-center group">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/TU_VIDEO_ID_AQUI" 
              title="Clase Amazon Influencer" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 z-10"
            ></iframe>
            <div className="absolute z-0 text-white/50 flex flex-col items-center">
              <Youtube size={64} className="mb-2" />
              <p>Espacio para Video de YouTube</p>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-20 mt-12">
        
        {/* --- PREGUNTAS FRECUENTES --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="text-[#905361]" size={32} />
            <h2 className="text-3xl font-black text-[#1B3854]">Preguntas Frecuentes</h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">1. ¿Qué es un Influencer de Amazon?</h3>
              <p className="text-gray-600">Si eres parte del Programa de Influenciadores de Amazon, eres un creador de contenido que comparte recomendaciones para atraer a tu audiencia en las redes sociales. Para las empresas de medios o marcas que buscan dirigir tráfico a Amazon, postularse al Programa de Asociados de Amazon sería más adecuado.</p>
              <ImagePlaceholder title="Espacio de Imagen (Pág 1)" desc="Imagen con el título 'Amazon Preguntas Frecuentes' con el logo de Amazon." />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">2. ¿Cómo califico para este programa?</h3>
              <p className="text-gray-600 mb-4">Es súper fácil ya que aceptan solicitudes de influencers de todo tipo, siempre y cuando tengan una cuenta en: <strong>YouTube, Instagram, Facebook o TikTok</strong>.</p>
              <p className="text-gray-600 mb-4">Si presentas la solicitud con una cuenta de Instagram o Facebook, es obligatorio que tengas una <strong>cuenta comercial</strong>. Durante la evaluación de la solicitud, Amazon tiene en cuenta:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Cantidad de seguidores</li>
                <li>Métricas de interacción</li>
              </ul>
              <ImagePlaceholder title="Espacio de Imagen (Pág 1)" desc="Diseño gráfico con el título de la sección." />
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">3. ¿Cómo puedo monetizar mi contenido?</h3>
              <p className="text-gray-600 mb-3">Para generar ingresos a partir de tu contenido, tienes varias opciones disponibles:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#905361] shrink-0 mt-1" size={18}/> Compartir la URL de tu tienda o enlaces de afiliados en tus plataformas de redes sociales.</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="text-[#905361] shrink-0 mt-1" size={18}/> El contenido publicado en tu tienda puede mostrarse a los compradores de Amazon, lo que te permitirá aumentar seguidores y ganar dinero con nuevos clientes.</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">4. ¿Cuánto ganaré?</h3>
              <p className="text-gray-600 mb-3">Puedes comenzar a ganar una comisión cuando tus seguidores realicen compras elegibles a través de tus enlaces de afiliado. La comisión que recibes está determinada por:</p>
              <ul className="list-disc pl-5 text-gray-600 space-y-1 mb-4">
                <li>Los productos que se venden</li>
                <li>El tipo de categoría</li>
              </ul>
              <p className="text-[#1B3854] font-bold italic">Todo esto varía según el esfuerzo en tu trabajo, porque sí, esto es un trabajo.</p>
              <ImagePlaceholder title="Espacio de Imagen (Pág 2)" desc="Diseño con el título 'Amazon Preguntas Frecuentes'." />
            </div>
          </div>
        </motion.section>

        {/* --- COSAS A TENER EN CUENTA Y PLR --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="bg-[#1B3854] p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
            <h2 className="text-3xl font-black mb-4">Cosas a tener en cuenta</h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Sigue estos sencillos pasos para solicitar el programa de influencers de Amazon. Quiero que sepas que he hecho todo lo posible para cubrir todos los aspectos, dudas y el paso a paso en esta guía. Pero recuerda realizar una investigación adicional, ya que es fundamental para lograr el máximo éxito en este programa.
            </p>
            
            <div className="bg-[#FDE5E5] text-[#1B3854] p-6 rounded-2xl">
              <h4 className="font-black text-[#905361] flex items-center gap-2 mb-2">
                <AlertTriangle size={20} /> Nota Importante (PLR)
              </h4>
              <p className="text-sm mb-3">Esta guía viene con derechos de reventa, lo que significa que puedes venderla y ganar el 100% de las ganancias. Antes de hacer cualquier edición debes hacer una copia de la guía. Si no sabes cómo hacerlo puedes escribirle a la autora.</p>
              <p className="text-xs opacity-70">Esta información ha sido recopilada del sitio web de Amazon, el proceso de solicitud, otras personas influyentes y experiencia personal de la autora.</p>
            </div>
          </div>
          <ImagePlaceholder title="Espacio de Imagen (Pág 3)" desc="Imagen de portada titulada Amazon Influencer." />
        </motion.section>

        {/* --- REQUISITOS PARA APLICAR --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-[#1B3854] mb-8 text-center">Requisitos para aplicar al programa</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#1B3854]">
              <Smartphone className="text-[#1B3854] mb-4" size={32} />
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Redes Sociales</h3>
              <p className="text-gray-600 text-sm mb-3">Amazon suele aceptar influencers que tienen presencia en las principales plataformas de redes sociales como: <strong>Instagram, YouTube, Twitter, Facebook y Blogs personales (a veces).</strong></p>
              <p className="text-gray-600 text-sm">Estas plataformas sirven como canales principales a través de los cuales puedes promocionar los productos a tu público.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#905361]">
              <Users className="text-[#905361] mb-4" size={32} />
              <h3 className="text-xl font-bold text-[#1B3854] mb-3">Número de seguidores</h3>
              <p className="text-gray-600 text-sm mb-3">No existe un requisito mínimo estricto. Sin embargo, Amazon generalmente prefiere influencers con una cantidad sustancial (miles o cientos de miles son favorables, especialmente si son orgánicos).</p>
              <p className="text-gray-600 text-sm font-bold">Sin embargo, no se trata solo de la cantidad de seguidores. También importa la calidad de la audiencia y el nivel de engagement.</p>
            </div>
          </div>

          <ImagePlaceholder title="Espacio de Imagen (Pág 4)" desc="Imagen con el título Amazon Influencer – Requisitos para aplicar al programa." />

          <div className="bg-gradient-to-br from-[#905361] to-[#5E2B35] p-10 rounded-[3rem] text-white shadow-xl mt-8">
            <TrendingUp className="text-[#FDE5E5] mb-4" size={36} />
            <h3 className="text-2xl font-black mb-4">Compromiso (Engagement)</h3>
            <p className="text-pink-100 mb-4">
              Además del número de seguidores, Amazon evalúa las métricas de participación: <strong>Me gusta, Comentarios, Publicaciones compartidas e Interacciones</strong>.
            </p>
            <p className="text-pink-100 mb-6">
              Las tasas de interacción altas indican que la audiencia está activa, involucrada e interesada. Una audiencia comprometida tiene más probabilidades de confiar en las recomendaciones y actuar en función de ellas.
            </p>
            <div className="bg-white/10 p-5 rounded-xl border border-white/20">
              <p className="font-bold text-[#FDE5E5] flex items-center gap-2"><AlertTriangle size={18}/> Recuerda:</p>
              <p className="text-sm">La cantidad de seguidores NO asegura el éxito. Existen testimonios de personas que iniciaron con menos de 3.000 seguidores, porque su audiencia era muy receptiva.</p>
            </div>
          </div>
          <ImagePlaceholder title="Espacio de Imagen (Pág 5)" desc="Diseño con el mensaje destacado sobre seguidores y éxito." />

        </motion.section>

        {/* --- PASO A PASO (EL PROCESO) --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-4xl font-black text-[#1B3854] mb-12 text-center">El Proceso Paso a Paso</h2>
          
          <div className="space-y-12">
            
            {/* PASO 1 Y 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="text-[#905361] font-black text-5xl opacity-20 mb-[-20px]">01</div>
                <h3 className="text-2xl font-bold text-[#1B3854]">Verificar la elegibilidad</h3>
                <p className="text-gray-600 mt-2">Asegúrate de cumplir con los criterios. Amazon busca una cantidad sustancial y activa de seguidores en Instagram, YouTube, Facebook o TikTok.</p>
              </div>
              <div className="md:w-2/3 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-[#905361] font-black text-5xl opacity-20 mb-[-20px]">02</div>
                <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Aplicar al programa</h3>
                <ol className="space-y-4 text-gray-700">
                  <li className="flex gap-3"><MousePointerClick className="text-[#905361] shrink-0"/> Ve a Google y escribe "Programa de influencers de Amazon".</li>
                  <ImagePlaceholder title="Espacio de Imagen (Pág 6)" desc="Captura de búsqueda en Google." />
                  
                  <li className="flex gap-3"><MousePointerClick className="text-[#905361] shrink-0"/> Haz clic en "Registrarse". Inicia sesión o crea una cuenta nueva.</li>
                  <ImagePlaceholder title="Espacio de Imagen (Pág 7)" desc="Captura del botón de registro." />
                  
                  <li className="flex gap-3"><MousePointerClick className="text-[#905361] shrink-0"/> Elige la plataforma donde eres más activo. Amazon solicitará permiso para verificar tu cuenta y métricas.</li>
                  <ImagePlaceholder title="Espacio de Imagen (Pág 8)" desc="Iconos de YouTube, Instagram, TikTok y Facebook." />
                  
                  <li className="flex gap-3"><MousePointerClick className="text-[#905361] shrink-0"/> Inicia sesión en la plataforma elegida. Amazon pedirá permiso para acceder a tus estadísticas para aprobarte.</li>
                  <ImagePlaceholder title="Espacio de Imagen (Pág 9)" desc="Capturas de inicio de sesión en TikTok." />
                </ol>
              </div>
            </div>

            {/* PASO 3 Y 4 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-[#1B3854] font-black text-5xl opacity-20 mb-[-20px]">03</div>
                <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Completar la solicitud</h3>
                <p className="text-gray-600 mb-4">Debes completar información sobre tu contenido, datos demográficos y cómo planeas promocionar. Sé detallado sobre tu género de contenido y público objetivo. Esto aumenta tus posibilidades.</p>
                <ImagePlaceholder title="Espacio de Imagen (Pág 10)" desc="Gráfico de flechas señalando los campos del formulario." />
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="text-[#1B3854] font-black text-5xl opacity-20 mb-[-20px]">04</div>
                <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Esperar aprobación</h3>
                <p className="text-gray-600 mb-4">El proceso de aprobación suele ser casi instantáneo. Puedes recibir aprobación o rechazo de inmediato.</p>
                <ImagePlaceholder title="Espacio de Imagen (Pág 11)" desc="Ejemplo visual de pantalla de aprobación y rechazo." />
              </div>
            </div>

            {/* PASO 5 */}
            <div className="bg-[#1B3854] text-white p-8 md:p-10 rounded-3xl shadow-xl">
              <div className="text-[#FDE5E5] font-black text-5xl opacity-20 mb-[-20px]">05</div>
              <h3 className="text-2xl font-bold mb-4">Configurar tu tienda</h3>
              <p className="text-blue-100 mb-6">Si te aprueban, inicia sesión, accede a tu panel y personaliza tu escaparate con: <strong>biografía, foto de perfil e imagen de portada</strong>. Aquí compartirás tus recomendaciones.</p>
              <ImagePlaceholder title="Espacio de Imagen (Pág 12)" desc="Captura del panel de la tienda." />
            </div>

            {/* PASO 6 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-[#905361] font-black text-5xl opacity-20 mb-[-20px]">06</div>
              <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Promocionar tu tienda</h3>
              <p className="text-gray-600 mb-4">Crea listas de productos recomendados (Ej: Favoritos de verano, Esenciales del hogar). Comparte el enlace en tus redes y genera contenido relacionado.</p>
              <ImagePlaceholder title="Espacio de Imagen (Pág 13 y 14)" desc="Ejemplo de tienda y listas de productos." />
              
              <div className="mt-8 bg-[#F7F2EF] p-6 rounded-2xl">
                <h4 className="font-bold text-[#1B3854] mb-2 flex items-center gap-2"><Youtube size={20}/> Reseñas en Video</h4>
                <p className="text-sm text-gray-600 mb-4">Duración recomendada: 30 segundos a 3 minutos. Deben ser prácticas, honestas y de productos que realmente tengas.</p>
                <ImagePlaceholder title="Espacio de Imagen (Pág 15)" desc="Captura de interfaz de publicaciones." />
              </div>

              <div className="mt-8 border-l-4 border-[#905361] pl-6">
                <h4 className="font-bold text-[#1B3854] mb-2">Notas importantes para comisiones</h4>
                <p className="text-gray-600 mb-4">Sube <strong>3 videos de reseñas</strong> que cumplan las políticas. Después debes esperar a que Amazon elimine el candado azul. Cuando desaparece, empiezas a ganar dinero. Tienes 3 oportunidades para lograr la aprobación.</p>
                <ImagePlaceholder title="Espacio de Imagen (Pág 16 y 17)" desc="Panel de subida de videos y botón." />
              </div>
            </div>

            {/* PASO 7 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-[#1B3854] font-black text-5xl opacity-20 mb-[-20px]">07</div>
              <h3 className="text-2xl font-bold text-[#1B3854] mb-4">Supervisar tu rendimiento</h3>
              <p className="text-gray-600 mb-4">Utiliza el panel de control para revisar tus ganancias y analizar qué productos funcionan mejor. Esto te ayudará a mejorar tu estrategia.</p>
              <ImagePlaceholder title="Espacio de Imagen (Pág 18)" desc="Gráfico de crecimiento con monedas." />
            </div>

          </div>
        </motion.section>

        {/* --- CONSEJOS FINALES --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="bg-gradient-to-br from-[#FDE5E5] to-white p-10 rounded-[3rem] border border-[#905361]/20 text-center">
            <h2 className="text-3xl font-black text-[#1B3854] mb-8">Consejos Adicionales</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-[#905361] shrink-0 mt-1" />
                <p className="text-gray-700"><strong>Mantente activo:</strong> Actualiza continuamente tu tienda y elimina sugerencias obsoletas.</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-[#905361] shrink-0 mt-1" />
                <p className="text-gray-700"><strong>Conecta con tu audiencia:</strong> Interactúa y motiva a tus seguidores a visitar tu tienda.</p>
              </div>
              <div className="flex gap-4 items-start md:col-span-2">
                <CheckCircle2 className="text-[#905361] shrink-0 mt-1" />
                <p className="text-gray-700"><strong>Cumple las reglas:</strong> Sigue todas las pautas de Amazon para evitar problemas con tu cuenta.</p>
              </div>
            </div>
            <ImagePlaceholder title="Espacio de Imagen (Pág 19)" desc="Ilustración de comunidad interactuando." />
          </div>
        </motion.section>

      </main>

      <footer className="mt-24 text-center text-[#1B3854]">
          <p className="text-sm font-bold uppercase tracking-widest opacity-30">@Darlisfv • Programa Amazon Influencer</p>
      </footer>

      </div>
    </>
  );
};

export default AmazonInfluencerGuide;
