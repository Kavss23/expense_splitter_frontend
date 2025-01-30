import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import store from "../redux/Store";
import Signup from "./Signup";

describe('SignUp Component', () => {
    it('renders username, email, and password input fields, signup button, and login link', () => {
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Signup />
                </BrowserRouter>
            </Provider>
        );

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const signupbutton = screen.getByRole('button', {name : /sign up/i});
        const loginButton = screen.getByRole('button', {name: /login/i});

        expect(usernameInput).toBeInTheDocument();
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(signupbutton).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    })
})