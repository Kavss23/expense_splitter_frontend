// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, Paper, IconButton } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';

// const AddGroup = () => {
//     const [name, setName] = useState('');
//     const [users, setUsers] = useState([]);
//     const [selectedMembers, setSelectedMembers] = useState([]);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const group = location.state ? location.state.group : null;
//     const loggedInUserId = 1; // Replace with actual logic to get the logged-in user ID

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const token = localStorage.getItem('jwt_token');
//                 const response = await axios.get('http://localhost:7777/api/users/', {
//                     headers: { Authorization: `Bearer ${token}` }
//                 });
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Failed to fetch users:', error);
//             }
//         };
//         fetchUsers();
//     }, []);

//     useEffect(() => {
//         if (group && users.length > 0) {
//             setName(group.name);
//             const selectedIds = group.members
//                 .map(member => {
//                     const user = users.find(user => user.username === member);
//                     return user ? user.id : null;
//                 })
//                 .filter(id => id !== null);
//             setSelectedMembers(selectedIds);
//         }
//     }, [group, users]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem('jwt_token');

//         try {
//             if (group) {
//                 // Update group name
//                 await axios.patch(`http://localhost:7777/api/groups/${group.id}/edit/`, 
//                     { name }, 
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 alert('Group updated successfully!');
//             } else {
//                 // Create a new group
//                 const createGroupResponse = await axios.post('http://localhost:7777/api/groups/', 
//                     { name }, 
//                     { headers: { Authorization: `Bearer ${token}` } }
//                 );

//                 const groupId = createGroupResponse.data.id;

//                 // Add members to the new group
//                 const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
//                 await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, { usernames: memberUsernames }, {
//                   headers: {
//                        Authorization: `Bearer ${token}`
//                            }
//                 });
//                 alert('Group created successfully!');
//             }

//             setName('');
//             setSelectedMembers([]);
//             navigate('/');
//         } catch (error) {
//             console.error(`Error ${group ? 'updating' : 'creating'} group:`, error);
//             alert(`Error ${group ? 'updating' : 'creating'} group`);
//         }
//     };

//     const handleAddMembers = async () => {
//         const token = localStorage.getItem('jwt_token');

//         try {
//             const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            
//             await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, 
//                 { action: 'add', usernames: memberUsernames }, 
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             alert('Members added successfully!');
//             navigate('/');
//         } catch (error) {
//             console.error('Error adding members:', error);
//             alert('Error adding members');
//         }
//     };

//     const handleRemoveMembers = async () => {
//         const token = localStorage.getItem('jwt_token');

//         try {
//             const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            
//             await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, 
//                 { action: 'remove', usernames: memberUsernames }, 
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );

//             alert('Members removed successfully!');
//             navigate('/');
//             setSelectedMembers([]);
//         } catch (error) {
//             console.error('Error removing members:', error);
//             alert('Error removing members');
//         }
//     };

//     const handleMembersChange = (event) => {
//         setSelectedMembers(event.target.value);
//     };

//     return (
//         <>
//             <AppBar position="static" sx={{ backgroundColor: '#BFA181' }}>
//                 <Toolbar>
//                     <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#0A1828' }}>
//                         Expense Splitter Dashboard
//                     </Typography>
//                     <Button color="inherit" onClick={() => navigate('/')} sx={{ color: '#0A1828' }}>
//                         Home
//                     </Button>
//                     <Button color="inherit" onClick={() => navigate('/logout')} sx={{ color: '#0A1828' }}>
//                         Logout
//                     </Button>
//                 </Toolbar>
//             </AppBar>
//             <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
//                 sx={{ backgroundColor: '#0A1828', width: '100%', height: '90vh' }}>
//                 <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#0A1828', border: '2px solid #BFA181', borderRadius: '12px', width: '350px' }}>
//                     <Typography variant="h4" component="h6" gutterBottom sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}>
//                         {group ? 'Edit Group' : 'Add Group'}
//                     </Typography>
//                     <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//                         <Typography variant="body1" sx={{ color: '#BFA181', marginTop: '10px' }}>
//                             Group Name
//                         </Typography>
//                         <TextField variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} required
//                             InputProps={{ style: { fontSize: '0.875rem', border: '1px solid #BFA181', borderRadius: '8px', color: '#178582' } }} />
//                         <FormControl fullWidth margin="normal">
//                         <Typography variant="body1" sx={{ color: '#BFA181', marginTop: '10px' }}>
//                             Members
//                         </Typography>
//                             <Select  multiple value={selectedMembers} onChange={handleMembersChange}
//                                 renderValue={(selected) => selected.map((memberId) => users.find((user) => user.id === memberId)?.username || memberId).join(', ')}
//                                 sx={{ color: '#178582', border: '1px solid #BFA181', borderRadius: '8px', marginTop: '20px', '& .MuiSvgIcon-root': { color: '#BFA181' } }}>
//                                 {users.map((user) => (
//                                     <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
//                                 ))}
//                             </Select>
//                             {group && (
//                                 <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
//                                     <IconButton onClick={handleAddMembers} sx={{ color: '#BFA181' }}>
//                                       <AddIcon />
//                                       <Typography>Add members</Typography>
//                                     </IconButton>
//                                     <IconButton onClick={handleRemoveMembers} sx={{ color: '#BFA181' }}>
//                                         <DeleteIcon />
//                                         <Typography>Delete members</Typography>
//                                     </IconButton>
//                                 </Box>
//                             )}
//                         </FormControl>
//                         <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '16px', backgroundColor: '#BFA181', color: '#0A1828' }}>
//                             {group ? 'Update Group Name' : 'Add Group'}
//                         </Button>
//                     </form>
//                 </Paper>
//             </Box>
//         </>
//     );
// }

