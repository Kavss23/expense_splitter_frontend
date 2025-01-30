import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router';
import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../redux/homeSlice';
import Home from './Home';

const mockStore = configureStore({
  reducer: {
    home: homeReducer,
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

describe('home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Home component', () => {
    renderWithProviders(<Home />);
    expect(screen.getByText(/Expense Splitter Dashboard/i)).toBeInTheDocument();
  });
});
