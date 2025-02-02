import {render, screen} from '@testing-library/react';
import App from './App';
import { Provider } from "react-redux";
import store from "./redux/store";

describe('App Component ', () => {
  it('renders Login page when navigating to /login', () => {
    render(
      <Provider store={store}>
          <App />
      </Provider>
    );
   expect(screen.getByText(/Welcome to SplitSure/i)).toBeInTheDocument();
  });
});


