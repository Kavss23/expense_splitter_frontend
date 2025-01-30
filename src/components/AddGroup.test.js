// AddGroup.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import groupReducer from '../redux/groupSlice';
import AddGroup from './AddGroup';

const mockStore = configureStore({
  reducer: {
    groups: groupReducer,
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

describe('AddGroup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders AddGroup component', () => {
    renderWithProviders(<AddGroup />);
    expect(screen.getByText(/Expense Splitter Dashboard/i)).toBeInTheDocument();
  });
});

