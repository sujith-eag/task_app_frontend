// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

// --- Layout Components ---
import Header from './components/layout/Header.jsx';
import Footer from "./components/layout/Footer.jsx";
import PrivateRoute from './components/layout/PrivateRoute.jsx';

// --- Page Components ---
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'; 
import VerifyEmailPage from './pages/VerifyEmailPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// General Private Pages
import Dashboard from './pages/Dashboard.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FilesPage from './pages/FilePage.jsx';
import ChatPage from './pages/ChatPage.jsx';

// --- ROLE-SPECIFIC PAGES ---
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import ReportingPage from './pages/ReportingPage.jsx';


function App() {
  return (
    <>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Header /> 

        {/* <Box component="main" sx={{ flexGrow: 1 }}> */}
          <Box component="main" sx={{ flexGrow: 1, py: 3, px: { xs: 2, md: 4 } }}>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
            <Route path='/verifyemail/:token' element={<VerifyEmailPage />} />

            {/* --- General Private Routes (Accessible to all logged-in users) --- */}
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/files' element={<FilesPage />} />
              <Route path='/chat' element={<ChatPage />} />
            </Route>

              {/* --- Student-Specific Routes --- */}
              <Route element={<PrivateRoute roles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
              </Route>

              {/* --- Teacher-Specific Routes --- */}
              <Route element={<PrivateRoute roles={['teacher']} />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
              </Route>
              
              {/* --- Admin-Specific Routes --- */}
              <Route element={<PrivateRoute roles={['admin', 'hod']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/reporting" element={<ReportingPage />} />
              </Route>

            {/* --- Catch-all 404 Route --- */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </Box>    
        
        <Footer />
        </Box>
      </Router>
      <ToastContainer 
        position="bottom-center"
        autoClose={2500} // 2.5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
}

export default App;