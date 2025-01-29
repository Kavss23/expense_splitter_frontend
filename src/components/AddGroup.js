// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
// import { useNavigate } from 'react-router';

// const AddGroup = () => {
//   const [name, setName] = useState('');
//   const [users, setUsers] = useState([]);
//   const [selectedMembers, setSelectedMembers] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem('jwt_token');
//         const response = await axios.get('http://localhost:7777/api/users/', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setUsers(response.data);
//       } catch (error) {
//         console.error('Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('jwt_token');

//     try {
//       // Step 1: Create the group
//       const createGroupResponse = await axios.post('http://localhost:7777/api/groups/', { name }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       const groupId = createGroupResponse.data.id;

//       // Step 2: Add members to the group
//       const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
//       await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, { usernames: memberUsernames }, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       alert('Group created successfully!');
//       setName('');
//       setSelectedMembers([]);
//       navigate('/'); // Redirect to home page after group is created
//     } catch (error) {
//       console.error('Error creating group:', error);
//       alert('Error creating group');
//     }
//   };

//   const handleMembersChange = (event) => {
//     setSelectedMembers(event.target.value);
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
//           }}
//         >
//           <Typography
//             variant="h4"
//             component="h6"
//             gutterBottom
//             sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}
//           >
//             Add Group
//           </Typography>
//           <form onSubmit={handleSubmit} style={{ width: '100%' }}>
//             <Typography variant="body1" shrink={true} sx={{ color: '#BFA181', marginTop: '10px' }}>
//               Group Name
//             </Typography>
//             <TextField
//               variant="outlined"
//               fullWidth
//               margin="normal"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               InputProps={{
//                 style: {
//                   fontSize: '0.875rem',
//                   border: '1px solid #BFA181', // Gold border for fields
//                   borderRadius: '8px',
//                   color: '#178582', // Text color
//                 }
//               }}
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel id="members-label" shrink={true} sx={{ color: '#BFA181', marginTop: '5px', marginLeft: '-15px' }}>Members</InputLabel>
//               <Select
//                 labelId="members-label"
//                 multiple
//                 value={selectedMembers}
//                 onChange={handleMembersChange}
//                 renderValue={(selected) => selected.map((memberId) => {
//                   const user = users.find((user) => user.id === memberId);
//                   return user ? user.username : memberId;
//                 }).join(', ')}
//                 sx={{
//                   color: '#178582', // Text color
//                   border: '1px solid #BFA181', // Gold border for dropdown
//                   borderRadius: '8px',
//                   marginTop: '20px',
//                   '& .MuiSvgIcon-root': {
//                     color: '#BFA181', // Gold color for dropdown arrow
//                   },
//                 }}
//                 MenuProps={{
//                   PaperProps: {
//                     style: {
//                       borderColor: '#BFA181',
//                       color: '#178582' // Gold border for dropdown menu
//                     }
//                   }
//                 }}
//               >
//                 {users.map((user) => (
//                   <MenuItem key={user.id} value={user.id}>
//                     {user.username}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '16px', backgroundColor: '#BFA181', color: '#0A1828' }}>
//               Add Group
//             </Button>
//           </form>
//         </Paper>
//       </Box>
//     </>
//   );
// }

// export default AddGroup;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Button, Typography, TextField, Box, MenuItem, Select, FormControl, InputLabel, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router';

const AddGroup = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const group = location.state ? location.state.group : null;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get('http://localhost:7777/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (group) {
      setName(group.name);
      setSelectedMembers(group.members.map(member => users.find(user => user.username === member).id));
    }
  }, [group, users]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');

    try {
      if (group) {
        // Update the group
        await axios.put(`http://localhost:7777/api/groups/${group.id}/update/`, { name, members: selectedMembers }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Group updated successfully!');
      } else {
        // Create the group
        const createGroupResponse = await axios.post('http://localhost:7777/api/groups/', { name }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const groupId = createGroupResponse.data.id;

        // Add members to the group
        const memberUsernames = selectedMembers.map(memberId => users.find(user => user.id === memberId).username);
        await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, { usernames: memberUsernames }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert('Group created successfully!');
      }

      setName('');
      setSelectedMembers([]);
      navigate('/'); // Redirect to home page after group is created or updated
    } catch (error) {
      console.error(`Error ${group ? 'updating' : 'creating'} group:`, error);
      alert(`Error ${group ? 'updating' : 'creating'} group`);
    }
  };

  const handleMembersChange = (event) => {
    setSelectedMembers(event.target.value);
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
          }}
        >
          <Typography
            variant="h4"
            component="h6"
            gutterBottom
            sx={{ color: '#BFA181', textAlign: 'center', fontWeight: 'bold' }}
          >
            {group ? 'Edit Group' : 'Add Group'}
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Typography variant="body1" shrink={true} sx={{ color: '#BFA181', marginTop: '10px' }}>
              Group Name
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputProps={{
                style: {
                  fontSize: '0.875rem',
                  border: '1px solid #BFA181', // Gold border for fields
                  borderRadius: '8px',
                  color: '#178582', // Text color
                }
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="members-label" shrink={true} sx={{ color: '#BFA181', marginTop: '5px', marginLeft: '-15px' }}>Members</InputLabel>
              <Select
                labelId="members-label"
                multiple
                value={selectedMembers}
                onChange={handleMembersChange}
                renderValue={(selected) => selected.map((memberId) => {
                  const user = users.find((user) => user.id === memberId);
                  return user ? user.username : memberId;
                }).join(', ')}
                sx={{
                  color: '#178582', // Text color
                  border: '1px solid #BFA181', // Gold border for dropdown
                  borderRadius: '8px',
                  marginTop: '20px',
                  '& .MuiSvgIcon-root': {
                    color: '#BFA181', // Gold color for dropdown arrow
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      borderColor: '#BFA181',
                      color: '#178582' // Gold border for dropdown menu
                    }
                  }
                }}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" fullWidth sx={{ marginTop: '16px', backgroundColor: '#BFA181', color: '#0A1828' }}>
              {group ? 'Update Group' : 'Add Group'}
            </Button>
          </form>
        </Paper>
      </Box>
    </>
  );
}

export default AddGroup;
