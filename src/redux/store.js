import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import expenseReducer from './expenseSlice';
import groupReducer from './groupSlice';
import homeReducer from './homeSlice';

const store = configureStore({  //redux store
  reducer: { 
    auth: authReducer, 
    expenses: expenseReducer,
    groups: groupReducer,
    home: homeReducer,
  
  }, //has key- auth handled by authreducer
});
//This means that any actions related to authentication will be managed by the authReducer and the state will be stored under the auth key.

export default store;
