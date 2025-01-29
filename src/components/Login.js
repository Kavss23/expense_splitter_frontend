// App.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button, TextField, Typography, Box } from '@mui/material';
import { AccountCircle, Lock } from '@mui/icons-material';
import axios from 'axios';
import { loginSuccess, loginFailure } from '../redux/authSlice';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const errorMessage = useSelector((state) => state.auth.error);

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
      alert('Successfully logged in');
      onLoginSuccess();
    } catch (error) {
      dispatch(loginFailure('Invalid credentials'));
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
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
        padding: '2rem',
      }}
    >
      <Typography
        variant="h4"
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
      {errorMessage && (
        <Typography color="error">
          {errorMessage}
        </Typography>
      )}
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
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
              marginTop:'10px',
              color: '#178582'  // Set the input text color to golden
            }
          }}
          InputLabelProps={{
            style: { fontSize: '0.875rem', color: '#BFA181',  }
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
              marginTop:'10px',
            
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
            width: '300px' 
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
    </Box>
  );
};

export default Login;
