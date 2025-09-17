// App.jsx
import Header from './components/layout/Header.jsx';
import Footer from "./components/layout/Footer.jsx";
import PrivateRoute from './components/layout/PrivateRoute.jsx';

import Dashboard from './pages/Dashboard.jsx';
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'; 
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import FilesPage from './pages/FilePage.jsx';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';


function App() {
  return (
    <>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Header /> 

        <Box component="main" sx={{ flexGrow: 1 }}>

          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
            <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />

            <Route path="/dashboard" element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
            <Route path='/profile' element={<PrivateRoute />}>
                <Route path='/profile' element={<ProfilePage />} />
            </Route>

            <Route path='/files' element={<PrivateRoute />}>
                <Route path='/files' element={<FilesPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </Box>    
        
        <Footer />
        </Box>
      </Router>
      <ToastContainer 
        position="bottom-center"
        autoClose={2000} // 2 seconds
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