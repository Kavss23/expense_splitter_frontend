import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import Logout from "./Logout";
import { Provider } from "react-redux";
import store from "../redux/store";

describe('Logout Component', () => {
    it('renders logout', () => {
        const mockOnLogout = jest.fn();
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <Logout onLogout={mockOnLogout}/>
                </BrowserRouter>
            </Provider>
        );
        
    });
});