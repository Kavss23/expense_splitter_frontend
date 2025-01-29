

import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, InputAdornment, Paper, IconButton } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupMembers, addExpense, updateExpense, setExpenseDescription, setExpenseAmount, setExpenseSplitType, setExpenseContributions } from '../redux/expenseSlice'; // Import new actions

const AddExpense = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const expense = location.state ? location.state.expense : null;
    const dispatch = useDispatch();
    const groupMembers = useSelector((state) => state.expenses.groupMembers);

    // Get values from Redux store
    const description = useSelector(state => state.expenses.description);
    const amount = useSelector(state => state.expenses.amount);
    const splitType = useSelector(state => state.expenses.splitType);
    const contributions = useSelector(state => state.expenses.contributions);


    useEffect(() => {
        const fetchGroupData = async () => {
            try {
                const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/members/`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                dispatch(setGroupMembers(response.data.members));
            } catch (error) {
                console.error('Error fetching group data:', error);
            }
        };

        fetchGroupData();

        // Initialize Redux state if editing an existing expense
        if (expense) {
          dispatch(setExpenseDescription(expense.description));
          dispatch(setExpenseAmount(expense.amount));
          dispatch(setExpenseSplitType(expense.split_type));
          dispatch(setExpenseContributions(expense.contributions));
        } else {
          // Set initial values if adding a new expense
          dispatch(setExpenseDescription(''));
          dispatch(setExpenseAmount(''));
          dispatch(setExpenseSplitType('equal'));
          dispatch(setExpenseContributions([]));
        }

    }, [groupId, dispatch, expense]); // Add expense to the dependency array


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const expenseData = {
                description,
                amount,
                split_type: splitType,
                contributions: contributions.map((contribution) => ({
                    username: contribution.username,
                    amount: contribution.amount
                }))
            };

            let response;
            if (expense) {
                response = await axios.patch(`http://localhost:7777/api/groups/${groupId}/expenses/${expense.id}/`, expenseData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                dispatch(updateExpense(response.data));
                alert('Expense updated successfully');
            } else {
                response = await axios.post(`http://localhost:7777/api/groups/${groupId}/expenses/`, expenseData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                dispatch(addExpense(response.data));
                alert('Expense added successfully');
            }
            navigate(`/groups/${groupId}`);
        } catch (error) {
            console.error('Add expense error:', error);
            const errorMessage = error.response?.data?.message || error.message || "Error adding/updating expense";
            alert(errorMessage);
        }
    };

    const handleAddContribution = () => {
        dispatch(setExpenseContributions([...contributions, { username: '', amount: '' }]));
    };

    const handleRemoveContribution = (index) => {
        const newContributions = contributions.filter((_, i) => i !== index);
        dispatch(setExpenseContributions(newContributions));
    };

    const handleContributionChange = (index, field, value) => {
        const newContributions = [...contributions];
        newContributions[index][field] = value;
        dispatch(setExpenseContributions(newContributions));
    };

    const handleDescriptionChange = (event) => {
      dispatch(setExpenseDescription(event.target.value));
    };

    const handleAmountChange = (event) => {
      dispatch(setExpenseAmount(event.target.value));
    };

    const handleSplitTypeChange = (event) => {
      dispatch(setExpenseSplitType(event.target.value));
    };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#BFA181' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
            Expense Splitter Dashboard
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#0A1828' }}>
            Home
          </Button>
          <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          backgroundColor: '#0A1828',
          width: '100%',
          height: '90vh',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '2rem',
            backgroundColor: '#0A1828',
            border: '2px solid #BFA181',
            borderRadius: '12px',
            width: '350px',
            maxHeight: '80vh',
            overflowY: 'auto',
            marginTop: '1rem'  // Ensure the top margin doesn't change
          }}
        >
          <Typography
            variant="h4"
            component="h4"
            gutterBottom
            sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold', marginBottom: '40px' }}
          >
            {expense ? 'Edit Expense' : 'Add Expense'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <TextField
               label="Description"
               value={description}
               onChange={handleDescriptionChange}
              margin="normal"
              fullWidth
              required
              InputProps={{
                style: {
                  fontSize: '0.875rem',
                  border: '1px solid #BFA181',
                  borderRadius: '8px',
                  color: '#178582',
                }
              }}
              InputLabelProps={{
                style: {
                  color: '#BFA181',
                  marginTop: '-10px',
                },
                shrink: true,
              }}
            />
            <TextField
              abel="Amount"
              value={amount}
              onChange={handleAmountChange}
              margin="normal"
              fullWidth
              required
              InputProps={{
                style: {
                  fontSize: '0.875rem',
                  border: '1px solid #BFA181',
                  borderRadius: '8px',
                  color: '#178582',
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <CurrencyRupeeIcon style={{ color: '#178582' }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                style: {
                  color: '#BFA181',
                  marginTop: '-10px',
                },
                shrink: true,
              }}
            />
            <FormControl fullWidth margin="normal">
        <InputLabel style={{ color: '#BFA181', marginTop: '-10px' }}>
          Split Type
        </InputLabel>
        <Select
          value={splitType}
          onChange={handleSplitTypeChange}
                style={{
                  color: '#178582',
                  border: '1px solid #BFA181',
                  borderRadius: '8px',
                  marginTop: '4px',
                }}
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: '#BFA181',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      borderColor: '#BFA181',
                      color: '#178582'
                    }
                  }
                }}
              >
                <MenuItem value="equal">Equal</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
            {splitType === 'custom' && contributions.map((contribution, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel
                    style={{ color: '#BFA181', marginTop: '-10px' }}
                    shrink
                  >
                    Username
                  </InputLabel>
                  <Select
                   value={contribution.username}
                   onChange={(e) => handleContributionChange(index, 'username', e.target.value)}
                    style={{
                      color: '#178582',
                      border: '1px solid #BFA181',
                      borderRadius: '8px',
                      marginTop: '4px',
                    }}
                    sx={{
                      '& .MuiSvgIcon-root': {
                        color: '#BFA181',
                      },
                    }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          borderColor: '#BFA181',
                          color: '#178582'
                        }
                      }
                    }}
                  >
                    {groupMembers.map((member) => (
                      <MenuItem key={member.id} value={member.username}>
                        {member.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Amount"
                  value={contribution.amount}
                  onChange={(e) => handleContributionChange(index, 'amount', e.target.value)}
                  margin="normal"
                  fullWidth
                  required
                  InputProps={{
                    style: {
                      fontSize: '0.875rem',
                      border: '1px solid #BFA181',
                      borderRadius: '8px',
                      color: '#178582',
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon style={{ color: '#178582', fontSize: '1rem' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    style: {
                      color: '#BFA181',
                      marginTop: '-15px',
                    },
                    shrink: true,
                  }}
                
                />
                <IconButton
                  onClick={() => handleRemoveContribution(index)}
                  sx={{ color: '#BFA181' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ))}
            {splitType === 'custom' && contributions.length < groupMembers.length && (
              <Button
                onClick={handleAddContribution}
                variant="outlined"
                fullWidth
                sx={{ marginTop: '16px',color:'#0A1828', backgroundColor:'#BFA181' }}
              >
                Add Contribution
              </Button>
            )}
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '16px', backgroundColor: '#BFA181', color: '#0A1828' }}>
              {expense ? 'Update Expense' : 'Add Expense'}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default AddExpense;
