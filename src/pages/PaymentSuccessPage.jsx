import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Receipt, Mail, ArrowRight, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "REF-" + Math.floor(Math.random() * 1000000);
  
  // Fecha actual para la factura
  const today = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' 
  });

  return (
    <div className="min-h-screen bg-[#F7F2EF] py-12 px-6 flex justify-center items-center font-sans selection:bg-[#905361] selection:text-white">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full grid md:grid-cols-2 gap-10"
      >

        {/* --- COLUMNA IZQUIERDA: FACTURA VIRTUAL --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative h-fit">
            {/* Decoración superior */}
            <div className="h-4 bg-[#1B3854] w-full"></div>
            
            <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1B3854] flex items-center gap-1">
                            MomsDigitales<span className="text-[#905361] text-4xl leading-none">.</span>
                        </h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Comprobante de Pago</p>
                    </div>
                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <CheckCircle size={32} />
                    </div>
                </div>

                {/* Detalles de la Transacción */}
                <div className="space-y-4 text-sm text-gray-600 mb-8">
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span>Fecha:</span>
                        <span className="font-bold text-[#1B3854]">{today}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span>Estado:</span>
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Aprobado</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span>Referencia Stripe:</span>
                        <span className="font-mono text-xs">{sessionId.slice(0, 15)}...</span>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-[#F7F2EF] p-4 rounded-xl flex justify-between items-center mb-4 border border-[#1B3854]/10">
                    <span className="font-bold text-[#1B3854]">Membresía</span>
                    <span className="text-lg font-extrabold text-[#905361]">Premium Activa</span>
                </div>
                <p className="text-center text-xs text-gray-400 mb-6">Gracias por invertir en tu futuro digital.</p>

                {/* Botón de Imprimir/Guardar */}
                <button 
                    onClick={() => window.print()}
                    className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-3 rounded-xl hover:border-[#1B3854] hover:text-[#1B3854] transition flex justify-center gap-2 items-center text-sm font-bold"
                >
                    <Receipt size={18} /> Guardar Comprobante
                </button>
            </div>
        </div>

        {/* --- COLUMNA DERECHA: INSTRUCCIONES DE ACTIVACIÓN --- */}
        <div className="flex flex-col justify-center">
            
            <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-bold text-xs uppercase tracking-widest mb-4">
                  Pago Exitoso 🎉
                </div>
                <h1 className="text-4xl font-black text-[#1B3854] mb-4 tracking-tight">¡Bienvenida a la membresía!</h1>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Tu pago ha sido procesado correctamente. Nuestro sistema ya está preparando tu espacio de trabajo.
                </p>
            </div>

            {/* TARJETA DE CORREO (INSTRUCCIÓN PRINCIPAL) */}
            <div className="bg-[#1B3854] p-6 rounded-2xl shadow-lg mb-6 relative overflow-hidden text-white">
                <Mail className="absolute -top-4 -right-4 text-white/5" size={120} />
                <h3 className="font-bold text-lg flex items-center gap-3 mb-3 relative z-10 text-[#FDE5E5]">
                    <Mail size={24} /> Revisa tu bandeja de entrada
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed relative z-10">
                    En <strong className="text-white">24 horas o menos</strong> recibirás un correo electrónico oficial con tu <strong>enlace de invitación exclusivo</strong> para crear tu usuario y acceder a toda la plataforma. (No olvides revisar la carpeta de Spam).
                </p>
            </div>

            {/* TARJETA DE WHATSAPP (LLAMADO A LA ACCIÓN) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold text-[#1B3854] text-lg flex items-center gap-2 mb-2">
                    Únete a la Comunidad 🚀
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Mientras llega tu acceso a la plataforma, únete a nuestro grupo privado de WhatsApp para presentarte y no perderte ningún anuncio.
                </p>
                <a 
                    href="https://chat.whatsapp.com/JAwyMpcAIY9HnQwV6xttMD" // <--- REEMPLAZA ESTO CON TU LINK
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-center hover:bg-[#1DA851] transition shadow-md flex justify-center items-center gap-2"
                >
                    <MessageCircle size={20} /> Unirme al grupo de WhatsApp
                </a>
            </div>

            {/* BOTÓN VOLVER */}
            <Link 
                to="/" 
                className="flex items-center justify-center gap-2 text-gray-500 font-bold hover:text-[#1B3854] transition"
            >
                Volver a la página principal <ArrowRight size={16} />
            </Link>

        </div>

      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;