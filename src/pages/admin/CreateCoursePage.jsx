import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
// Iconos Lucide
import { ArrowLeft, UploadCloud, Type, FileText, Image as ImageIcon, Save, X } from "lucide-react";

function CreateCoursePage() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // Para ver la imagen antes de subirla
  const [loading, setLoading] = useState(false);

  // Manejar cambio de archivo para generar preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title || !formData.description) return toast.error("Completa los campos obligatorios");

    setLoading(true);
    const loadingToast = toast.loading("Creando curso...");

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      if (file) data.append("thumbnail", file);

      await axios.post("/courses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss(loadingToast);
      toast.success("¡Curso creado exitosamente!");
      navigate("/admin"); 
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error al crear el curso");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F2EF] p-6 flex justify-center items-center">
      
      <div className="max-w-3xl w-full">
        {/* Botón Volver */}
        <Link to="/admin" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1B3854] mb-6 transition font-medium">
            <ArrowLeft size={20} /> Cancelar y volver
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            
            {/* Header del Formulario */}
            <div className="bg-[#1B3854] p-8 text-white">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <span className="bg-[#905361] p-2 rounded-lg"><ImageIcon size={24} /></span>
                    Crear Nuevo Curso
                </h1>
                <p className="text-blue-100 mt-2 ml-1">Empieza a construir tu legado educativo.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                
                {/* 1. TÍTULO */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Título del Curso</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Type className="text-gray-400" size={20} />
                        </div>
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                            placeholder="Ej: Marketing Digital para Principiantes"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                    </div>
                </div>

                {/* 2. DESCRIPCIÓN */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Descripción</label>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="text-gray-400" size={20} />
                        </div>
                        <textarea 
                            rows="4"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#905361] focus:border-transparent outline-none transition bg-gray-50 focus:bg-white resize-none"
                            placeholder="Describe de qué trata el curso y qué aprenderán..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>
                </div>

                {/* 3. SUBIDA DE IMAGEN (Drag & Drop visual) */}
                <div>
                    <label className="block text-sm font-bold text-[#1B3854] mb-2">Portada del Curso</label>
                    
                    {!preview ? (
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-[#FDE5E5]/30 hover:border-[#905361] transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-12 h-12 text-gray-400 group-hover:text-[#905361] transition-colors mb-3" />
                                <p className="mb-2 text-sm text-gray-500 group-hover:text-[#1B3854]"><span className="font-semibold">Haz clic para subir</span></p>
                                <p className="text-xs text-gray-400">PNG, JPG o WEBP (MAX. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                        </label>
                    ) : (
                        <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-gray-200 group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            {/* Overlay para cambiar imagen */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button 
                                    type="button"
                                    onClick={removeImage} 
                                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition shadow-lg transform hover:scale-110"
                                    title="Quitar imagen"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTÓN SUBMIT */}
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-[#905361] text-white font-bold py-4 rounded-xl hover:bg-[#5E2B35] transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Creando...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Publicar Curso
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCoursePage;