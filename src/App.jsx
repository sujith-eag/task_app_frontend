import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header.jsx';
import Dashboard from './components/Dashboard.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ForgotPassword from './components/ForgotPassword.jsx'; // New
import ResetPassword from './components/ResetPassword.jsx';   // New
import PrivateRoute from './components/PrivateRoute.jsx';   // New

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
              {/* You can add more protected routes here later, e.g., /profile */}
            </Route>
            
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;