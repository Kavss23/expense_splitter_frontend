// components/Groups.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { Button, List, ListItem, ListItemText, Typography, Box } from '@mui/material';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const response = await axios.get('http://localhost:7777/api/groups/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setGroups(response.data);
    };
    fetchGroups();
  }, []);

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      alert('Joined group successfully');
      navigate(`/groups/${groupId}`);
    } catch (error) {
      console.error('Join group error:', error);
      alert('Error joining group');
    }
  };

  const handleCreateGroup = async () => {
    const groupName = prompt('Enter group name:');
    if (!groupName) return;
    try {
      const response = await axios.post('http://localhost:7777/api/groups/', {
        name: groupName
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      setGroups([...groups, response.data]);
    } catch (error) {
      console.error('Create group error:', error);
      alert('Error creating group');
    }
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
        Groups
      </Typography>
      <Button 
        onClick={handleCreateGroup} 
        sx={{ 
          marginBottom: '16px', 
          backgroundColor: '#BFA181', 
          color: '#0A1828' 
        }}
      >
        Create Group
      </Button>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {groups.map((group) => (
          <ListItem key={group.id} button onClick={() => handleJoinGroup(group.id)}>
            <ListItemText primary={group.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default GroupList;
