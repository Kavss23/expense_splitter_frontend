import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({  //redux store
  reducer: { 
    auth: authReducer, //object that defines the structure of the state and which reducers will handle different parts of the state.
  }, //has key- auth handled by authreducer
});
//This means that any actions related to authentication will be managed by the authReducer and the state will be stored under the auth key.

export default store;
