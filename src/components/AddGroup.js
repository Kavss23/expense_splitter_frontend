import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router';

const AddGroup = () => {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt_token');
    axios.post('http://localhost:7777/api/groups/', { name, members: selectedMembers }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        alert('Group created successfully!');
        setName('');
        setSelectedMembers([]);
        navigate('/'); // Redirect to home page after group is created
      })
      .catch(error => console.error('Error creating group:', error));
  };

  const handleMembersChange = (event) => {
    setSelectedMembers(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Group
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Group Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="members-label">Members</InputLabel>
            <Select
              labelId="members-label"
              multiple
              value={selectedMembers}
              onChange={handleMembersChange}
              renderValue={(selected) => selected.map((memberId) => {
                const user = users.find(user => user.id === memberId);
                return user ? user.username : memberId;
              }).join(', ')}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
            Add Group
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default AddGroup;
