import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';
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
import BluePrintAgency from './pages/BluePrintAgency';
import MetodoADN from './pages/MetodoADN';
import GuiaPrimerIngreso from './pages/GuiaPrimerIngreso';
import PilaresContenido from './pages/PilaresContenido';
import MemoriaEmocional from './pages/MemoriaEmocional';
import AmazonResenas from './pages/AmazonResenas';
import AmazonInfluencerGuide from './pages/AmazonInfluencerGuide';
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard';
import PartnerApply from './pages/affiliate/PartnerApply';
import PartnerRoute from './components/PartnerRoute';
import AffiliatesCRM from './pages/admin/AffiliatesCRM';
import AffiliateDetail from './pages/admin/AffiliateDetail';
import CommissionsPage from './pages/admin/CommissionsPage';
import PartnerApplicationsPage from './pages/admin/PartnerApplicationsPage';
import SubscriptionsPanel from './pages/admin/SubscriptionsPanel';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 font-sans">
          <Analytics />
          <Routes>
            {/* Rutas Públicas (Sin Layout) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/agencia" element={<BluePrintAgency />} />
            <Route path="/metodo-adn" element={<MetodoADN />} />
            <Route path="/setup-account/:token" element={<SetupAccount />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/guia-ingreso" element={<GuiaPrimerIngreso />} />
            <Route path="/pilares-contenido" element={<PilaresContenido />} />
            <Route path="/memoria-emocional" element={<MemoriaEmocional />} />
            <Route path="/amazon-resenas" element={<AmazonResenas />} />
            <Route path="/amazon-influencer" element={<AmazonInfluencerGuide />} />
            {/* Rutas Privadas (CON Layout) */}
            <Route element={<ProtectedRoute />}>
              
              {/* Envolvemos todo en el Layout Visual */}
              <Route element={<Layout />}> 
                 <Route path="/dashboard" element={<StudentDashboard />} />
                 <Route path="/perfil" element={<ProfilePage />} />
                 <Route path="/muro" element={<WallPage />} />
                 <Route path="/chat" element={<ChatPage />} />
                 <Route path="/course/:id" element={<CourseViewer />} />

                 {/* Rutas de afiliada */}
                 <Route path="/afiliada/aplicar" element={<PartnerApply />} />
                 <Route element={<PartnerRoute />}>
                    <Route path="/afiliada" element={<AffiliateDashboard />} />
                 </Route>

                 {/* Rutas Admin anidadas */}
                 <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/create-course" element={<CreateCoursePage />} /> 
                    <Route path="/admin/crear-usuario" element={<RegisterPage />} />
                    <Route path="/admin/course/:id" element={<CourseManager />} />
                    <Route path="/admin/invite" element={<InviteUser />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/afiliadas" element={<AffiliatesCRM />} />
                    <Route path="/admin/afiliadas/:id" element={<AffiliateDetail />} />
                    <Route path="/admin/comisiones" element={<CommissionsPage />} />
                    <Route path="/admin/solicitudes-partner" element={<PartnerApplicationsPage />} />
                    <Route path="/admin/suscripciones" element={<SubscriptionsPanel />} />
                </Route>
              </Route>

            </Route>
          </Routes>
          <Toaster position="top-right" />
          <SpeedInsights />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;