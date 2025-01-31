import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button, TextField, Typography, Box, Snackbar, Alert, useMediaQuery } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import axios from 'axios';
import { loginSuccess, loginFailure } from '../redux/authSlice';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');
  const isSmallScreen = useMediaQuery('(max-width: 600px)');
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:7777/api/login/', {
        username,
        password,
      });
      localStorage.setItem('username', username);
      localStorage.setItem('jwt_token', response.data.access);
      dispatch(loginSuccess(response.data));
      setSnackbarMessage('Successfully logged in');
      setSeverity('success');
      setOpen(true);
      onLoginSuccess();
    } catch (error) {
      dispatch(loginFailure('Invalid credentials'));
      setSnackbarMessage('Invalid credentials');
      setSeverity('error');
      setOpen(true);
      setUsername(''); // Clear the username field
      setPassword(''); // Clear the password field
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: '#0A1828',
        width: '100%',
        height: '90vh',
        padding: isSmallScreen ? '1rem' : '2rem',
      }}
    >
      <Typography
        variant={isSmallScreen ? 'h5' : 'h4'}
        component="h4"
        gutterBottom
        sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}
      >
        Welcome to SplitSure
      </Typography>
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        sx={{ color: '#178582', textDecoration: 'underline' }}
      >
        LOGIN
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: isSmallScreen ? '250px' : '300px' }}>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <AccountCircle sx={{ color: '#178582', marginRight: '8px' }} />
            ),
            style: {
              fontSize: '0.875rem',
              border: '1px solid #BFA181',
              borderRadius: '8px',
              marginTop: '10px',
              color: '#178582'  // Set the input text color to golden
            }
          }}
          InputLabelProps={{
            style: { fontSize: '0.875rem', color: '#BFA181', }
          }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <Lock sx={{ color: '#178582', marginRight: '8px' }} />
            ),
            style: {
              fontSize: '0.875rem',
              border: '1px solid #BFA181',
              borderRadius: '8px',
              marginTop: '10px',
              color: '#178582'  // Set the input text color to golden
            }
          }}
          InputLabelProps={{
            style: { fontSize: '0.875rem', color: '#BFA181' }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            marginTop: '16px',
            backgroundColor: '#BFA181',
            color: '#0A1828',
            width: isSmallScreen ? '250px' : '300px'
          }}
        >
          Login
        </Button>
      </form>
      <Typography variant="body2" sx={{ marginTop: '16px', color: '#178582' }}>
        Don't have an account?
        <Button color="inherit" sx={{ color: '#178582' }} onClick={handleSignupRedirect}>
          Sign Up
        </Button>
      </Typography>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
