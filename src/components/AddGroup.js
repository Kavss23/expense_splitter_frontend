

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, Paper, useMediaQuery,IconButton, Snackbar, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AccountCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setGroupName, setSelectedMembers, clearGroupForm } from '../redux/groupSlice'; // Adjust path as needed

const AddGroup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const group = location.state ? location.state.group : null; // Get group data if editing, null otherwise
    const dispatch = useDispatch();
    const username = localStorage.getItem('username');
    const name = useSelector(state => state.groups.name); //get group name,users,selected members from redux store and store 
    const users = useSelector(state => state.groups.users);
    const selectedMembers = useSelector(state => state.groups.selectedMembers);
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    

    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('jwt_token');
                const response = await axios.get('http://localhost:7777/api/users/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                dispatch(setUsers(response.data));
            } catch (error) {
                console.error('Failed to fetch users:', error);
                setSnackbarMessage('Failed to fetch users');
                setSeverity('error');
                setOpen(true);
            }
        };
        fetchUsers();
    }, [dispatch]);

    useEffect(() => {
        if (group && users.length > 0) { // If editing a group and users are loaded
            dispatch(setGroupName(group.name)); // Set group name in Redux store
            const selectedIds = group.members // Map member usernames to user IDs
                .map(member => {
                    const user = users.find(user => user.username === member);
                    return user ? user.id : null;
                })
                .filter(id => id !== null); // Filter out null IDs (users not found)
            dispatch(setSelectedMembers(selectedIds));
        } else if (!group) {
            dispatch(clearGroupForm()); // Clear the group form in Redux store when adding grp
        }
    }, [group, users, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');
    
        if (!name) {
            setSnackbarMessage('Error: Group name is required.');
            setSeverity('error');
            setOpen(true);
            return;
        }
    
        if (selectedMembers.length === 0) {
            setSnackbarMessage('Error: Please add at least one member to the group.');
            setSeverity('error');
            setOpen(true);
            return;
        }
    
        try {
            if (group) { //if grp exists 
                await axios.patch(`http://localhost:7777/api/groups/${group.id}/edit/`, { name }, 
                { headers: 
                    { Authorization: `Bearer ${token}` 
                }
             });
                setSnackbarMessage('Group updated successfully!');
                setSeverity('success');
            } else {
                const createGroupResponse = await axios.post('http://localhost:7777/api/groups/', { name }, 
                { headers: 
                    { Authorization: `Bearer ${token}` } 
                });
                const groupId = createGroupResponse.data.id; //id of created group
                const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username); //members names of those in grp
                await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, { usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } }); //add  members
                setSnackbarMessage('Group created successfully!');
                setSeverity('success');
            }
            setOpen(true);
            dispatch(clearGroupForm());
            navigate('/');
        } catch (error) {
            console.error(`Error ${group ? 'updating' : 'creating'} group:`, error);
            setSnackbarMessage(`Error ${group ? 'updating' : 'creating'} group. Name already exists`);
            setSeverity('error');
            setOpen(true);
        }
    };
    

    const handleAddMembers = async () => {
        const token = localStorage.getItem('jwt_token');
    
        if (selectedMembers.length === 0) {
            setSnackbarMessage('Error: Please select members to add.');
            setSeverity('error');
            setOpen(true);
            return;
        }
    
        try { //transform member id to usernames
            const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, { action: 'add', usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } });
            setSnackbarMessage('Members added successfully!');
            setSeverity('success');
            setOpen(true);
            navigate('/');
        } catch (error) {
            console.error('Error adding members:', error);
            setSnackbarMessage('Error adding members');
            setSeverity('error');
            setOpen(true);
        }
    };
    
    const handleRemoveMembers = async () => {
        const token = localStorage.getItem('jwt_token');
    
        if (selectedMembers.length === 0) {
            setSnackbarMessage('Error: Please select members to remove.');
            setSeverity('error');
            setOpen(true);
            return;
        }
    
        try {
            const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, { action: 'remove', usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } });
            setSnackbarMessage('Members removed successfully!');
            setSeverity('success');
            setOpen(true);
            navigate('/');
            dispatch(setSelectedMembers([]));
        } catch (error) {
            console.error('Error removing members:', error);
            setSnackbarMessage('Error removing members');
            setSeverity('error');
            setOpen(true);
        }
    };
    

    

    const handleMembersChange = (event) => {
        dispatch(setSelectedMembers(event.target.value));
    };

    const handleNameChange = (event) => {
        dispatch(setGroupName(event.target.value));
    };

    const handleSnackbarClose = ( reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <>
            <AppBar position="static" sx={{ backgroundColor: '#BFA181' }}>
        <Toolbar sx={{ flexDirection: isSmallScreen ? 'column' : 'row', alignItems: isSmallScreen ? 'stretch' : 'center' }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828', textAlign: isSmallScreen ? 'center' : 'left', marginBottom: isSmallScreen ? 1 : 0 }}>
            Expense Splitter Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isSmallScreen ? 'center' : 'flex-end', width: isSmallScreen ? '100%' : 'auto' }}>
            <AccountCircle sx={{ color: '#0A1828', fontSize: '25px', marginRight: isSmallScreen ? 0 : 1 }} />
            <Typography variant="h6" sx={{ color: '#0A1828', marginRight: isSmallScreen ? 0 : 1 }}>
              {username ? username[0].toUpperCase() : 'G'}
            </Typography>
            <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#0A1828', display: 'flex', alignItems: 'center', margin: isSmallScreen ? '0 auto' : 0 }}>
              <HomeIcon sx={{ marginRight: 1 }} />
              Home
            </Button>
            <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828', display: 'flex', alignItems: 'center', margin: isSmallScreen ? '0 auto' : 0 }}>
              <ExitToAppIcon sx={{ marginRight: 1 }} />
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
                sx={{ backgroundColor: '#0A1828', width: '100%', height: '90vh' }}>
                <Paper elevation={3} sx={{ padding: isSmallScreen ? '1rem' : '2rem', backgroundColor: '#0A1828', border: '2px solid #BFA181', borderRadius: '12px', width: isSmallScreen ? '90%' : '350px', boxSizing: 'border-box', }}>
                    <Typography variant={isSmallScreen ? 'h5' : 'h4'} component="h6" gutterBottom sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}>
                        {group ? 'Edit Group' : 'Add Group'}
                    </Typography>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <Typography variant="body1" sx={{ color: '#BFA181', marginTop: '10px' }}>
                            Group Name
                        </Typography>
                        <TextField variant="outlined" fullWidth margin="normal" value={name} onChange={handleNameChange} required
                            InputProps={{ style: { fontSize: '0.875rem', border: '1px solid #BFA181', borderRadius: '8px', color: '#178582' } }} />
                        <FormControl fullWidth margin="normal">
                            <Typography variant="body1" sx={{ color: '#BFA181', marginTop: '10px' }}>
                                Members
                            </Typography>
                            <Select multiple value={selectedMembers} onChange={handleMembersChange} //drop down for members registred in app
                                renderValue={(selected) => selected.map((memberId) => users.find((user) => user.id === memberId)?.username || memberId).join(', ')}
                                sx={{ color: '#178582', border: '1px solid #BFA181', borderRadius: '8px', marginTop: '20px', '& .MuiSvgIcon-root': { color: '#BFA181' } }}>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                                ))}
                            </Select>
                            {group && ( //if grp exists
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                    <IconButton onClick={handleAddMembers} sx={{ color: '#BFA181' }}>
                                        <AddIcon />
                                        <Typography>Add members</Typography>
                                    </IconButton>
                                    <IconButton onClick={handleRemoveMembers} sx={{ color: '#BFA181' }}>
                                        <DeleteIcon />
                                        <Typography>Delete members</Typography>
                                    </IconButton>
                                </Box>
                            )}
                        </FormControl>
                        <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '16px', backgroundColor: '#BFA181', color: '#0A1828' }}>
                            {group ? 'Update Group Name' : 'Add Group'}
                        </Button>
                    </form>
                </Paper>
            </Box>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={severity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};
export default AddGroup;    