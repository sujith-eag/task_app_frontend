import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PrivateRoute = ({ roles }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if the route requires specific roles and if the user has one of them
  if (roles && !roles.includes(user.role)) {
    // Notify the user and redirect them
    toast.error("You are not authorized to view this page.");
    return <Navigate to="/dashboard" replace />;
  }

  // If logged in and authorized, render the child component
  return <Outlet />;
};

export default PrivateRoute;