// export default AddGroup;


import React, { useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, Paper, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setGroupName, setSelectedMembers, clearGroupForm } from '../redux/groupSlice'; // Adjust path as needed

const AddGroup = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const group = location.state ? location.state.group : null;
    const dispatch = useDispatch();

    const name = useSelector(state => state.groups.name);
    const users = useSelector(state => state.groups.users);
    const selectedMembers = useSelector(state => state.groups.selectedMembers);

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
            }
        };
        fetchUsers();
    }, [dispatch]);

    useEffect(() => {
        if (group && users.length > 0) {
            dispatch(setGroupName(group.name));
            const selectedIds = group.members
                .map(member => {
                    const user = users.find(user => user.username === member);
                    return user ? user.id : null;
                })
                .filter(id => id !== null);
            dispatch(setSelectedMembers(selectedIds));
        } else if (!group) {
            dispatch(clearGroupForm());
        }
    }, [group, users, dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt_token');

        try {
            if (group) {
                await axios.patch(`http://localhost:7777/api/groups/${group.id}/edit/`, { name }, { headers: { Authorization: `Bearer ${token}` } });
                alert('Group updated successfully!');
            } else {
                const createGroupResponse = await axios.post('http://localhost:7777/api/groups/', { name }, { headers: { Authorization: `Bearer ${token}` } });
                const groupId = createGroupResponse.data.id;
                const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
                await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, { usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } });
                alert('Group created successfully!');
            }

            dispatch(clearGroupForm());
            navigate('/');
        } catch (error) {
            console.error(`Error ${group ? 'updating' : 'creating'} group:`, error);
            alert(`Error ${group ? 'updating' : 'creating'} group`);
        }
    };

    const handleAddMembers = async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, { action: 'add', usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Members added successfully!');
            navigate('/');
        } catch (error) {
            console.error('Error adding members:', error);
            alert('Error adding members');
        }
    };

    const handleRemoveMembers = async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
            await axios.patch(`http://localhost:7777/api/groups/${group.id}/update/`, { action: 'remove', usernames: memberUsernames }, { headers: { Authorization: `Bearer ${token}` } });
            alert('Members removed successfully!');
            navigate('/');
            dispatch(setSelectedMembers([]));
        } catch (error) {
            console.error('Error removing members:', error);
            alert('Error removing members');
        }
    };

    const handleMembersChange = (event) => {
        dispatch(setSelectedMembers(event.target.value));
    };

    const handleNameChange = (event) => {
        dispatch(setGroupName(event.target.value));
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
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center"
                sx={{ backgroundColor: '#0A1828', width: '100%', height: '90vh' }}>
                <Paper elevation={3} sx={{ padding: '2rem', backgroundColor: '#0A1828', border: '2px solid #BFA181', borderRadius: '12px', width: '350px' }}>
                    <Typography variant="h4" component="h6" gutterBottom sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}>
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
                            <Select multiple value={selectedMembers} onChange={handleMembersChange}
                                renderValue={(selected) => selected.map((memberId) => users.find((user) => user.id === memberId)?.username || memberId).join(', ')}
                                sx={{ color: '#178582', border: '1px solid #BFA181', borderRadius: '8px', marginTop: '20px', '& .MuiSvgIcon-root': { color: '#BFA181' } }}>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>{user.username}</MenuItem>
                                ))}
                            </Select>
                            {group && (
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
        </>
    );
};

export default AddGroup;