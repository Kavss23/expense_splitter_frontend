import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    name: '',
    users: [],
    selectedMembers: [],
};

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload; //This reducer updates the users array in the state with the payload from the action. This would typically be used after fetching user data from an API.
        },
        setGroupName: (state, action) => {
            state.name = action.payload;
        },
        setSelectedMembers: (state, action) => {
            state.selectedMembers = action.payload;
        },
        clearGroupForm: (state) => {
          state.name = '';
          state.selectedMembers = []; //clear form in reload or after submit
        },
    },
});

export const { setUsers, setGroupName, setSelectedMembers, clearGroupForm } = groupSlice.actions;
export default groupSlice.reducer;