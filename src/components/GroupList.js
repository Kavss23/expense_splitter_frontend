import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';

const GroupList = ({ fetchGroups }) => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const response = await axios.get('http://localhost:8040/api/groups/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setGroups(response.data);
      } catch (error) {
        setError('Failed to fetch groups');
      }
    };

    fetchGroups();
  }, []);

  const handleJoinGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('jwt_token');
      await axios.post(`http://localhost:7777/api/groups/${groupId}/join/`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchGroups();
    } catch (error) {
      setError('Failed to join group');
    }
  };

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h5" component="h2" gutterBottom>
          Groups
        </Typography>
        {groups.map((group) => (
          <Box key={group.id} display="flex" flexDirection="row" alignItems="center" mt={1}>
            <Typography variant="body1">{group.name}</Typography>
            <Button variant="contained" color="primary" onClick={() => handleJoinGroup(group.id)}>
              Join
            </Button>
          </Box>
        ))}
        {error && (
          <Typography color="error" style={{ marginTop: '16px' }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default GroupList;
