
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppBar, Toolbar, Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider } from '@mui/material';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

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
      setShowDetails(true);
    } else {
      setShowDetails(false);
      setExpenses([]);
      setBalances([]);
    }
  }, [fetchExpenses, fetchBalances, selectedGroup]);

  const handleGroupSelect = (group) => {
    if (selectedGroup && selectedGroup.id === group.id) {
      setSelectedGroup(null);
      setShowDetails(false);
    } else {
      setSelectedGroup(group);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#0A1828', minHeight: '100vh' }}>
   
      <AppBar position="static" sx={{ backgroundColor: '#BFA181', height:'10vh' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
            Expense Splitter Dashboard
          </Typography>
          <Button color="inherit" component={Link} to="/add-group" sx={{ color: '#0A1828' }}>
            Add Group
          </Button>
          {selectedGroup && (
            <Button color="inherit" onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)} sx={{ color: '#0A1828' }}>
              Add Expense
            </Button>
          )}
          <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
        <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582',textAlign: 'center', fontWeight: 'bold' }}>
            Welcome aboard! Splitting expenses has never been easier. 
           
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
            
            Let's Get Started!
          </Typography>
          <Box sx={{ width: '100%', marginBottom: '30px' }}>
            <Typography variant="h6" sx={{ color: '#178582', fontWeight: 'bold', marginTop:'20px', textAlign: 'center' }}>Groups</Typography>
            <TableContainer component={Paper} sx={{ backgroundColor: '#83afaf' }}>
              <Table>
                <TableBody>
                  {groups.map((group) => (
                    <React.Fragment key={group.id}>
                      <TableRow sx={{ backgroundColor: selectedGroup && selectedGroup.id === group.id ? '#BFA181' : 'inherit' }}>
                        <TableCell sx={{ color:  '#0A1828' , fontWeight: 'bold' }}>{group.name}</TableCell>
                        <TableCell>
                          <Button
                            sx={{
                              color: '#BFA181',
                              backgroundColor: '#0A1828',
                            }}
                            onClick={() => handleGroupSelect(group)}
                          >
                            {selectedGroup && selectedGroup.id === group.id ? "Deselect" : "Select"}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {showDetails && selectedGroup && selectedGroup.id === group.id && (
                        <TableRow>
                          <TableCell colSpan={2} sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
                            <Box sx={{ color: '#BFA181' }}>
                              <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Group Members</Typography>
                              {selectedGroup.members.map((member, index) => (
                                <Typography key={index}>{member}</Typography>
                              ))}
                              <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />

                              <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Expenses</Typography>
                              {expenses.map((expense) => (
                                <Typography key={expense.id}>
                                  {expense.description} : {expense.amount}
                                </Typography>
                              ))}
                              <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />

                              <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Balances</Typography>
                              <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Owed By:</Typography>
                              {balances.filter(balance => balance.owed_by).map((balance, index) => (
                                <Typography key={index}>
                                  {balance.owed_by} owes {balance.amount}
                                </Typography>
                              ))}
                              <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
                              <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Owed To:</Typography>
                              {balances.filter(balance => balance.owed_to).map((balance, index) => (
                                <Typography key={index}>
                                  {balance.owed_to} is owed {balance.amount}
                                </Typography>
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router';
// import { AppBar, Toolbar, Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider, IconButton } from '@mui/material';
// import axios from 'axios';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

// const Home = () => {
//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [balances, setBalances] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);

//   const fetchGroups = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       }

//       const response = await axios.get('http://localhost:7777/api/groups/', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setGroups(response.data);
//     } catch (error) {
//       console.error('Failed to fetch groups:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   }, [navigate]);

//   const fetchExpenses = useCallback(async () => {
//     if (!selectedGroup) return;

//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       }

//       const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/expenses/`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setExpenses(response.data);
//     } catch (error) {
//       console.error('Failed to fetch expenses:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   }, [navigate, selectedGroup]);

//   const fetchBalances = useCallback(async () => {
//     if (!selectedGroup) return;

//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       }

//       const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/summary/`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       setBalances(response.data.balances);
//     } catch (error) {
//       console.error('Failed to fetch balances:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   }, [navigate, selectedGroup]);

//   useEffect(() => {
//     fetchGroups();
//   }, [fetchGroups]);

//   useEffect(() => {
//     if (selectedGroup) {
//       fetchExpenses();
//       fetchBalances();
//       setShowDetails(true);
//     } else {
//       setShowDetails(false);
//       setExpenses([]);
//       setBalances([]);
//     }
//   }, [fetchExpenses, fetchBalances, selectedGroup]);

//   const handleGroupSelect = (group) => {
//     if (selectedGroup && selectedGroup.id === group.id) {
//       setSelectedGroup(null);
//       setShowDetails(false);
//     } else {
//       setSelectedGroup(group);
//     }
//   };

//   const handleEditGroup = (group) => {
//     navigate('/add-group', { state: { group } });
//   };

//   const handleDeleteGroup = async (groupId) => {
//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       }

//       await axios.delete(`http://localhost:7777/api/groups/${groupId}/edit/`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       fetchGroups();
//     } catch (error) {
//       console.error('Failed to delete group:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   };

//   const handleEditExpense = (expense) => {
//     navigate(`/groups/${selectedGroup.id}/add-expense`, { state: { expense } });
//   };

//   const handleDeleteExpense = async (expenseId) => {
//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       }

//       await axios.delete(`http://localhost:7777/api/groups/${selectedGroup.id}/expenses/${expenseId}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       fetchExpenses();
//     } catch (error) {
//       console.error('Failed to delete expense:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   };

//   return (
//     <Box sx={{ backgroundColor: '#0A1828', minHeight: '100vh' }}>
//       <AppBar position="static" sx={{ backgroundColor: '#BFA181', height: '10vh' }}>
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
//             Expense Splitter Dashboard
//           </Typography>
//           <Button color="inherit" component={Link} to="/add-group" sx={{ color: '#0A1828' }}>
//             Add Group
//           </Button>
//           {selectedGroup && (
//             <Button color="inherit" onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)} sx={{ color: '#0A1828' }}>
//               Add Expense
//             </Button>
//           )}
//           <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth="md" sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
//         <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
//           <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
//             Welcome aboard! Splitting expenses has never been easier.
//           </Typography>
//           <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
//             Let's Get Started!
//           </Typography>
//           <Box sx={{ width: '100%', marginBottom: '30px' }}>
//             <Typography variant="h6" sx={{ color: '#178582', fontWeight: 'bold', marginTop: '20px', textAlign: 'center' }}>Groups</Typography>
//             <TableContainer component={Paper} sx={{ backgroundColor: '#83afaf' }}>
//               <Table>
//                 <TableBody>
//                   {groups.map((group) => (
//                     <React.Fragment key={group.id}>
//                       <TableRow sx={{ backgroundColor: selectedGroup && selectedGroup.id === group.id ? '#BFA181' : 'inherit' }}>
//                         <TableCell sx={{ color: '#0A1828', fontWeight: 'bold' }}>{group.name}</TableCell>
//                         <TableCell>
//                           <Button
//                             sx={{
//                               color: '#BFA181',
//                               backgroundColor: '#0A1828',
//                             }}
//                             onClick={() => handleGroupSelect(group)}
//                           >
//                             {selectedGroup && selectedGroup.id === group.id ? "Deselect" : "Select"}
//                           </Button>
//                         </TableCell>
//                         {selectedGroup && selectedGroup.id === group.id && (
//                           <TableCell>
//                             <IconButton onClick={() => handleEditGroup(group)} sx={{ color: '#0A1828' }}>
//                               <EditIcon />
//                             </IconButton>
//                             <IconButton onClick={() => handleDeleteGroup(group.id)} sx={{ color: '#0A1828' }}>
//                               <DeleteIcon />
//                             </IconButton>
//                           </TableCell>
//                         )}
//                       </TableRow>
//                       {showDetails && selectedGroup && selectedGroup.id === group.id && (
//                         <TableRow>
//                           <TableCell colSpan={3} sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
//                             <Box sx={{ color: '#BFA181' }}>
//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Group Members</Typography>
//                               {selectedGroup.members.map((member, index) => (
//                                 <Typography key={index}>{member}</Typography>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />

//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Expenses</Typography>
//                               {expenses.map((expense) => (
//                                 <Box key={expense.id} display="flex" alignItems="center" justifyContent="space-between">
//                                   <Typography>
//                                     {expense.description} : {expense.amount}
//                                   </Typography>
//                                   <Box>
//                                     <IconButton onClick={() => handleEditExpense(expense)} sx={{ color: '#BFA181' }}>
//                                       <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{ color: '#BFA181' }}>
//                                     <DeleteIcon />
//                                     </IconButton>
//                                   </Box>
//                                 </Box>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />

//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Balances</Typography>
//                               <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Owed By:</Typography>
//                               {balances.filter(balance => balance.owed_by).map((balance, index) => (
//                                 <Typography key={index}>
//                                   {balance.owed_by} owes {balance.amount}
//                                 </Typography>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
//                               <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>Owed To:</Typography>
//                               {balances.filter(balance => balance.owed_to).map((balance, index) => (
//                                 <Typography key={index}>
//                                   {balance.owed_to} is owed {balance.amount}
//                                 </Typography>
//                               ))}
//                             </Box>
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </React.Fragment>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Home;

