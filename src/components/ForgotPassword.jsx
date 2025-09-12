import { useState, useEffect } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword, reset } from '../features/auth/authSlice';
import Spinner from './Spinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    // On success, show a message and redirect the user
    if (isSuccess) {
      toast.success(message || 'Password reset link sent to your email!');
      navigate('/login');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email }));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1><FaEnvelope /> Forgot Password</h1>
        <p>Enter your email to receive a reset link</p>
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
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Send Reset Link
            </button>
          </div>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/login">Back to Login</Link>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
