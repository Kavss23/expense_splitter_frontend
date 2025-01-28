
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button, Typography, Container, Box, Divider } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);

  const fetchGroups = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/logout');
        return;
      }

      const response = await axios.get('http://localhost:7777/api/groups/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      if (error.response && error.response.status === 401) {
        navigate('/logout');
      }
    }
  }, [navigate]);

  const fetchExpenses = useCallback(async () => {
    if (!selectedGroup) return;

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/logout');
        return;
      }

      const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/expenses/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setExpenses(response.data);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      if (error.response && error.response.status === 401) {
        navigate('/logout');
      }
    }
  }, [navigate, selectedGroup]);

  const fetchBalances = useCallback(async () => {
    if (!selectedGroup) return;

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/logout');
        return;
      }

      const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/summary/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setBalances(response.data.balances);
    } catch (error) {
      console.error('Failed to fetch balances:', error);
      if (error.response && error.response.status === 401) {
        navigate('/logout');
      }
    }
  }, [navigate, selectedGroup]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    if (selectedGroup) {
      fetchExpenses();
      fetchBalances();
    }
  }, [fetchExpenses, fetchBalances, selectedGroup]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}>
          Expense Tracker Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: '#BFA181', textAlign: 'center' }}>
          Welcome aboard! This application is meant to track expenses in real time. Hope you have a good experience with it.
        </Typography>
        <Box sx={{ width: '100%', marginBottom: '16px' }}>
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              marginBottom: '16px', 
              backgroundColor: '#BFA181', 
              color: '#0A1828' 
            }}
            component={Link}
            to="/add-group"
          >
            Add Group
          </Button>
          <Typography variant="h6" sx={{ color: '#178582' }}>Groups</Typography>
          {groups.map((group) => (
            <Button
              key={group.id}
              fullWidth
              sx={{ 
                backgroundColor: selectedGroup && selectedGroup.id === group.id ? '#178582' : '#BFA181', 
                color: '#0A1828', 
                marginBottom: '8px' 
              }}
              onClick={() => setSelectedGroup(group)}
            >
              {group.name}
            </Button>
          ))}
        </Box>
        {selectedGroup && (
          <>
            <Box sx={{ width: '100%', marginBottom: '16px' }}>
              <Typography variant="h6" sx={{ color: '#178582' }}>Group Members</Typography>
              {selectedGroup.members.map((member, index) => (
                <Box key={index} sx={{ color: '#BFA181', marginBottom: '8px' }}>
                  {member}
                </Box>
              ))}
            </Box>
            <Box sx={{ width: '100%', marginBottom: '16px' }}>
              <Typography variant="h6" sx={{ color: '#178582' }}>Expenses</Typography>
              {expenses.map((expense) => (
                <Box key={expense.id} sx={{ color: '#BFA181', marginBottom: '8px' }}>
                  {expense.description} - {expense.amount}
                </Box>
              ))}
            </Box>
            <Box sx={{ width: '100%', marginBottom: '16px' }}>
              <Typography variant="h6" sx={{ color: '#178582' }}>Balances</Typography>
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#178582' }}>Who Owes Money:</Typography>
                {balances.filter(balance => balance.owed_by).map((balance, index) => (
                  <Box key={index} sx={{ color: '#BFA181', marginBottom: '8px' }}>
                    {balance.owed_by} owes {balance.amount} 
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ color: '#178582' }}>Who Is Owed Money:</Typography>
                {balances.filter(balance => balance.owed_to).map((balance, index) => (
                  <Box key={index} sx={{ color: '#BFA181', marginBottom: '8px' }}>
                    {balance.owed_to} is owed {balance.amount} 
                  </Box>
                ))}
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{ 
                marginTop: '16px', 
                backgroundColor: '#BFA181', 
                color: '#0A1828' 
              }}
              onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)}
            >
              Add Expense
            </Button>
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/logout')}
          sx={{ 
            marginTop: '16px', 
            backgroundColor: '#BFA181', 
            color: '#0A1828' 
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
