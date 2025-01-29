
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router';
// import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, InputAdornment, Paper, IconButton } from '@mui/material';
// import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import CloseIcon from '@mui/icons-material/Close';

// const AddExpense = () => {
//   const { groupId } = useParams();
//   const [description, setDescription] = useState('');
//   const [amount, setAmount] = useState('');
//   const [splitType, setSplitType] = useState('equal');
//   const [contributions, setContributions] = useState([]);
//   const [groupMembers, setGroupMembers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGroupData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/members/`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
//           }
//         });
//         setGroupMembers(response.data.members);
//       } catch (error) {
//         console.error('Error fetching group data:', error);
//       }
//     };

//     fetchGroupData();
//   }, [groupId]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post(`http://localhost:7777/api/groups/${groupId}/expenses/`, {
//         description,
//         amount,
//         split_type: splitType,
//         contributions: contributions.map((contribution) => ({
//           username: contribution.username,
//           amount: contribution.amount
//         }))
//       }, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
//         }
//       });
//       alert('Expense added successfully');
//       navigate(`/groups/${groupId}`);
//     } catch (error) {
//       console.error('Add expense error:', error);
//       alert('Error adding expense');
//     }
//   };

//   const handleAddContribution = () => {
//     setContributions([...contributions, { username: '', amount: '' }]);
//   };

//   const handleRemoveContribution = (index) => {
//     const newContributions = contributions.filter((_, i) => i !== index);
//     setContributions(newContributions);
//   };

//   const handleContributionChange = (index, field, value) => {
//     const newContributions = [...contributions];
//     newContributions[index][field] = value;
//     setContributions(newContributions);
//   };

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: '#BFA181' }}>
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
//             Expense Splitter Dashboard
//           </Typography>
//           <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#0A1828' }}>
//             Home
//           </Button>
//           <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <Box
//         display="flex"
//         flexDirection="column"
//         alignItems="center"
//         justifyContent="center"
//         sx={{
//           backgroundColor: '#0A1828',
//           width: '100%',
//           height: '90vh',
//         }}
//       >
//         <Paper
//           elevation={3}
//           sx={{
//             padding: '2rem',
//             backgroundColor: '#0A1828',
//             border: '2px solid #BFA181',
//             borderRadius: '12px',
//             width: '350px',
//             maxHeight: '80vh',
//             overflowY: 'auto',
//             marginTop: '1rem'  // Ensure the top margin doesn't change
//           }}
//         >
//           <Typography
//             variant="h4"
//             component="h4"
//             gutterBottom
//             sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold', marginBottom: '40px' }}
//           >
//             Add Expense
//           </Typography>
//           <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//             <TextField
//               label="Description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               margin="normal"
//               fullWidth
//               required
//               InputProps={{
//                 style: {
//                   fontSize: '0.875rem',
//                   border: '1px solid #BFA181',
//                   borderRadius: '8px',
//                   color: '#178582',
//                 }
//               }}
//               InputLabelProps={{
//                 style: {
//                   color: '#BFA181',
//                   marginTop: '-10px',
//                 },
//                 shrink: true,
//               }}
//             />
//             <TextField
//               label="Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               margin="normal"
//               fullWidth
//               required
//               InputProps={{
//                 style: {
//                   fontSize: '0.875rem',
//                   border: '1px solid #BFA181',
//                   borderRadius: '8px',
//                   color: '#178582',
//                 },
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <CurrencyRupeeIcon style={{ color: '#178582' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               InputLabelProps={{
//                 style: {
//                   color: '#BFA181',
//                   marginTop: '-10px',
//                 },
//                 shrink: true,
//               }}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel style={{ color: '#BFA181', marginTop: '-10px' }}>
//                 Split Type
//               </InputLabel>
//               <Select
//                 value={splitType}
//                 onChange={(e) => setSplitType(e.target.value)}
//                 style={{
//                   color: '#178582',
//                   border: '1px solid #BFA181',
//                   borderRadius: '8px',
//                   marginTop: '4px',
//                 }}
//                 sx={{
//                   '& .MuiSvgIcon-root': {
//                     color: '#BFA181',
//                   },
//                 }}
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       borderColor: '#BFA181',
//                       color: '#178582'
//                     }
//                   }
//                 }}
//               >
//                 <MenuItem value="equal">Equal</MenuItem>
//                 <MenuItem value="custom">Custom</MenuItem>
//               </Select>
//             </FormControl>
//             {splitType === 'custom' && contributions.map((contribution, index) => (
//               <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
//                 <FormControl fullWidth margin="normal">
//                   <InputLabel
//                     style={{ color: '#BFA181', marginTop: '-10px' }}
//                     shrink
//                   >
//                     Username
//                   </InputLabel>
//                   <Select
//                     value={contribution.username}
//                     onChange={(e) => handleContributionChange(index, 'username', e.target.value)}
//                     style={{
//                       color: '#178582',
//                       border: '1px solid #BFA181',
//                       borderRadius: '8px',
//                       marginTop: '4px',
//                     }}
//                     sx={{
//                       '& .MuiSvgIcon-root': {
//                         color: '#BFA181',
//                       },
//                     }}
//                     MenuProps={{
//                       PaperProps: {
//                         style: {
//                           borderColor: '#BFA181',
//                           color: '#178582'
//                         }
//                       }
//                     }}
//                   >
//                     {groupMembers.map((member) => (
//                       <MenuItem key={member.id} value={member.username}>
//                         {member.username}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//                 <TextField
//                   label="Amount"
//                   value={contribution.amount}
//                   onChange={(e) => handleContributionChange(index, 'amount', e.target.value)}
//                   margin="normal"
//                   fullWidth
//                   required
//                   InputProps={{
//                     style: {
//                       fontSize: '0.875rem',
//                       border: '1px solid #BFA181',
//                       borderRadius: '8px',
//                       color: '#178582',
//                     },
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <CurrencyRupeeIcon style={{ color: '#178582', fontSize: '1rem' }} />
//                       </InputAdornment>
//                     ),
//                   }}
//                   InputLabelProps={{
//                     style: {
//                       color: '#BFA181',
//                       marginTop: '-15px',
//                     },
//                     shrink: true,
//                   }}
//                 />
//                 <IconButton
//                   onClick={() => handleRemoveContribution(index)}
//                   sx={{ color: '#BFA181' }}
//                 >
//                   <CloseIcon />
//                 </IconButton>
//               </Box>
//             ))}
//             {splitType === 'custom' && contributions.length < groupMembers.length && (
//               <Button
//                 onClick={handleAddContribution}
//                 style={{
//                   marginTop: '16px',
//                   backgroundColor: '#BFA181',
//                   color: '#0A1828',
//                   width: '100%'
//                 }}
//               >
//                 Add Contribution
//               </Button>
//             )}
//                        <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               style={{
//                 marginTop: '16px',
//                 backgroundColor: '#BFA181',
//                 color: '#0A1828'
//               }}
//             >
//               Add Expense
//             </Button>
//           </form>
//         </Paper>
//       </Box>
//     </>
//   );
// };

// export default AddExpense;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, InputAdornment, Paper, IconButton } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CloseIcon from '@mui/icons-material/Close';

const AddExpense = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const expense = location.state ? location.state.expense : null;

  const [description, setDescription] = useState(expense ? expense.description : '');
  const [amount, setAmount] = useState(expense ? expense.amount : '');
  const [splitType, setSplitType] = useState(expense ? expense.split_type : 'equal');
  const [contributions, setContributions] = useState(expense ? expense.contributions : []);
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost:7777/api/groups/${groupId}/members/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
          }
        });
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
      if (expense) {
        await axios.put(`http://localhost:7777/api/groups/${groupId}/expenses/${expense.id}/`, {
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
        alert('Expense updated successfully');
      } else {
        await axios.post(`http://localhost:7777/api/groups/${groupId}/expenses/`, {
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
      }
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Add expense error:', error);
      alert('Error adding expense');
    }
  };

  const handleAddContribution = () => {
    setContributions([...contributions, { username: '', amount: '' }]);
  };

  const handleRemoveContribution = (index) => {
    const newContributions = contributions.filter((_, i) => i !== index);
    setContributions(newContributions);
  };

  const handleContributionChange = (index, field, value) => {
    const newContributions = [...contributions];
    newContributions[index][field] = value;
    setContributions(newContributions);
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
              onChange={(e) => setDescription(e.target.value)}
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
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
                onChange={(e) => setSplitType(e.target.value)}
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
                sx={{ marginTop: '16px', color: '#178582', borderColor: '#178582' }}
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
