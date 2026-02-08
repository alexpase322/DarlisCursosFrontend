import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
// Iconos modernos
import { Mail, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";

function LoginPage() {
  const { login, isAuthenticated, errors } = useAuth(); // Asumiendo que errors viene del context, si no, lo manejamos local
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);

  // Redirección segura dentro de useEffect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) return;

    setLoading(true);
    // Asumimos que login maneja sus propios errores/toasts internamente o devuelve una promesa
    try {
        await login(formData);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EF] p-4 relative overflow-hidden">
      
      {/* Decoración de fondo (Círculos difuminados) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1B3854] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      {/* Botón Volver al Home */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-[#1B3854] font-bold hover:text-[#905361] transition z-10">
        <ArrowLeft size={20} /> <span className="hidden sm:inline">Volver al inicio</span>
      </Link>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 backdrop-blur-sm">
        
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1B3854] mb-2">Bienvenida de nuevo</h1>
            <p className="text-gray-500">Ingresa tus datos para continuar aprendiendo.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-[#1B3854] mb-2 ml-1">Correo Electrónico</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" size={20} />
                </div>
                <input
                    type="email"
                    name="email"
                    placeholder="ejemplo@correo.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all text-gray-700"
                    onChange={handleChange}
                    required
                />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
                <label className="text-sm font-bold text-[#1B3854]">Contraseña</label>
                <Link to="/forgot-password" className="text-xs text-[#905361] hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
            </div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400" size={20} />
                </div>
                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all text-gray-700"
                    onChange={handleChange}
                    required
                />
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1B3854] text-white font-bold py-3.5 rounded-xl hover:bg-[#2a4d6e] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <Loader2 className="animate-spin" size={20} />
            ) : (
                <>
                    Ingresar <ArrowRight size={20} />
                </>
            )}
          </button>
        </form>

        {/* Footer del Form */}
        <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
                ¿Aún no tienes cuenta?{' '}
                <a 
                    href="https://wa.me/573177644289?text=Hola,%20me%20gustaría%20solicitar%20acceso%20a%20la%20plataforma." 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#905361] font-bold cursor-pointer hover:underline"
                >
                    Contacta al administrador
                </a>
            </p>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;