import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import { toast } from "react-hot-toast";
// Iconos modernos
import { User, Camera, Save, FileText, Mail, Loader2 } from "lucide-react";

function ProfilePage() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || "",
      });
      setPreview(user.avatar);
    }
  }, [user]);

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
    const loadingToast = toast.loading("Guardando cambios...");

    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      if (file) {
        data.append("image", file);
      }

      await axios.put("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Recargar para actualizar datos globales (o usar una función updateContext si existiera)
      window.location.reload(); 
      
      toast.dismiss(loadingToast);
      toast.success("¡Perfil actualizado con éxito!");

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error(error);
      toast.error("Ocurrió un error al actualizar");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[80vh] flex flex-col justify-center">
      
      {/* Header Visual */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold text-[#1B3854]">Mi Perfil</h1>
        <p className="text-gray-500">Administra tu información personal y cómo te ven los demás.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
        
        {/* COLUMNA IZQUIERDA: FOTO DE PERFIL (Estilo Tarjeta) */}
        <div className="md:w-1/3 bg-[#1B3854] p-10 text-white flex flex-col items-center justify-center relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-full h-full bg-[#905361] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative group">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative bg-gray-200">
                    <img 
                        src={preview || "https://via.placeholder.com/150"} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                    />
                </div>
                
                {/* Botón flotante de cámara */}
                <label className="absolute bottom-2 right-2 bg-[#905361] p-3 rounded-full text-white cursor-pointer hover:bg-[#FDE5E5] hover:text-[#905361] transition-all shadow-lg transform hover:scale-110 border-2 border-[#1B3854]">
                    <Camera size={20} />
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>

            <h2 className="mt-6 text-xl font-bold">{user?.username || "Usuario"}</h2>
            <p className="text-blue-200 text-sm uppercase tracking-widest font-medium">
                {user?.role === 'admin' ? 'Administradora' : 'Estudiante'}
            </p>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="md:w-2/3 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Nombre de Usuario */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] outline-none transition"
                            placeholder="Tu nombre visible"
                        />
                    </div>
                </div>

                {/* Email (Solo lectura para referencia) */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Correo Electrónico</label>
                    <div className="relative opacity-70">
                        <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={user?.email || ""}
                            disabled
                            className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed text-gray-500"
                        />
                    </div>
                </div>

                {/* Biografía */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Biografía / Acerca de ti</label>
                    <div className="relative">
                        <FileText className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <textarea 
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="4"
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361]/50 focus:border-[#905361] outline-none transition resize-none"
                            placeholder="Comparte algo inspirador..."
                        ></textarea>
                    </div>
                </div>

                {/* Botón Guardar */}
                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-[#905361] text-white px-8 py-3 rounded-xl hover:bg-[#5E2B35] font-bold transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;