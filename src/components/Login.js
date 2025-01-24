import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
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
    <Container
      maxWidth="sm"
      style={{
        backgroundColor: '#F6DED8',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" width="100%">
        <Typography
          variant="h4"
          component="h4"
          gutterBottom
          style={{ color: '#B82132', textAlign: 'center', fontWeight: 'bold' }}
        >
          Welcome to SplitSure
        </Typography>
        <Typography
          variant="h6"
          component="h6"
          gutterBottom
          style={{ color: '#D2665A', textDecoration: 'underline' }}
        >
          Login
        </Typography>
        {errorMessage && (
          <Typography color="error">
            {errorMessage}
          </Typography>
        )}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <AccountCircle style={{ marginRight: '8px' }} />
              ),
              style: { fontSize: '0.875rem' }
            }}
            InputLabelProps={{ style: { fontSize: '0.875rem' } }}
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
                <Lock style={{ marginRight: '8px' }} />
              ),
              style: { fontSize: '0.875rem' }
            }}
            InputLabelProps={{ style: { fontSize: '0.875rem' } }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px', backgroundColor: '#B82132' }}
          >
            Login
          </Button>
        </form>
        <Typography variant="body2" style={{ marginTop: '16px' }}>
          Don't have an account? 
          <Button color="secondary" onClick={handleSignupRedirect}>
            Sign Up
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Login;
