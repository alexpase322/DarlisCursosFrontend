import { createContext, useState, useContext, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Empezamos cargando

  // Función auxiliar para guardar datos
  const saveSession = (userData) => {
    localStorage.setItem("token", userData.token);
    // Guardamos el usuario como string para recuperarlo luego
    localStorage.setItem("user", JSON.stringify(userData)); 
    setUser(userData);
    setIsAuthenticated(true);
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post("/auth/register", userData);
      saveSession(res.data); // Usamos la nueva función
      toast.success("¡Registro exitoso!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al registrarse");
    }
  };

  const login = async (userData) => {
    try {
      const res = await axios.post("/auth/login", userData);
      saveSession(res.data); // Usamos la nueva función
      toast.success(`Bienvenido ${res.data.username}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al iniciar sesión");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Limpiamos usuario también
    setUser(null);
    setIsAuthenticated(false);
  };

  // VERIFICACIÓN AL RECARGAR (Aquí estaba el fallo)
  useEffect(() => {
    const checkLogin = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Petición al backend para verificar token y traer datos frescos
        const res = await axios.get("/auth/profile");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (error) {
        // Si el token expiró o es falso, limpiamos todo
        console.log("Token inválido o expirado");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};