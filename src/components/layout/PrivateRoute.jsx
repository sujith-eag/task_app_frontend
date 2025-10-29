import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Box, CircularProgress, Skeleton, Stack, Container } from '@mui/material';
import { useEffect, useState } from 'react';

/**
 * PrivateRoute Component with Loading States
 * 
 * Features:
 * - Loading skeleton during auth state initialization
 * - Return URL preservation (redirects back after login)
 * - Role-based access control
 * - Smooth transitions (no flash of redirect)
 * - Session expiration handling
 */
const PrivateRoute = ({ roles }) => {
  const location = useLocation();
  const { user, isLoading } = useSelector((state) => state.auth);
  const [authChecked, setAuthChecked] = useState(false);

  // Allow time for initial auth state to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 100); // Small delay to prevent flash

    return () => clearTimeout(timer);
  }, []);

  // Show loading skeleton during auth initialization
  if (!authChecked || isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Stack spacing={2}>
            {/* Page title skeleton */}
            <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
            
            {/* Content skeletons */}
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
            <Stack direction="row" spacing={2}>
              <Skeleton variant="rectangular" width="50%" height={150} sx={{ borderRadius: 2 }} />
              <Skeleton variant="rectangular" width="50%" height={150} sx={{ borderRadius: 2 }} />
            </Stack>
            <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          </Stack>
        </Box>
      </Container>
    );
  }

  // Check if user is logged in
  if (!user) {
    // Store the attempted URL for redirect after login
    const returnUrl = location.pathname + location.search;
    
    // Don't show toast - the login page itself makes it clear what's needed
    // Showing toast during logout is confusing
    
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: returnUrl }} // Pass return URL
      />
    );
  }

  // Check if the route requires specific roles and if the user has one of them
  if (roles && !roles.includes(user.role)) {
    // Notify the user and redirect them
    toast.error(`Access denied. Required role: ${roles.join(' or ')}.`, {
      toastId: 'unauthorized-access', // Prevent duplicate toasts
    });
    
    return <Navigate to="/dashboard" replace />;
  }

  // Optional: Check for session expiration (if JWT token exists)
  // This is handled by the axios interceptor in authServices.js
  // but we can add additional client-side check here if needed

  // If logged in and authorized, render the child component
  return <Outlet />;
};

export default PrivateRoute;