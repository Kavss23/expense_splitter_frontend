// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Box } from '@mui/material';
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
  const errorMessage = useSelector((state) => state.auth.error);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:7777/api/register/', {
        username,
        email,
        password,
      });
      alert('Account created successfully! Please login');
      dispatch(signupSuccess(response.data));
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.username) {
          dispatch(signupFailure(`Username: ${errorData.username}`));
        } else if (errorData.email) {
          dispatch(signupFailure(`Email: ${errorData.email}`));
        } else if (errorData.non_field_errors) {
          dispatch(signupFailure(`Error: ${errorData.non_field_errors}`));
        } else {
          dispatch(signupFailure('Error during registration'));
        }
      } else {
        dispatch(signupFailure('Error during registration'));
      }
    }
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
        sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' , marginTop:'70px'}}
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
        sx={{ color: '#178582', textDecoration: 'underline' }}
      >
        SIGN UP
      </Typography>
      {errorMessage && (
        <Typography color="error" align="center">
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
              marginTop:'10px', // Increased padding to ensure space for placeholder
              color: '#178582'  // Set the input text color to golden
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
              marginTop:'10px',  // Increased padding to ensure space for placeholder
              color: '#178582'  // Set the input text color to golden
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
              marginTop:'10px',  // Increased padding to ensure space for placeholder
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
          Sign Up
        </Button>
      </form>
      <Typography variant="body2" sx={{ marginTop: '16px', color: '#178582' }}>
        Already have an account? 
        <Button color="inherit" sx={{ color: '#178582' }} onClick={() => navigate('/login')}>
          Login
        </Button>
      </Typography>
    </Box>
  );
};

export default Signup;
