import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, MenuItem } from '@mui/material';
import { AccountCircle, Email, Lock, Description, Money } from '@mui/icons-material';
import axios from 'axios';

const ExpenseForm = ({ groupId, fetchExpenses }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [contributions, setContributions] = useState([{ user_id: '', amount: '' }]);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.post(`http://localhost:8040/api/groups/${groupId}/add_expense/`, {
        description,
        amount,
        splitType,
        contributions: splitType === 'custom' ? contributions : []
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchExpenses();
      setDescription('');
      setAmount('');
      setSplitType('equal');
      setContributions([{ user_id: '', amount: '' }]);
    } catch (error) {
      setError(error.response ? error.response.data.error : 'An error occurred');
    }
  };

  const handleContributionChange = (index, field, value) => {
    const newContributions = contributions.slice();
    newContributions[index][field] = value;
    setContributions(newContributions);
  };

  const addContributionField = () => {
    setContributions([...contributions, { user_id: '', amount: '' }]);
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add Expense
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <Description style={{ marginRight: '8px' }} />
              ),
            }}
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            margin="normal"
            fullWidth
            required
            InputProps={{
              startAdornment: (
                <Money style={{ marginRight: '8px' }} />
              ),
            }}
          />
          <TextField
            select
            label="Split Type"
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            margin="normal"
            fullWidth
            required
          >
            <MenuItem value="equal">Equal</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </TextField>
          {splitType === 'custom' && contributions.map((contribution, index) => (
            <Box key={index} display="flex" flexDirection="row" alignItems="center" mt={1}>
              <TextField
                label="User ID"
                type="number"
                value={contribution.user_id}
                onChange={(e) => handleContributionChange(index, 'user_id', e.target.value)}
                margin="normal"
                fullWidth
                required
              />
              <TextField
                label="Contribution Amount"
                type="number"
                value={contribution.amount}
                onChange={(e) => handleContributionChange(index, 'amount', e.target.value)}
                margin="normal"
                fullWidth
                required
              />
            </Box>
          ))}
          {splitType === 'custom' && (
            <Button variant="contained" onClick={addContributionField}>
              Add Contribution
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
            Add Expense
          </Button>
        </form>
        {error && (
          <Typography color="error" style={{ marginTop: '16px' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ExpenseForm;
