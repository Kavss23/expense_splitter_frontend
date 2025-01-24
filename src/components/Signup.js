import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Typography, Container, Box } from '@mui/material';
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
    <Typography variant="h4" component="h4" gutterBottom style={{ color: '#B82132', textAlign: 'center', fontWeight: 'bold' }}>
        SplitSure 
    </Typography>
    <Typography variant="h5" component="h5" gutterBottom style={{ color: '#B82132', textAlign: 'center', fontWeight: 'bold' }}>
       An Expense Splitter Platform
    </Typography>
    <Typography variant="h6" component="h6" gutterBottom style={{ color: '#D2665A', textDecoration: 'underline' }}>
        Sign Up
    </Typography>

        {errorMessage && (
          <Typography color="error" align="center">
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
              style: { fontSize: '0.875rem' }  // Reduce placeholder text size
            }}
            InputLabelProps={{ style: { fontSize: '0.875rem' } }} // Reduce label text size
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
                <Email style={{ marginRight: '8px' }} />
              ),
              style: { fontSize: '0.875rem' }  // Reduce placeholder text size
            }}
            InputLabelProps={{ style: { fontSize: '0.875rem' } }} // Reduce label text size
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
              style: { fontSize: '0.875rem' }  // Reduce placeholder text size
            }}
            InputLabelProps={{ style: { fontSize: '0.875rem' } }} // Reduce label text size
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '16px', backgroundColor: '#B82132' }}
          >
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" style={{ marginTop: '16px' }}>
          Already have an account? 
          <Button color="secondary" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default Signup;
