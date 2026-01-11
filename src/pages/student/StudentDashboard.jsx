import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
// Iconos modernos
import { BookOpen, PlayCircle, ArrowRight, Search, Clock } from "lucide-react";

function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error al cargar cursos");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[50vh] text-[#905361]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-current"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-100 pb-6">
        <div>
            <h1 className="text-4xl font-bold text-[#1B3854] mb-2">Mis Cursos</h1>
            <p className="text-gray-500 text-lg">Continúa construyendo tu futuro hoy.</p>
        </div>
        
        {/* Barra de búsqueda decorativa (opcional, funcional si quieres implementarla luego) */}
        <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar en mis cursos..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#905361]/20 focus:border-[#905361] transition-all"
            />
        </div>
      </div>

      {/* GRID DE CURSOS */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="w-20 h-20 bg-[#FDE5E5] text-[#905361] rounded-full flex items-center justify-center mb-6">
            <BookOpen size={40} />
          </div>
          <h2 className="text-2xl font-bold text-[#1B3854] mb-2">No tienes cursos disponibles</h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Parece que aún no hay contenido asignado. Contacta al administrador o espera a que se publiquen nuevos cursos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div 
                key={course._id} 
                className="group bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1"
            >
              {/* Portada con Overlay */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img 
                  src={course.thumbnail || "https://via.placeholder.com/300?text=Curso"} 
                  alt={course.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/300?text=Error+Imagen"; }}
                />
                
                {/* Overlay oscuro al hover */}
                <div className="absolute inset-0 bg-[#1B3854]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link to={`/course/${course._id}`} className="bg-white text-[#1B3854] p-3 rounded-full transform scale-50 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <PlayCircle size={32} fill="#1B3854" className="text-white" />
                    </Link>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-grow relative">
                
                {/* Etiqueta flotante */}
                <div className="absolute -top-4 right-6 bg-white py-1 px-3 rounded-full shadow-sm border border-gray-100 text-xs font-bold text-[#905361] flex items-center gap-1">
                    <BookOpen size={12} />
                    {course.modules?.length || 0} Módulos
                </div>

                <h3 className="font-bold text-xl text-[#1B3854] mb-2 leading-tight group-hover:text-[#905361] transition-colors">
                    {course.title}
                </h3>
                
                <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {course.description}
                </p>
                
                <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                        <Clock size={14} />
                        <span>A tu ritmo</span>
                    </div>

                    <Link 
                      to={`/course/${course._id}`} 
                      className="flex items-center gap-2 text-sm font-bold text-[#1B3854] group-hover:text-[#905361] transition-colors"
                    >
                      Ver Clases <ArrowRight size={16} />
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudentDashboard;