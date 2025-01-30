import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from '../redux/expenseSlice';
import AddExpense from './AddExpense';

const mockStore = configureStore({
  reducer: {
    expenses: expenseReducer,
  },
});

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <Router>
        {component}
      </Router>
    </Provider>
  );
};

describe('AddExpense Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddExpense component', () => {
    renderWithProviders(<AddExpense />);
    expect(screen.getByText(/Expense Splitter Dashboard/i)).toBeInTheDocument();
  });
});

