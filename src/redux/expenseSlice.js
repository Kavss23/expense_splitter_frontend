import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    expenses: [],
    balances: [],
    groupMembers: [],
    description: '', // Add description to state
    amount: '',       // Add amount to state
    splitType: 'equal', // Add splitType to state
    contributions: [], // Add contributions to state
};

const expensesSlice = createSlice({ // receive the current state and an action object.  They then update the state based on the action's payload
    name: 'expenses',
    initialState,
    reducers: { //can mutate the state directly inside the reducer
        setExpenses: (state, action) => {
            state.expenses = action.payload; //return new state object
        },
        setBalances: (state, action) => {
            state.balances = action.payload;
        },
        setGroupMembers: (state, action) => {
            state.groupMembers = action.payload;
        },
        addExpense: (state, action) => {
            state.expenses.push(action.payload);
            // Reset form after adding
            state.description = '';
            state.amount = '';
            state.splitType = 'equal';
            state.contributions = [];

        },
        updateExpense: (state, action) => {
            const index = state.expenses.findIndex(expense => expense.id === action.payload.id);
            if (index !== -1) {
                state.expenses[index] = action.payload;
            }
        },
        setExpenseDescription: (state, action) => { //update the corresponding properties in the state with the payload from the action.
            state.description = action.payload;
        },
        setExpenseAmount: (state, action) => {
            state.amount = action.payload;
        },
        setExpenseSplitType: (state, action) => {
            state.splitType = action.payload;
        },
        setExpenseContributions: (state, action) => {
            state.contributions = action.payload;
        },
    },
});

export const { setExpenses, setBalances, setGroupMembers, addExpense, updateExpense, setExpenseDescription, setExpenseAmount, setExpenseSplitType, setExpenseContributions } = expensesSlice.actions;
export default expensesSlice.reducer;