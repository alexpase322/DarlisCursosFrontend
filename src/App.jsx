import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from './layout/Layout'; // <--- Importamos
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateCoursePage from "./pages/admin/CreateCoursePage";
import CourseManager from "./pages/admin/CourseManager";
import StudentDashboard from "./pages/student/StudentDashboard";
import CourseViewer from "./pages/student/CourseViewer";
import SetupAccount from './pages/SetupAccount'; 
import InviteUser from './pages/admin/InviteUser';
import WallPage from "./pages/WallPage";
import ChatPage from './pages/ChatPage';
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import HomePage from './pages/HomePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
// Placeholders

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Routes>
            {/* Rutas Públicas (Sin Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/setup-account/:token" element={<SetupAccount />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            {/* Rutas Privadas (CON Layout) */}
            <Route element={<ProtectedRoute />}>
              
              {/* Envolvemos todo en el Layout Visual */}
              <Route element={<Layout />}> 
                 <Route path="/dashboard" element={<StudentDashboard />} />
                 <Route path="/perfil" element={<ProfilePage />} />
                 <Route path="/muro" element={<WallPage />} />
                 <Route path="/chat" element={<ChatPage />} />
                 <Route path="/course/:id" element={<CourseViewer />} />
                 
                 {/* Rutas Admin anidadas */}
                 <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/create-course" element={<CreateCoursePage />} /> 
                    <Route path="/admin/crear-usuario" element={<RegisterPage />} />
                    <Route path="/admin/course/:id" element={<CourseManager />} />
                    <Route path="/admin/invite" element={<InviteUser />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                </Route>
              </Route>

            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;