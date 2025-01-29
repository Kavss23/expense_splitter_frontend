



// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate, Link } from 'react-router';
// import { AppBar, Toolbar, Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider, Avatar } from '@mui/material';
// import axios from 'axios';
// import { AccountCircle } from '@mui/icons-material';
// import GroupIcon from '@mui/icons-material/Group';
// import IconButton from '@mui/material/IconButton';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddCircleIcon from '@mui/icons-material/AddCircle';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
// import SyncIcon from '@mui/icons-material/Sync'; // Fetching groups and expenses
// import ReceiptIcon from '@mui/icons-material/Receipt'; // Expenses
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Balances
// import PeopleIcon from '@mui/icons-material/People'; // Group Members

// const Home = () => {
//   const navigate = useNavigate();
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [expenses, setExpenses] = useState([]);
//   const [balances, setBalances] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);
//   const username = localStorage.getItem('username');
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

//       navigate('/');
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
//           <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
//             <AccountCircle sx={{ color: '#0A1828', fontSize: '35px' }} />
//             <Typography variant="h6" sx={{ color: '#0A1828', marginLeft: 0.5 }}>
//               {username ? username[0].toUpperCase() : 'G'}
//             </Typography>
//           </Box>
//           <Button color="inherit" component={Link} to="/add-group" sx={{ color: '#0A1828' }}>
//             <GroupIcon sx={{ marginRight: 1 }} />
//             Add Group
//           </Button>
//           {selectedGroup && (
//             <Button color="inherit" onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)} sx={{ color: '#0A1828' }}>
//               <AddCircleIcon sx={{ marginRight: 1 }} />
//               Add Expense
//             </Button>
//           )}
//           <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
//             <ExitToAppIcon sx={{ marginRight: 1 }} />
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
//                       <TableRow
//                         onClick={() => handleGroupSelect(group)}
//                         sx={{
//                           backgroundColor: selectedGroup && selectedGroup.id === group.id ? '#BFA181' : 'inherit',
//                           '&:hover': {
//                             cursor: 'pointer',
//                             backgroundColor: '#BFA181'
//                           }
//                         }}
//                       >
//                         <TableCell sx={{ color: '#0A1828', fontWeight: 'bold' }}>{group.name}</TableCell>
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
//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                                 <PeopleIcon sx={{ marginRight: 1 }} />
//                                 Group Members
//                               </Typography>
//                               {selectedGroup.members.map((member, index) => (
//                                 <Typography key={index}>{member}</Typography>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                                 <ReceiptIcon sx={{ marginRight: 1 }} />
//                                 Expenses
//                               </Typography>
//                               {expenses.map((expense) => (
//                                 <Box key={expense.id} display="flex" alignItems="center" justifyContent="space-between">
//                                   <Typography>
//                                     {expense.description} : Rs. {expense.amount}
//                                   </Typography>
//                                   <Box>
//                                     <IconButton onClick={() => handleEditExpense(expense)} sx={{ color: '#BFA181' }}>
//                                       <EditIcon />
//                                     </IconButton>
//                                     <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{ color: '#BFA181' }}>
//                                       <DeleteIcon />
//                                     </IconButton>
//                                   </Box>
//                                 </Box>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
//                               <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
//                                 <AccountBalanceIcon sx={{ marginRight: 1 }} />
//                                 Balances
//                               </Typography>
//                               <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>
//                                 Owed By:
//                               </Typography>
//                               {balances.filter(balance => balance.owed_by).map((balance, index) => (
//                                 <Typography key={index}>
//                                   {balance.owed_by} owes Rs. {balance.amount}
//                                 </Typography>
//                               ))}
//                               <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
//                               <Typography variant="subtitle1" sx={{ color: '#BFA181', fontWeight: 'bold' }}>
//                                 Owed To:
//                               </Typography>
//                               {balances.filter(balance => balance.owed_to).map((balance, index) => (
//                                 <Typography key={index}>
//                                   {balance.owed_to} is owed Rs. {balance.amount}
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





import React, { useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppBar, Toolbar, Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider, Avatar} from '@mui/material';
import axios from 'axios';
 import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import { AccountCircle } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import SyncIcon from '@mui/icons-material/Sync'; // Fetching groups and expenses
