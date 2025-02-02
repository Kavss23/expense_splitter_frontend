import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Box, Typography } from '@mui/material';

const OverallBalanceSummary = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        axios.get('http://localhost:7777/api/summary/', { headers: 
            { Authorization: `Bearer ${token}` 
        } } )
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <Container maxWidth="md" sx={{ backgroundColor: '#0A1828', padding: '16px' }}>
            <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
                    Welcome aboard! Splitting expenses has never been easier.
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom sx={{ color: '#178582', textAlign: 'center', fontWeight: 'bold' }}>
                    Let's Get Started!
                </Typography>
                {data && ( //total woed to and owed by using backend api key
                    <Box mt={3} sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Amount Owed By You: ₹{data.total_owed_by_user} 
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            Amount Owed to You: ₹{data.total_owed_to_user}
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}

export default OverallBalanceSummary;
