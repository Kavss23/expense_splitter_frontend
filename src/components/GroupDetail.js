// components/GroupDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router';
import { Button, List, ListItem, ListItemText, Typography, Box, Divider } from '@mui/material';

const GroupDetail = () => {
  const { groupId } = useParams();
  const [balances, setBalances] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/summary/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setBalances(response.data.balances);
    };

    const fetchExpenses = async () => {
      const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/expenses/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setExpenses(response.data);
    };

    fetchGroupDetails();
    fetchExpenses();
  }, [groupId]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: '#0A1828',
        width: '100%',
        height: '100vh',
        padding: '2rem',
      }}
    >
      <Typography
        variant="h4"
        component="h4"
        gutterBottom
        sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}
      >
        Group Details
      </Typography>
      
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        sx={{ color: '#178582', textDecoration: 'underline' }}
      >
        Balances
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {balances.map((balance, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${balance.user} owes ${balance.amount}`} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ width: '100%', my: 2 }} />
      
      <Typography
        variant="h6"
        component="h6"
        gutterBottom
        sx={{ color: '#178582', textDecoration: 'underline' }}
      >
        Expenses
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {expenses.map((expense) => (
          <ListItem key={expense.id}>
            <ListItemText primary={`${expense.description} - ${expense.amount}`} />
          </ListItem>
        ))}
      </List>

      <Button
        component={Link}
        to={`/groups/${groupId}/add-expense`}
        sx={{ 
          marginTop: '16px', 
          backgroundColor: '#BFA181', 
          color: '#0A1828'
        }}
      >
        Add Expense
      </Button>
    </Box>
  );
};

export default GroupDetail;
