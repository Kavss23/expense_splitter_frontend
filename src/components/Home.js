import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AppBar, Toolbar, Button, Dialog, DialogTitle, DialogContent, DialogActions,Typography, useMediaQuery,Container, Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Divider, Avatar,Snackbar, Alert} from '@mui/material';
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
import OverallBalanceSummary from './TotalBalance';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const groups = useSelector(state => state.home.groups);
    const selectedGroup = useSelector(state => state.home.selectedGroup);
    const expenses = useSelector(state => state.home.expenses);
    const balances = useSelector(state => state.home.balances);

    const username = localStorage.getItem('username');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleteType, setDeleteType] = useState(null); 
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
  

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
            if (error.response) {
                showSnackbar(`Error fetching groups: ${error.response.data.message || error.response.status}`, 'error');
                if (error.response.status === 401) {
                    navigate('/logout');
                }
            } else {
                showSnackbar("Error fetching groups: Network error", 'error');
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
            if (error.response) {
                showSnackbar(`Error fetching expenses: ${error.response.data.message || error.response.status}`, 'error');
                if (error.response.status === 401) {
                    navigate('/logout');
                }
            } else {
                showSnackbar("Error fetching expenses: Network error", 'error');
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
            if (error.response) {
                showSnackbar(`No balance found: ${error.response.data.message || error.response.status}`, 'error');
                if (error.response.status === 401) {
                    navigate('/logout');
                }
            } else {
                showSnackbar("Error fetching balances: Network error", 'error');
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

    
    const showConfirmDialog = (item, type) => {
        setItemToDelete(item);
        setDeleteType(type);
        setConfirmDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmDialogOpen(false);

        if (deleteType === 'group') {
            await handleDeleteGroup(itemToDelete.id); 
        } else if (deleteType === 'expense') {
            await handleDeleteExpense(itemToDelete.id);
        }
        setItemToDelete(null);
        setDeleteType(null);

        // Show snackbar message and redirect after 2 seconds
        setSnackbarOpen(true);
        setTimeout(() => {
            setSnackbarOpen(false);
            navigate('/');
        }, 2000);
    };

    const handleCloseConfirmDialog = () => {
        setConfirmDialogOpen(false);
        setItemToDelete(null);
        setDeleteType(null);
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
            showSnackbar('Group deleted successfully', 'success'); // Success message
        } catch (error) {
            console.error('Failed to delete group:', error);
            if (error.response) {
                showSnackbar(`Error deleting group: ${error.response.data.message || error.response.status}`, 'error');
                if (error.response.status === 401) {
                    navigate('/logout');
                }
            } else {
                showSnackbar("Error deleting group: Network error", 'error');
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

            await axios.delete(`http://localhost:7777/api/groups/${selectedGroup.id}/expenses/${expenseId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchExpenses();
            showSnackbar('Expense deleted successfully', 'success'); // Success message
        } catch (error) {
            console.error('Failed to delete expense:', error);
            if (error.response) {
                showSnackbar(`Error deleting expense: ${error.response.data.message || error.response.status}`, 'error');
                if (error.response.status === 401) {
                    navigate('/logout');
                }
            } else {
                showSnackbar("Error deleting expense: Network error", 'error');
            }
            
        }
    };

  
    return (
        <Box sx={{ backgroundColor: '#0A1828', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ backgroundColor: '#BFA181', height: isSmallScreen ? 'auto' : '10vh' }}>
          <Toolbar sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'stretch' : 'center' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828', textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 1 : 0 }}>
              Expense Splitter Dashboard
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-end', width: isSmallScreen ? '100%' : 'auto', marginBottom: isSmallScreen ? 1 : 0 }}>
              <AccountCircle sx={{ color: '#0A1828', fontSize: isSmallScreen ? '25px' : '35px', marginRight: isSmallScreen ? 0 : 1 }} />
              <Typography variant="h6" sx={{ color: '#0A1828', marginRight: isSmallScreen ? 0 : 1 }}>
                {username ? username[0].toUpperCase() : 'G'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-end' }}>
              <Button color="inherit" component={Link} to="/add-group" sx={{ color: '#0A1828', marginBottom: isSmallScreen ? 1 : 0 }}>
                <GroupIcon sx={{ marginRight: 1 }} />
                Add Group
              </Button>
              {selectedGroup && (
                <Button color="inherit" onClick={() => navigate(`/groups/${selectedGroup.id}/add-expense`)} sx={{ color: '#0A1828', marginBottom: isSmallScreen ? 1 : 0 }}>
                  <AddCircleIcon sx={{ marginRight: 1 }} />
                  Add Expense
                </Button>
              )}
              <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828', marginBottom: isSmallScreen ? 1 : 0 }}>
                <ExitToAppIcon sx={{ marginRight: 1 }} />
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      <OverallBalanceSummary/>
      
          <Container maxWidth="md" sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
              <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                
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
                                                      
                                },
                                display:'flex',
                            }}
                        >
                        <TableCell sx={{ color: '#0A1828', fontWeight: 'bold', flex:1 }}>{group.name}</TableCell>
                            {selectedGroup && selectedGroup.id === group.id && (
                                <TableCell>
                                 <IconButton onClick={() => handleEditGroup(group)} sx={{ color: '#0A1828' }}>
                                    <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => showConfirmDialog(group, 'group')} sx={{ color: '#0A1828' }}>
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
                            <Box key={expense.id} mb={2} p={2} border={1} borderColor="#BFA181" borderRadius={2}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography>
                                {expense.description} : Rs. {expense.amount}
                            </Typography>
                        <Box>
                    <IconButton onClick={() => handleEditExpense(expense)} sx={{ color: '#BFA181' }}>
                    <EditIcon />
                    </IconButton>
                <IconButton onClick={() => showConfirmDialog(expense, 'expense')} sx={{ color: '#BFA181' }}>
                <DeleteIcon />
                </IconButton>
            </Box>
        </Box>

        {/* Contributions List */}
            <Box mt={1}>
                {expense.contributions.map((contribution) => (
                <Box key={contribution.id} display="flex" justifyContent="space-between">
                    <Typography variant="body2">{contribution.user}</Typography>
                    <Typography variant="body2">Rs. {contribution.amount}</Typography>
                </Box>
            ))}
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
          <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this {deleteType}?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
          <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        
      </Box>
  );
};

export default Home;

