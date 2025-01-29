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

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {
        setExpenses: (state, action) => {
            state.expenses = action.payload;
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
        setExpenseDescription: (state, action) => {
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