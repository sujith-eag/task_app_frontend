// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Import the Container component from MUI
import { Container, Box } from '@mui/material';

import Landing from "./components/Landing.jsx";
import Header from './components/Header.jsx';
import Footer from "./components/Footer.jsx";
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx';
import ResetPassword from './components/ResetPassword.jsx'; 
import PrivateRoute from './components/PrivateRoute.jsx';  

function App() {
  return (
    <>
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Header /> 

        <Box component="main" sx={{ flexGrow: 1 }}>

          <Routes>
            <Route path="/" element={<Landing />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            <Route path="/dashboard" element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </Box>    
        
        <Footer />
        </Box>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;