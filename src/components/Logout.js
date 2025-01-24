

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Container, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Perform the logout action using redux
    dispatch(logout());    
    localStorage.removeItem('jwt_token');  // Clear the JWT token from local storage
    onLogout();

    // Redirect to the login page
    navigate('/login');
  }, [dispatch, navigate, onLogout]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" component="h4" gutterBottom>
          You have been logged out.
        </Typography>
      </Box>
    </Container>
  );
};

export default Logout;
