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
            state.users = action.payload;
        },
        setGroupName: (state, action) => {
            state.name = action.payload;
        },
        setSelectedMembers: (state, action) => {
            state.selectedMembers = action.payload;
        },
        clearGroupForm: (state) => {
          state.name = '';
          state.selectedMembers = [];
        },
    },
});

export const { setUsers, setGroupName, setSelectedMembers, clearGroupForm } = groupSlice.actions;
export default groupSlice.reducer;