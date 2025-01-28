import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { Button, TextField, Typography, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const AddExpense = () => {
  const { groupId } = useParams();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [contributions, setContributions] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const navigate = useNavigate();

  // Fetch group data (including members) when the component mounts
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/members/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
        // Extract members from the group data
        setGroupMembers(response.data.members);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`http://localhost:7777/api/groups/${groupId}/expenses/`, {
        description,
        amount,
        split_type: splitType,
        contributions: contributions.map((contribution) => ({
          username: contribution.username,
          amount: contribution.amount
        }))
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      alert('Expense added successfully');
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Add expense error:', error);
      alert('Error adding expense');
    }
  };

  const handleAddContribution = () => {
    setContributions([...contributions, { username: '', amount: '' }]);
  };

  const handleContributionChange = (index, field, value) => {
    const newContributions = [...contributions];
    newContributions[index][field] = value;
    setContributions(newContributions);
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
        Add Expense
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          fullWidth
          required
          sx={{
            '& .MuiInputBase-input': {
              color: '#BFA181', // Text color
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#BFA181', // Border color
              },
              '&:hover fieldset': {
                borderColor: '#BFA181', // Border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#BFA181', // Border color when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: '#BFA181', // Label color
            },
          }}
        />
        <TextField
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          margin="normal"
          fullWidth
          required
          sx={{
            '& .MuiInputBase-input': {
              color: '#BFA181', // Text color
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#BFA181', // Border color
              },
              '&:hover fieldset': {
                borderColor: '#BFA181', // Border color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: '#BFA181', // Border color when focused
              },
            },
            '& .MuiInputLabel-root': {
              color: '#BFA181', // Label color
            },
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#BFA181' }}>Split Type</InputLabel>
          <Select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value)}
            sx={{
              '& .MuiInputBase-input': {
                color: '#BFA181', // Text color
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#BFA181', // Border color
                },
                '&:hover fieldset': {
                  borderColor: '#BFA181', // Border color on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BFA181', // Border color when focused
                },
              },
              '& .MuiInputLabel-root': {
                color: '#BFA181', // Label color
              },
            }}
          >
            <MenuItem value="equal">Equal</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </Select>
        </FormControl>
        {splitType === 'custom' && contributions.map((contribution, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#BFA181' }}>Username</InputLabel>
              <Select
                value={contribution.username}
                onChange={(e) => handleContributionChange(index, 'username', e.target.value)}
                sx={{
                  '& .MuiInputBase-input': {
                    color: '#BFA181',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#BFA181',
                    },
                    '&:hover fieldset': {
                      borderColor: '#BFA181',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BFA181',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#BFA181',
                  },
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
              sx={{
                '& .MuiInputBase-input': {
                  color: '#BFA181',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#BFA181',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BFA181',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BFA181',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#BFA181',
                },
              }}
            />
          </Box>
        ))}
        {splitType === 'custom' && (
          <Button 
            onClick={handleAddContribution} 
            sx={{ 
              marginTop: '16px', 
              backgroundColor: '#BFA181', 
              color: '#0A1828' 
            }}
          >
            Add Contribution
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ 
            marginTop: '16px', 
            backgroundColor: '#BFA181', 
            color: '#0A1828' 
          }}
        >
          Add Expense
        </Button>
      </form>
    </Box>
  );
};

export default AddExpense;