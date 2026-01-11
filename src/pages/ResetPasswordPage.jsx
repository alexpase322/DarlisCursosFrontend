import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
import { Lock, Loader2, CheckCircle } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwords.password !== passwords.confirmPassword) {
        return toast.error("Las contraseñas no coinciden");
    }
    if (passwords.password.length < 6) {
        return toast.error("La contraseña debe tener al menos 6 caracteres");
    }

    setLoading(true);
    try {
      await axios.put(`/auth/reset-password/${token}`, { 
          password: passwords.password 
      });
      
      toast.success("¡Contraseña actualizada! Inicia sesión ahora.");
      navigate("/login");
      
    } catch (error) {
      toast.error(error.response?.data?.message || "El enlace es inválido o ha expirado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EF] p-4 relative overflow-hidden">
      
      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 backdrop-blur-sm">
        
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#1B3854] mb-2">Nueva Contraseña</h1>
            <p className="text-gray-500 text-sm">Ingresa una nueva contraseña segura para tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nueva Contraseña */}
            <div>
                <label className="block text-sm font-bold text-[#1B3854] mb-2 ml-1">Nueva Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all"
                        value={passwords.password}
                        onChange={(e) => setPasswords({...passwords, password: e.target.value})}
                        required
                    />
                </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
                <label className="block text-sm font-bold text-[#1B3854] mb-2 ml-1">Confirmar Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1B3854] text-white font-bold py-3.5 rounded-xl hover:bg-[#2a4d6e] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;