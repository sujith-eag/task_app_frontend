import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/users/`;

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData)
  // No LONGER NEEDED as NO User Created When Registered
  // if (response.data) {
  //   localStorage.setItem('user', JSON.stringify(response.data)) }  
  return response.data
}


// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Verify user email
const verifyEmail = async (token) => {
  const response = await axios.get(API_URL + 'verifyemail/' + token);
  return response.data;
};


// --- NEW PASSWORD RESET FUNCTIONS ---

// Request a password reset token
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + 'forgotpassword', userData)
  // The backend will return a success message
  return response.data
}

// Reset password using the token
const resetPassword = async (resetData) => {
  const response = await axios.put(
    API_URL + 'resetpassword/' + resetData.token,
    {
      password: resetData.password,
      confirmPassword: resetData.confirmPassword,
    }
  );
  return response.data;
};

const authService = {
  register,
  logout,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
}

export default authService