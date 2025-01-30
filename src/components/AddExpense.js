import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, InputAdornment, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AccountCircle } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { setGroupMembers, addExpense, updateExpense, setExpenseDescription, setExpenseAmount, setExpenseSplitType, setExpenseContributions } from '../redux/expenseSlice';

const AddExpense = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const expense = location.state ? location.state.expense : null;
    const dispatch = useDispatch();
    const groupMembers = useSelector((state) => state.expenses.groupMembers);

    const description = useSelector(state => state.expenses.description);
    const amount = useSelector(state => state.expenses.amount);
    const splitType = useSelector(state => state.expenses.splitType);
    const contributions = useSelector(state => state.expenses.contributions);
    const username = localStorage.getItem('username');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Default severity

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
                showSnackbar('Error fetching group members.', 'error');
            }
        };

        fetchGroupData();

        if (expense) {
            dispatch(setExpenseDescription(expense.description));
            dispatch(setExpenseAmount(expense.amount));
            dispatch(setExpenseSplitType(expense.split_type));
            dispatch(setExpenseContributions(expense.contributions.map(c => ({ username: c.user, amount: c.amount }))));
        } else {
            dispatch(setExpenseDescription(''));
            dispatch(setExpenseAmount(''));
            dispatch(setExpenseSplitType('equal'));
            dispatch(setExpenseContributions([]));
        }

    }, [groupId, dispatch, expense]);

    const showSnackbar = (message, severity = 'info') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!description) {
            showSnackbar("Description is required.", 'error');
            return;
        }
        if (!amount) {
            showSnackbar("Amount is required.", 'error');
            return;
        }

        if (splitType === 'custom' && contributions.length === 0) {
            showSnackbar("Contributions are required for custom split.", 'error');
            return;
        }

        try {
          const expenseData = {
           
              description,
              amount,
              split_type: splitType,
              contributions: contributions.map((contribution) => ({
                  username: contribution.username,
                  amount: parseFloat(contribution.amount) // Parse amount to float before sending
            
            }))
            };
            if (splitType === 'custom') {
              let contributionsTotal = 0;
              for (const contribution of contributions) {
                  const amount = parseFloat(contribution.amount);
                  if (isNaN(amount)) {
                      showSnackbar("Contribution amounts must be valid numbers.", 'error');
                      return;
                  }
                  contributionsTotal += amount;
              }

              if (Math.abs(contributionsTotal - expenseData.amount) > 0.001) {
                  showSnackbar("Total contributions must equal the total amount for custom split.", 'error');
                  return;
              }
          } 
                  
              

            let response;
            if (expense) {
                response = await axios.patch(`http://localhost:7777/api/groups/${groupId}/expenses/${expense.id}/`, expenseData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                dispatch(updateExpense(response.data));
                showSnackbar('Expense updated successfully', 'success');

            } else {
                response = await axios.post(`http://localhost:7777/api/groups/${groupId}/expenses/`, expenseData, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
                    }
                });
                dispatch(addExpense(response.data));
                showSnackbar('Expense added successfully', 'success');
            }
            navigate(`/groups/${groupId}`);
        } catch (error) {
            console.error('Add expense error:', error);
            const errorMessage = error.response?.data?.message || error.message || "Error adding/updating expense";
            showSnackbar(errorMessage, 'error');
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
      const newContributions = contributions.map((contribution, i) => {
          if (i === index) {
              return { ...contribution, [field]: value }; // Create a *new* contribution object
          }
          return contribution; // Keep other contributions unchanged
      });

      dispatch(setExpenseContributions(newContributions));
  };

    const handleDescriptionChange = (event) => {
        dispatch(setExpenseDescription(event.target.value));
    };

    const handleAmountChange = (event) => {
      const newValue = event.target.value;

      if (!isNaN(newValue) && newValue !== "") {
          dispatch(setExpenseAmount(newValue));
      } else if (newValue === "") {
          dispatch(setExpenseAmount("")); // Allow empty string
      } else {
          showSnackbar("Please enter a valid number for the amount.", "warning");
      }
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
                    <AccountCircle sx={{ color: '#0A1828', fontSize: '25px' }} />
                    <Typography variant="h6" sx={{ color: '#0A1828', marginRight:1}}>
                      {username ? username[0].toUpperCase() : 'G'}
                        </Typography>
                                        
                  <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#0A1828' }}>
                      <HomeIcon sx ={{marginRight:1}}/>
                      Home
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
                      <ExitToAppIcon sx={{ marginRight: 1 }} />
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
                      marginTop: '1rem'
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
                          label="Amount"
                          value={amount}
                          onChange={handleAmountChange}
                          margin="normal"
                          fullWidth
                          
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
                                  <InputLabel style={{ color: '#BFA181', marginTop: '-10px' }} shrink>
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
                              <IconButton onClick={() => handleRemoveContribution(index)} sx={{ color: '#BFA181' }}>
                                  <CloseIcon />
                              </IconButton>
                          </Box>
                      ))}
                      {splitType === 'custom' && contributions.length < groupMembers.length && (
                          <Button
                              onClick={handleAddContribution}
                              variant="outlined"
                              fullWidth
                              sx={{ marginTop: '16px', color: '#0A1828', backgroundColor: '#BFA181' }}
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
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
              </Alert>
          </Snackbar>
      </>
  );
};
export default AddExpense;