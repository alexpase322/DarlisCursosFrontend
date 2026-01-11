import { useState } from 'react';
import axios from '../api/axios'; 
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
// Iconos modernos
import { Camera, User, Lock, CheckCircle, Loader2, Upload } from "lucide-react";

const SetupAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [file, setFile] = useState(null); 
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const loadingToast = toast.loading("Configurando tu espacio...");

    try {
      const data = new FormData();
      data.append('username', formData.username); 
      data.append('password', formData.password);
      
      if (file) {
        data.append('image', file); 
      }

      await axios.post(`/auth/complete-profile/${token}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss(loadingToast);
      toast.success("¡Bienvenida al equipo!");
      
      navigate('/login'); 

    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      const msg = error.response?.data?.message || "Error configurando tu cuenta.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2EF] p-4 relative overflow-hidden">
      
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#905361] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#1B3854] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

      <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-white/50 backdrop-blur-sm">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1B3854]">¡Hola! 👋</h2>
          <p className="text-gray-500 mt-2">Termina de configurar tu perfil para empezar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Carga de Avatar Estilizada */}
          <div className="flex flex-col items-center group">
            <div className="relative w-32 h-32">
              <div className={`w-full h-full rounded-full overflow-hidden border-4 shadow-md flex items-center justify-center transition-colors ${preview ? 'border-[#905361]' : 'border-white bg-gray-100'}`}>
                {preview ? (
                  <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-[#1B3854] p-2.5 rounded-full text-white cursor-pointer hover:bg-[#905361] shadow-lg transition-all transform hover:scale-110 border-2 border-white">
                <Camera size={18} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <span className="text-xs font-bold text-gray-400 mt-3 uppercase tracking-wide">Foto de Perfil</span>
          </div>

          {/* Inputs con Iconos */}
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-[#1B3854] mb-1 ml-1">Nombre Completo</label>
                <div className="relative">
                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                        type="text"
                        name="username"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all"
                        placeholder="Ej. María García"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-[#1B3854] mb-1 ml-1">Crear Contraseña</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    <input
                        type="password"
                        name="password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] transition-all"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#905361] text-white font-bold py-3.5 rounded-xl hover:bg-[#5E2B35] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    Configurando...
                </>
            ) : (
                <>
                    Completar Registro <CheckCircle size={20} />
                </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default SetupAccount;