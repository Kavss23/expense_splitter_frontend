import { createSlice } from '@reduxjs/toolkit';
//Redux slice that contains the state, reducers, and actions for a specific feature.
const authSlice = createSlice({ //slice defined with initial states
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    user: null,
    error: null,
  },
  //reducer functions that will handle actions and update the state accordingly
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      state.error = null;
    },
    signupSuccess: (state, action) => { 
      state.isLoggedIn = true; 
      state.user = action.payload; 
      state.error = null; 
    }, 
    signupFailure: (state, action) => { 
      state.isLoggedIn = false; 
      state.user = null; 
      state.error = action.payload; 
    },
    loginFailure: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, signupFailure, signupSuccess,loginFailure, logout } = authSlice.actions;
//These action creators correspond to the reducers defined above and can be dispatched to update the state.

export default authSlice.reducer;
//This reducer will handle the auth state in the Redux store.
