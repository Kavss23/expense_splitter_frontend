import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Login from "./Login";
import { Provider } from "react-redux";
import store from "../redux/Store";


describe('Login Component', () => {
    test('renders username and password input fields, login button, and signup link', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </Provider>
        );

       const usernameInput = screen.getByLabelText(/username/i);  //select fields
       const passwordInput = screen.getByLabelText(/password/i);
       const loginButton = screen.getByRole('button', {name: /login/i});
       const signup = screen.getByRole('button', {name: /Sign Up/i});
       
       expect(usernameInput).toBeInTheDocument();  //expected results
       expect(passwordInput).toBeInTheDocument();
       expect(loginButton).toBeInTheDocument();
       expect(signup).toBeInTheDocument();
    });
});