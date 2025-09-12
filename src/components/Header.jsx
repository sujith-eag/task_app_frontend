import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import { logout, reset as resetAuth } from '../features/auth/authSlice.js'
import { reset as resetTasks } from '../features/tasks/taskSlice.js' // Import task reset

const Header = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(resetAuth()) // Reset auth state
        dispatch(resetTasks()) // Reset task state
        navigate('/login')
    }
    
    return (
    <header className='header'>
        <div className="logo">
            <Link to='/'>Task Creator</Link>
        </div>
        
        <ul>
            { user ? (
                <>
                    {user.role === 'admin' && (
                        <li>
                            <Link to='/admin'>Admin</Link>
                        </li>
                    )}
                    <li>
                        <button className='btn' onClick={onLogout}>
                            <FaSignOutAlt /> Logout
                        </button>
                    </li>
                </>
            ) : (           
                <>
                    <li>
                        <Link to='/login'>
                            <FaSignInAlt /> Login
                        </Link>
                    </li>
                    <li>
                        <Link to='/register'>
                            <FaUser /> Register
                        </Link>
                    </li>
                </>
            )}
        </ul>
    </header>
  )
}

export default Header