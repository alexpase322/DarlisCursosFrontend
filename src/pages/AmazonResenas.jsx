import { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  ShoppingBag,
  DollarSign,
  MessageCircle,
  Star,
  AlertTriangle,
  Copy,
  CheckCircle2,
  ImageIcon,
  Youtube,
  CreditCard,
  Store,
  RefreshCcw
} from "lucide-react";
import Seo from "../components/Seo";
import { seoConfigs } from "../seo";

const AmazonResenas = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Mensaje copiado al portapapeles");
  };

  const scriptContacto = `Hello, I would like to work with you as a product reviewer.
I would like to know the dynamic supplier payment advance or refund.
Thank you very much, I'll be attentive.`;

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <>
      <Seo {...seoConfigs.amazonResenas} />
      <div className="min-h-screen bg-[#F7F2EF] font-sans selection:bg-[#905361] selection:text-white pb-32">
      
      {/* --- HERO & VIDEO SECTION --- */}
      <header className="relative pt-24 pb-16 px-6 text-center z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1B3854] text-white font-bold text-xs uppercase tracking-widest mb-6 shadow-sm"
        >
          <Star size={16} className="text-[#FDE5E5]" /> @Darlisfv
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-[#1B3854] mb-4 leading-tight"
        >
          AMAZON <span className="text-[#905361]">RESEÑAS</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto font-light mb-12"
        >
          El famoso programa de productos gratis. Aprende la dinámica paso a paso para empezar a generar ingresos.
        </motion.p>

        {/* REPRODUCTOR DE YOUTUBE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto bg-white p-4 rounded-[2rem] shadow-2xl border border-gray-100"
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-900 relative flex items-center justify-center group">
            {/* Reemplaza la URL de abajo con el link "Embed" de tu video */}
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/TU_VIDEO_ID_AQUI" 
              title="Clase Amazon Reseñas" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="absolute inset-0 z-10"
            ></iframe>
            {/* Fallback visual en caso de que no haya video aún */}
            <div className="absolute z-0 text-white/50 flex flex-col items-center">
              <Youtube size={64} className="mb-2" />
              <p>Espacio para Video de YouTube</p>
            </div>
          </div>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-6 space-y-24 mt-12">
        
        {/* --- INTRODUCCIÓN Y VERDAD --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="bg-[#1B3854] text-white p-8 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden">
            <AlertTriangle className="absolute top-10 right-10 text-white/10" size={120} />
            <h2 className="text-3xl font-black mb-4 relative z-10 text-[#FDE5E5]">Introducción</h2>
            <p className="text-lg leading-relaxed relative z-10 font-light">
              Para iniciar quiero ser muy honesta contigo desde ya: <br/>
              <strong>Este programa no es directo con Amazon</strong>, es directo con proveedores que tienen tiendas en Amazon.
            </p>
          </div>
        </motion.section>

        {/* --- CÓMO FUNCIONA (LOS 5 PASOS) --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-[#1B3854] mb-8 flex items-center gap-3">
            <RefreshCcw className="text-[#905361]" /> Cómo funciona la dinámica
          </h2>
          <p className="text-gray-600 mb-8">
            Tú haces el contacto con los proveedores (no te preocupes, yo te los daré) y les dices que quieres trabajar con reseñas. Ten en cuenta que algunos tardan 2 a 3 días en responder.
          </p>
          
          <div className="space-y-4">
            {[
              "Tú compras el producto.",
              "Recibes el producto y haces una reseña (a veces escrita, a veces con imágenes; depende de lo que solicite el proveedor).",
              "Amazon la verifica y tú se la envías al proveedor.",
              "El proveedor te reembolsa el dinero a través de PayPal (algunos te envían primero el dinero para que hagas la compra).",
              "Te quedas con un producto gratis. Así de simple."
            ].map((paso, i) => (
              <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="w-8 h-8 bg-[#905361] text-white rounded-full flex items-center justify-center font-bold shrink-0">{i+1}</div>
                <p className="text-gray-700 pt-1">{paso}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* --- CÓMO HACES DINERO --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-lg border border-gray-100">
            <h2 className="text-3xl font-black text-[#1B3854] mb-4">Así haces dinero con Amazon reseñas</h2>
            <p className="text-gray-600 mb-8 bg-gray-50 p-4 rounded-xl">
              Debes tener claro que <strong>Amazon no te paga</strong>, te pagan los proveedores. Al final del proceso, tienes un producto gratis en tus manos.
            </p>
            
            <h3 className="text-xl font-bold text-[#1B3854] mb-4">¿Qué hacemos con el producto?</h3>
            <p className="text-gray-600 mb-6">Es opcional: Puedes venderlo o quedártelo. Muchas personas los venden, muchas otras se los quedan.</p>

            <h3 className="text-xl font-bold text-[#1B3854] mb-6">¿Dónde venderlos?</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* ESPACIO LOGO WHATSAPP */}
              <div className="bg-[#F7F2EF] p-4 rounded-2xl text-center border border-gray-200 flex flex-col items-center justify-center aspect-square relative group">
                <ImageIcon className="text-gray-300 mb-2" size={32} />
                <span className="text-xs font-bold text-gray-500">Logo WhatsApp</span>
                <span className="mt-2 text-sm font-bold text-[#1B3854]">Grupos WA</span>
                {/* <img src="RUTA_LOGO_WHATSAPP.png" alt="WhatsApp" className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </div>

              {/* ESPACIO LOGO FACEBOOK MARKETPLACE */}
              <div className="bg-[#F7F2EF] p-4 rounded-2xl text-center border border-gray-200 flex flex-col items-center justify-center aspect-square relative group">
                <ImageIcon className="text-gray-300 mb-2" size={32} />
                <span className="text-xs font-bold text-gray-500">Logo FB Marketplace</span>
                <span className="mt-2 text-sm font-bold text-[#1B3854]">Marketplace</span>
                {/* <img src="RUTA_LOGO_FB.png" alt="Facebook" className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </div>

              {/* ESPACIO LOGO OFFERUP */}
              <div className="bg-[#F7F2EF] p-4 rounded-2xl text-center border border-gray-200 flex flex-col items-center justify-center aspect-square relative group">
                <ImageIcon className="text-gray-300 mb-2" size={32} />
                <span className="text-xs font-bold text-gray-500">Logo OfferUp</span>
                <span className="mt-2 text-sm font-bold text-[#1B3854]">OfferUp</span>
                {/* <img src="RUTA_LOGO_OFFERUP.png" alt="OfferUp" className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </div>

              {/* ESPACIO LOGO EBAY */}
              <div className="bg-[#F7F2EF] p-4 rounded-2xl text-center border border-gray-200 flex flex-col items-center justify-center aspect-square relative group">
                <ImageIcon className="text-gray-300 mb-2" size={32} />
                <span className="text-xs font-bold text-gray-500">Logo eBay</span>
                <span className="mt-2 text-sm font-bold text-[#1B3854]">eBay</span>
                {/* <img src="RUTA_LOGO_EBAY.png" alt="eBay" className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity" /> */}
              </div>

            </div>
          </div>
        </motion.section>

        {/* --- ¿POR QUÉ NECESITAN RESEÑAS? --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-[#1B3854] mb-4">¿Por qué necesitan reseñas?</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Muchos proveedores necesitan posicionar sus productos en Amazon, por eso necesitan reseñas para generar más ventas. Ahí es donde entramos tú y yo: personas que prueban sus productos y comparten una opinión sobre su experiencia.
          </p>
          <p className="text-gray-600 font-medium">Ellos suelen comunicarse contigo a través de: <strong>Instagram, Facebook, o Grupos de WhatsApp</strong>.</p>
        </motion.section>

        {/* --- APLICACIONES QUE NECESITAS --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-[#1B3854] mb-8">Aplicaciones que necesitas</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* PAYPAL */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#1B3854]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-[#1B3854] flex items-center gap-2">
                  <CreditCard className="text-[#1B3854]" /> 1. PayPal
                </h3>
                {/* ESPACIO LOGO PAYPAL PEQUEÑO */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[8px] font-bold text-center p-1">
                  Logo<br/>PayPal
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">Debes tener una cuenta activa, los pagos solo se hacen por ahí. Si nunca has recibido transacciones, sigue estos tips:</p>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Inicia con cuenta personal, luego cambia a empresa si recibes pagos frecuentes.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Vincula cuenta bancaria y tarjeta para verificar identidad.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Retira tu dinero con frecuencia para evitar saldos congelados.</li>
                <li className="flex gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0"/> Responde rápido si alguien abre una disputa.</li>
              </ul>
            </div>

            {/* AMAZON */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border-t-4 border-[#905361]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-[#1B3854] flex items-center gap-2">
                  <Store className="text-[#905361]" /> 2. Amazon
                </h3>
                {/* ESPACIO LOGO AMAZON PEQUEÑO */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-[8px] font-bold text-center p-1">
                  Logo<br/>Amazon
                </div>
              </div>
              <p className="text-gray-600 mb-6 text-sm">Debes tener una cuenta, preferiblemente Amazon Prime para que los pedidos lleguen rápido.</p>
              
              <div className="bg-[#FDE5E5] p-5 rounded-xl border border-[#905361]/30">
                <h4 className="font-black text-[#905361] mb-2 flex items-center gap-2"><AlertTriangle size={18}/> Requisito Obligatorio</h4>
                <p className="text-sm text-[#1B3854] mb-2">Para escribir reseñas debes: <strong>Haber gastado al menos $50 en compras elegibles en los últimos 12 meses.</strong></p>
                <p className="text-xs text-gray-600 italic">Consejo: Si no lo cumples, haz compras pequeñas hasta llegar a los $50. Amazon hace esto para evitar reseñas falsas.</p>
              </div>
            </div>

          </div>
        </motion.section>

        {/* --- CÓMO CONTACTAR PROVEEDORES --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <div className="bg-[#1B3854] p-8 md:p-12 rounded-[3rem] text-white shadow-2xl">
            <h2 className="text-3xl font-black mb-6 text-[#FDE5E5]">Cómo contactar proveedores</h2>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Búscalos en Instagram (no te asustes si tienen pocos seguidores, son confiables). Si te preguntan, <strong>debes decir que vives en Estados Unidos</strong>. 
            </p>
            <p className="text-blue-100 mb-6">Envía este mensaje exacto:</p>
            
            <div className="bg-white/10 p-6 rounded-2xl border border-white/20 relative mb-8">
              <p className="font-mono text-lg leading-relaxed whitespace-pre-wrap">{scriptContacto}</p>
              <button 
                onClick={() => copyToClipboard(scriptContacto)}
                className="absolute top-4 right-4 bg-white text-[#1B3854] p-2 rounded-lg hover:bg-[#FDE5E5] transition-colors"
                title="Copiar texto"
              >
                <Copy size={20} />
              </button>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl text-sm text-blue-50">
              <p className="mb-2"><strong>La dinámica tras el mensaje:</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>El proveedor te enviará una lista de productos.</li>
                <li>Si es pago anticipado, empiezas con un solo producto.</li>
                <li>Avisas cuál escoges con captura de pantalla y te envían el link de compra.</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* --- PASOS FINALES DEL PROCESO --- */}
        <motion.section initial="hidden" whileInView="visible" variants={fadeInUp} viewport={{ once: true }}>
          <h2 className="text-3xl font-black text-[#1B3854] mb-8 text-center">Pasos Finales del Proceso</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <ShoppingBag className="text-[#905361] mx-auto mb-4" size={32} />
              <h4 className="font-bold text-[#1B3854] mb-2">Paso 1: La Compra</h4>
              <p className="text-sm text-gray-600">Escoges el producto de la lista y lo compras con el enlace que te compartieron.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative">
              <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 hidden md:block">→</div>
              <ImageIcon className="text-[#1B3854] mx-auto mb-4" size={32} />
              <h4 className="font-bold text-[#1B3854] mb-2">Paso 2: La Captura</h4>
              <p className="text-sm text-gray-600">En el detalle de compra toma un screenshot donde se vea: <strong>Número de orden</strong> y <strong>Valor del producto</strong>.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center relative">
              <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 text-gray-300 hidden md:block">→</div>
              <Star className="text-yellow-500 mx-auto mb-4" size={32} />
              <h4 className="font-bold text-[#1B3854] mb-2">Paso 3: La Reseña</h4>
              <p className="text-sm text-gray-600">Cuando llegue, Amazon te pedirá calificar. Haz la reseña de <strong>4 o 5 estrellas</strong>.</p>
            </div>
          </div>

          <div className="mt-10 bg-[#FDE5E5] p-8 rounded-3xl text-center">
            <h3 className="text-xl font-bold text-[#905361] mb-2">El Reembolso</h3>
            <p className="text-[#1B3854]">
              En máximo 2 días Amazon publicará la reseña. El proveedor la verifica y <strong>te hace el reembolso por PayPal en 3 o 4 días.</strong>
            </p>
          </div>
        </motion.section>

      </main>

      <footer className="mt-24 text-center text-[#1B3854]">
          <p className="text-sm font-bold uppercase tracking-widest opacity-30">@Darlisfv • Amazon Reseñas</p>
      </footer>

      </div>
    </>
  );
};

export default AmazonResenas;