import ReceiptIcon from '@mui/icons-material/Receipt'; // Expenses
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Balances
import PeopleIcon from '@mui/icons-material/People'; // Group Members
import { useDispatch, useSelector } from 'react-redux';
import { setGroups, setSelectedGroup, setExpenses, setBalances, clearSelectedGroup } from '../redux/homeSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const groups = useSelector(state => state.home.groups);
    const selectedGroup = useSelector(state => state.home.selectedGroup);
    const expenses = useSelector(state => state.home.expenses);
    const balances = useSelector(state => state.home.balances);
    const username = localStorage.getItem('username');

    const fetchGroups = useCallback(async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/logout');
                return;
            }

            const response = await axios.get('http://localhost:7777/api/groups/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(setGroups(response.data));
        } catch (error) {
            console.error('Failed to fetch groups:', error);
            if (error.response && error.response.status === 401) {
                navigate('/logout');
            }
        }
    }, [navigate, dispatch]);

    const fetchExpenses = useCallback(async () => {
        if (!selectedGroup) return;

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/logout');
                return;
            }

            const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/expenses/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(setExpenses(response.data));
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
            if (error.response && error.response.status === 401) {
                navigate('/logout');
            }
        }
    }, [navigate, selectedGroup, dispatch]);

    const fetchBalances = useCallback(async () => {
        if (!selectedGroup) return;

        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/logout');
                return;
            }

            const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroup.id}/summary/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            dispatch(setBalances(response.data.balances));
        } catch (error) {
            console.error('Failed to fetch balances:', error);
            if (error.response && error.response.status === 401) {
                navigate('/logout');
            }
        }
    }, [navigate, selectedGroup, dispatch]);

    useEffect(() => {
        fetchGroups();
    }, [fetchGroups]);

    useEffect(() => {
        if (selectedGroup) {
            fetchExpenses();
            fetchBalances();
        } else {
            dispatch(setExpenses([]));
            dispatch(setBalances([]));
        }
    }, [fetchExpenses, fetchBalances, selectedGroup, dispatch]);

    const handleGroupSelect = (group) => {
        if (selectedGroup && selectedGroup.id === group.id) {
            dispatch(clearSelectedGroup());
        } else {
            dispatch(setSelectedGroup(group));
        }
    };

    const handleEditGroup = (group) => {
        navigate('/add-group', { state: { group } });
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/logout');
                return;
            }

            await axios.delete(`http://localhost:7777/api/groups/${groupId}/edit/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchGroups();
        } catch (error) {
            console.error('Failed to delete group:', error);
            if (error.response && error.response.status === 401) {
                navigate('/logout');
            }
        }
    };

    const handleEditExpense = (expense) => {
        navigate(`/groups/${selectedGroup.id}/add-expense`, { state: { expense } });
    };

    const handleDeleteExpense = async (expenseId) => {
        try {
            const token = localStorage.getItem('jwt_token');
            if (!token) {
                navigate('/logout');
                return;
            }

            await axios.delete(`http://localhost:7777/api/groups/<span class="math-inline">\{selectedGroup\.id\}/expenses/</span>{expenseId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
            if (error.response && error.response.status === 401) {
                navigate('/logout');
            }
        }
    };

  
    return (
      <Box sx={{ backgroundColor: '#0A1828', minHeight: '100vh' }}>
          <AppBar position="static" sx={{ backgroundColor: '#BFA181', height: '10vh' }}>
              <Toolbar>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
                      Expense Splitter Dashboard
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}>
                      <AccountCircle sx={{ color: '#0A1828', fontSize: '35px' }} />
                      <Typography variant="h6" sx={{ color: '#0A1828', marginLeft: 0.5 }}>
                          {username ? username[0].toUpperCase() : 'G'}
                      </Typography>
                  </Box>
                  <Button color="inherit" component={Link} to="/add-group" sx={{ color: '#0A1828' }}>
                      <GroupIcon sx={{ marginRight: 1 }} />
                      Add Group
                  </Button>
                  {selectedGroup && (
                      <Button color="inherit" onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)} sx={{ color: '#0A1828' }}>
                          <AddCircleIcon sx={{ marginRight: 1 }} />
                          Add Expense
                      </Button>
                  )}
                  <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
                      <ExitToAppIcon sx={{ marginRight: 1 }} />
                      Logout
                  </Button>
              </Toolbar>
          </AppBar>
          <Container maxWidth="md" sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
              <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
                      Welcome aboard! Splitting expenses has never been easier.
                  </Typography>
                  <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
                      Let's Get Started!
                  </Typography>
                  <Box sx={{ width: '100%', marginBottom: '30px' }}>
                      <Typography variant="h6" sx={{ color: '#178582', fontWeight: 'bold', marginTop: '20px', textAlign: 'center' }}>Groups</Typography>
                      <TableContainer component={Paper} sx={{ backgroundColor: '#83afaf' }}>
                          <Table>
                              <TableBody>
                                  {groups.map((group) => (
                                      <React.Fragment key={group.id}>
                                          <TableRow
                                              onClick={() => handleGroupSelect(group)}
                                              sx={{
                                                  backgroundColor: selectedGroup && selectedGroup.id === group.id ? '#BFA181' : 'inherit',
                                                  '&:hover': {
                                                      cursor: 'pointer',
                                                      backgroundColor: '#BFA181'
                                                  }
                                              }}
                                          >
                                              <TableCell sx={{ color: '#0A1828', fontWeight: 'bold' }}>{group.name}</TableCell>
                                              {selectedGroup && selectedGroup.id === group.id && (
                                                  <TableCell>
                                                      <IconButton onClick={() => handleEditGroup(group)} sx={{ color: '#0A1828' }}>
                                                          <EditIcon />
                                                      </IconButton>
                                                      <IconButton onClick={() => handleDeleteGroup(group.id)} sx={{ color: '#0A1828' }}>
                                                          <DeleteIcon />
                                                      </IconButton>
                                                  </TableCell>
                                              )}
                                          </TableRow>
                                          {selectedGroup && selectedGroup.id === group.id && (
                                              <TableRow>
                                                  <TableCell colSpan={3} sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
                                                      <Box sx={{ color: '#BFA181' }}>
                                                          <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                              <PeopleIcon sx={{ marginRight: 1 }} />
                                                              Group Members
                                                          </Typography>
                                                          {selectedGroup.members.map((member, index) => (
                                                              <Typography key={index}>{member}</Typography>
                                                          ))}
                                                          <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
                                                          <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                              <ReceiptIcon sx={{ marginRight: 1 }} />
                                                              Expenses
                                                          </Typography>
                                                          {expenses.map((expense) => (
                                                              <Box key={expense.id} display="flex" alignItems="center" justifyContent="space-between">
                                                                  <Typography>
                                                                      {expense.description} : Rs. {expense.amount}
                                                                  </Typography>
                                                                  <Box>
                                                                      <IconButton onClick={() => handleEditExpense(expense)} sx={{ color: '#BFA181' }}>
                                                                          <EditIcon />
                                                                      </IconButton>
                                                                      <IconButton onClick={() => handleDeleteExpense(expense.id)} sx={{ color: '#BFA181' }}>
                                                                          <DeleteIcon />
                                                                      </IconButton>
                                                                  </Box>
                                                              </Box>
                                                          ))}
                                                          <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
                                                          <Typography variant="h6" sx={{ color: '#BFA181', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                                                              <AccountBalanceIcon sx={{ marginRight: 1 }} />
                                                              Balances
                                                          </Typography>
                                                          <Typography variant="subtitle1" sx={{ color: '#BFA182', fontWeight: 'bold' }}>
                                                              Owed By:
                                                          </Typography>
                                                          {balances.filter(balance => balance.owed_by).map((balance, index) => (
                                                              <Typography key={index}>
                                                                  {balance.owed_by} owes Rs. {balance.amount}
                                                              </Typography>
                                                          ))}
                                                          <Divider sx={{ my: 1, backgroundColor: '#BFA181' }} />
                                                          <Typography variant="subtitle1" sx={{ color: '#BFA182', fontWeight: 'bold' }}>
                                                              Owed To:
                                                          </Typography>
                                                          {balances.filter(balance => balance.owed_to).map((balance, index) => (
                                                              <Typography key={index}>
                                                                  {balance.owed_to} is owed Rs. {balance.amount}
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

