// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router'; // Note the change here to `react-router-dom`
// import { Button, Typography, Container, Box } from '@mui/material';
// import axios from 'axios';

// const Home = () => {
//   const navigate = useNavigate();
//   const [expenses, setExpenses] = useState([]);

//   const fetchExpenses = useCallback(async () => {
//     try {
//       const token = localStorage.getItem('jwt_token');
//       if (!token) {
//         navigate('/logout');
//         return;
//       } //callback for error

//       const response = await axios.get('http://localhost:8040/api/list-expenses/', {
//         headers: {
//           Authorization: `Bearer ${token}`
//         } //list expenses of logged in user
//       });

//       setExpenses(response.data);
//     } catch (error) {
//       console.error('Failed to fetch expenses:', error);
//       if (error.response && error.response.status === 401) {
//         navigate('/logout');
//       }
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchExpenses();
//   }, [fetchExpenses]);

//   return (
//     <Container maxWidth="sm">
//       <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Expense Tracker Dashboard
//         </Typography>
//         <Typography variant="body1" gutterBottom>
//           Welcome aboard! This application is meant to track expenses in real time. Hope you have a good experience with it.
//         </Typography>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={() => navigate('/logout')}
//           style={{ marginTop: '16px' }}
//         >
//           Logout
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default Home;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button, Typography, Container, Box } from '@mui/material';
import GroupList from './GroupList';
import ExpenseForm from './ExpenseForm';
import GroupSummary from './GroupSummary';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const fetchExpenses = useCallback(async () => {
    if (!selectedGroupId) return;

    try {
      const token = localStorage.getItem('jwt_token');
      if (!token) {
        navigate('/logout');
        return;
      }

      const response = await axios.get(`http://localhost:7777/api/groups/${selectedGroupId}/expenses/`, {
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
  }, [navigate, selectedGroupId]);

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Expense Tracker Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome aboard! This application is meant to track expenses in real time. Hope you have a good experience with it.
        </Typography>
        <GroupList fetchGroups={() => {}} />
        {selectedGroupId && (
          <>
            <ExpenseForm groupId={selectedGroupId} fetchExpenses={fetchExpenses} />
            <GroupSummary groupId={selectedGroupId} />
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/logout')}
          style={{ marginTop: '16px' }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
