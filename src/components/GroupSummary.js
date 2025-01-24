import React, { useState, useEffect } from 'react';
import { Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const GroupSummary = ({ groupId }) => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupSummary = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/summary/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSummary(response.data);
      } catch (error) {
        setError('Failed to fetch group summary');
      }
    };

    fetchGroupSummary();
  }, [groupId]);

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h5" component="h2" gutterBottom>
          Group Summary
        </Typography>
        {summary ? (
          summary.balances.map((balance, index) => (
            <Typography key={index} variant="body1">
              {balance.owed_to ? `${balance.owed_to} is owed ₹${balance.amount}` : `${balance.owed_by} owes ₹${balance.amount}`}
            </Typography>
          ))
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
        {error && (
          <Typography color="error" style={{ marginTop: '16px' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default GroupSummary;
