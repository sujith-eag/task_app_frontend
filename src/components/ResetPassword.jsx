import { useState, useEffect } from 'react';
import { FaKey } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword, reset } from '../features/auth/authSlice';
import Spinner from './Spinner';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    password2: '',
  });
  const { password, password2 } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams(); // Gets the token from the URL parameter

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success(message || 'Password has been reset successfully!');
      navigate('/login');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else {
      dispatch(resetPassword({ token, password }));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className='heading'>
        <h1><FaKey /> Reset Password</h1>
        <p>Enter your new password below</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              placeholder='Enter new password'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password2'
              name='password2'
              value={password2}
              placeholder='Confirm new password'
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Set New Password
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default ResetPassword;

