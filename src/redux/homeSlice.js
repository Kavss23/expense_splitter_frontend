import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    groups: [],
    selectedGroup: null,
    expenses: [],
    balances: [],
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload;
        },
        setSelectedGroup: (state, action) => {
            state.selectedGroup = action.payload;
        },
        clearSelectedGroup: (state) => {
            state.selectedGroup = null;
        },
        setExpenses: (state, action) => {
            state.expenses = action.payload;
        },
        setBalances: (state, action) => {
            state.balances = action.payload;
        },
    },
});

export const { setGroups, setSelectedGroup, clearSelectedGroup, setExpenses, setBalances } = homeSlice.actions;
export default homeSlice.reducer;