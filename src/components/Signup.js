import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box, Snackbar, Alert, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { AccountCircle, Email, Lock } from '@mui/icons-material';
import { signupSuccess, signupFailure } from '../redux/authSlice';

const Signup = () => {
  const [username, setUsername] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const isSmallScreen = useMediaQuery('(max-width: 600px)'); // 'success', 'error', 'warning', 'info'

  const handleSubmit = async (event) => {  //The async keyword indicates that this function will perform asynchronous operations, and it will typically use the await keyword to pause the execution until a promise is resolved.
    event.preventDefault();  //doesn't refresh for form submit to  allow logic. event passed as object in function
    try {
      const response = await axios.post('http://localhost:7777/api/register/', {
        username,
        email,
        password,
      });
      setSnackbarMessage('Account created successfully! Please login');
      setSeverity('success');
      setOpen(true);
      dispatch(signupSuccess(response.data));  //store success in redux
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.username) {
          dispatch(signupFailure(`Username: ${errorData.username}`));
          setSnackbarMessage(`Username: ${errorData.username}`);
        } else if (errorData.email) {
          dispatch(signupFailure(`Email: ${errorData.email}`));
          setSnackbarMessage(`Email: ${errorData.email}`);
        } else if (errorData.non_field_errors) {
          dispatch(signupFailure(`Error: ${errorData.non_field_errors}`));
          setSnackbarMessage(`Error: ${errorData.non_field_errors}`);
        } else {
          dispatch(signupFailure('Error during registration'));
          setSnackbarMessage('Error during registration');
        }
      } else {
        dispatch(signupFailure('Error during registration'));
        setSnackbarMessage('Error during registration');
      }
      setSeverity('error');
      setOpen(true);
    }
  };

  const handleSnackbarClose = ( reason) => {
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
        sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold', marginTop: '70px' }}
      >
        SplitSure
      </Typography>
      <Typography
        variant="h5"
        component="h5"
        gutterBottom
        sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}
      >
        An Expense Splitter Platform
      </Typography>
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        sx={{ color: '#178582'}}
      >
        SIGN UP
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
              color: '#178582'  
            }
          }}
          InputLabelProps={{
            style: { fontSize: '0.875rem', color: '#BFA181' }
          }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          fullWidth
          required
          InputProps={{
            startAdornment: (
              <Email sx={{ color: '#178582', marginRight: '8px' }} />
            ),
            style: {
              fontSize: '0.875rem',
              border: '1px solid #BFA181',
              borderRadius: '8px',
              marginTop: '10px',  
              color: '#178582'  
            }
          }}
          InputLabelProps={{
            style: { fontSize: '0.875rem', color: '#BFA181' }
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
              color: '#178582'  
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
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" sx={{ marginTop: '16px', color: '#178582' }}>
        Already have an account?
        <Button color="inherit" sx={{ color: '#178582' }} onClick={() => navigate('/login')}>
          Login
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

export default Signup;
