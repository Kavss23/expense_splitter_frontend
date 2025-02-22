import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import AddExpense from './components/AddExpense';



import Logout from './components/Logout';
import AddGroup from './components/AddGroup';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check if the user is already logged in based on the token in localStorage
    return !!localStorage.getItem('jwt_token');
  });

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleSignupSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <Signup onSignupSuccess={handleSignupSuccess} />} />
        <Route path="/home" element={isLoggedIn ? <Home /> : <Navigate to="/login" />} />
        <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
        <Route path="/add-group" element={<AddGroup />} />
        
       
        <Route path="/groups/:groupId/add-expense" element={<AddExpense />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;