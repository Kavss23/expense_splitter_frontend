import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Container, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

  useEffect(() => {
    // Perform the logout action using redux
    try {
      dispatch(logout());
      localStorage.removeItem('jwt_token'); 
      localStorage.removeItem('username'); // Clear the JWT token from local storage
      onLogout();
      setSnackbarMessage('You have been logged out.');
      setSeverity('success');
      setOpen(true);

      // Redirect to the login page
      navigate('/login');
    } catch (error) {
      setSnackbarMessage('Error during logout');
      setSeverity('error');
      setOpen(true);
    }
  }, [dispatch, navigate, onLogout]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" component="h4" gutterBottom>
          You have been logged out.
        </Typography>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Logout;
