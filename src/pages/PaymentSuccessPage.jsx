import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Clock, Copy, Receipt, Camera, Mail, AlertTriangle, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id") || "REF-MANUAL-" + Math.floor(Math.random() * 10000);
  
  // Fecha actual para la factura
  const today = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' 
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] py-12 px-4 flex justify-center items-center font-sans">
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full grid md:grid-cols-2 gap-8"
      >

        {/* --- COLUMNA IZQUIERDA: FACTURA VIRTUAL --- */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative">
            {/* Decoración superior (Ticket zig-zag simulado con borde) */}
            <div className="h-4 bg-[#1B3854] w-full"></div>
            
            <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1B3854] flex items-center gap-2">
                            MomsDigitales<span className="text-[#905361] text-4xl">.</span>
                        </h2>
                        <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Comprobante de Pago</p>
                    </div>
                    <div className="bg-green-100 text-green-700 p-2 rounded-full">
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
                        <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Procesado</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-gray-200 pb-2">
                        <span>Referencia:</span>
                        <span className="font-mono text-xs">{sessionId.slice(0, 15)}...</span>
                    </div>
                </div>

                {/* Total */}
                <div className="bg-[#F7F2EF] p-4 rounded-xl flex justify-between items-center mb-2">
                    <span className="font-bold text-[#1B3854]">Total Pagado</span>
                    {/* Nota: En un caso real, podrías traer el monto del backend usando el session_id */}
                    <span className="text-xl font-extrabold text-[#1B3854]">Suscripción Premium</span>
                </div>
                <p className="text-center text-xs text-gray-400 mb-6">Gracias por invertir en tu futuro.</p>

                {/* Botón de Imprimir/Guardar (Decorativo) */}
                <button 
                    onClick={() => window.print()}
                    className="w-full border-2 border-dashed border-gray-300 text-gray-500 py-2 rounded-xl hover:border-[#1B3854] hover:text-[#1B3854] transition flex justify-center gap-2 items-center text-sm font-bold"
                >
                    <Receipt size={16} /> Guardar Comprobante
                </button>
            </div>
        </div>

        {/* --- COLUMNA DERECHA: INSTRUCCIONES DE ACTIVACIÓN --- */}
        <div className="flex flex-col justify-center">
            
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-[#1B3854] mb-2">¡Casi terminamos! 🚀</h1>
                <p className="text-gray-500">
                    Tu pago ha sido recibido por el sistema. Para activar tu acceso completo y asignarte al grupo correcto, necesitamos un último paso.
                </p>
            </div>

            {/* TARJETA DE ACCIÓN REQUERIDA */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-xl shadow-sm mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <AlertTriangle size={100} className="text-amber-500" />
                </div>
                
                <h3 className="font-bold text-amber-800 text-lg flex items-center gap-2 mb-4">
                    <Mail size={20} /> Acción Requerida
                </h3>

                <ol className="space-y-4 text-sm text-amber-900 list-decimal pl-4 relative z-10">
                    <li>
                        <span className="font-bold">Toma una captura de pantalla</span> de la factura que ves a la izquierda (o del correo que te envió Stripe).
                    </li>
                    <li>
                        Envía la captura al siguiente correo:
                        <div className="flex items-center gap-2 mt-1 bg-white p-2 rounded border border-amber-200">
                            <span className="font-mono text-amber-700 font-bold">pagos@momsdigitales.com</span>
                            <button onClick={() => copyToClipboard("pagos@momsdigitales.com")} className="text-amber-500 hover:text-amber-700">
                                <Copy size={16} />
                            </button>
                        </div>
                    </li>
                    <li>
                        <span className="font-bold">IMPORTANTE:</span> El correo debe ser enviado desde la misma dirección de email con la que crearás tu cuenta.
                    </li>
                </ol>
            </div>

            {/* TIEMPO DE ESPERA */}
            <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 mb-8">
                <Clock className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">Tiempo de Activación</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Nuestro equipo validará tu pago manualmente. Tu cuenta quedará activa en un lapso de <span className="font-bold">24 a 48 horas hábiles</span>.
                    </p>
                </div>
            </div>

            {/* BOTONES */}
            <div className="flex gap-4">
                <Link 
                    to="/dashboard" 
                    className="flex-1 bg-[#1B3854] text-white py-3.5 rounded-xl font-bold text-center hover:bg-[#2a4d6e] transition shadow-lg flex justify-center items-center gap-2"
                >
                    Ir al Dashboard <ArrowRight size={18} />
                </Link>
                <Link 
                    to="/" 
                    className="px-6 py-3.5 border border-gray-300 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                    Volver
                </Link>
            </div>

        </div>

      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;