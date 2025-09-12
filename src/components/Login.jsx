import { FaSignInAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { toast } from 'react-toastify';
import { login, reset } from '../features/auth/authSlice.js';
import Spinner from './Spinner.jsx';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess || user) {
      navigate('/');
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };
  
  // A small inline spinner can be used inside the button
  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1><FaSignInAlt /> Login</h1>
        <p>Login and start managing your tasks</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              placeholder='Enter your email'
              onChange={onChange}
              required
            />
          </div>

          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter password'
              onChange={onChange}
              required
            />
          </div>

          <div className='form-group'>
            <button type='submit' className='btn btn-block' disabled={isLoading}>
              Submit
            </button>
          </div>
        </form>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/forgotpassword">Forgot Password?</Link>
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>

      </section>
    </>
  );
};

export default Login;