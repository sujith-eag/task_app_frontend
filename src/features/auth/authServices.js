import axios from 'axios'

const API_URL = '/api/users/'
// const API_URL = 'https://task-app-backend-8j57.onrender.com/api/users/'


// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
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


// --- NEW PASSWORD RESET FUNCTIONS ---

// Request a password reset token
const forgotPassword = async (userData) => {
  const response = await axios.post(API_URL + 'forgotpassword', userData)
  // The backend will return a success message
  return response.data
}

// Reset password using the token
const resetPassword = async (resetData) => {
  const response = await axios.put(API_URL + 'resetpassword/' + resetData.token, {
    password: resetData.password,
  })
  // The backend will return a success message
  return response.data
}

const authService = {
  register,
  logout,
  login,
  forgotPassword,
  resetPassword,
}

export default authService