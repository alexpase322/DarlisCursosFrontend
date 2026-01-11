import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { Mail, ArrowLeft, Send, Loader2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Llamada al endpoint que creamos en el backend
      await axios.post("/auth/forgot-password", { email });
      
      toast.success("Correo enviado. Revisa tu bandeja de entrada (y spam).", {
        duration: 5000,
      });
      
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error al enviar correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EF] p-4 relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3854] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 backdrop-blur-sm">
        
        {/* Botón Volver */}
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-[#1B3854] mb-6 transition text-sm font-medium">
            <ArrowLeft size={16} /> Volver al Login
        </Link>

        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#1B3854] mb-2">¿Olvidaste tu contraseña?</h1>
            <p className="text-gray-500 text-sm">No te preocupes. Ingresa tu correo y te enviaremos las instrucciones para recuperarla.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-[#1B3854] mb-2 ml-1">Correo Electrónico</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="email"
                        placeholder="ejemplo@correo.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3854] text-white font-bold py-3.5 rounded-xl hover:bg-[#2a4d6e] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                {loading ? "Enviando..." : "Enviar Enlace"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;