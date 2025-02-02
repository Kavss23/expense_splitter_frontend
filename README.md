# Expense Splitter Application Documentation
## Overview
The Expense Splitter application is designed to help users manage shared expenses within groups. Users can create groups, add members to the groups, and manage expenses within those groups. The application includes features for user authentication, group management, and expense tracking.

## FRONTEND
The frontend is built on React JS. Using React JS for the Expense Splitter application provides a robust and efficient framework for building a scalable, maintainable, and high-performance user interface. These advantages make React a suitable choice for developing modern web applications like the Expense Splitter.
The API Keys are built in Django and integrated with react easily using axios. Along with that JWT Token Authentication is done to allow only authenticated users to login and store the token till the time the user logs out.

## Dependencies
- @emotion/react@11.14.0
- @emotion/styled@11.14.0
- @mui/icons-material@6.4.1
- @mui/material@6.4.1
- @reduxjs/toolkit@2.5.0
- @testing-library/jest-dom@6.6.3
- @testing-library/react@16.2.0
- axios@1.7.9
- cra-template@1.2.0
- jest@27.5.1
- react-dom@19.0.0
- react-redux@9.2.0
- react-router@7.1.3
- react-scripts@5.0.1
- react@19.0.0
- util@0.12.5
- web-vitals@4.2.4

## Components

### App
- Path: ./App.js
- Description: The main component that handles the routing of the application. It includes routes for login, signup, home, add group, add expense, and logout.
- Routes:
  
  - /login - Login page
  - /signup - Signup page
  - /home - Home page (Dashboard)
  - /add-group - Add Group page
  - /groups/:groupId/add-expense - Add Expense page
  - /logout - Logout page

### Login
- Path: ./components/Login.js
- Description: Handles user login functionality. Users can enter their username and password to log in. Upon successful login, a JWT token is stored in local storage.
- Props:
  onLoginSuccess - Callback function called upon successful login.
- State:
   - username - Stores the entered username.
   - password - Stores the entered password.
 - open - Controls the visibility of the snackbar.
   - snackbarMessage - Message displayed in the snackbar.
   - severity - Severity type of the snackbar message.
- Functions:
   - handleSubmit - Handles form submission for login.
   - handleSignupRedirect - Redirects to the signup page.
   - handleSnackbarClose - Closes the snackbar.

### AddGroup
- Path: ./components/AddGroup.js
- Description: Allows users to create or edit a group. Users can add members to the group and update the group name.
- State:
   - open - Controls the visibility of the snackbar.
   - snackbarMessage - Message displayed in the snackbar.
   - severity - Severity type of the snackbar message.
- Selectors:
   - name - Group name from Redux store.
   - users - List of users from Redux store.
   - selectedMembers - List of selected members from Redux store.
- Functions:
   - handleSubmit - Handles form submission for adding or updating a group.
   - handleAddMembers - Handles adding members to the group.
   - handleRemoveMembers - Handles removing members from the group.
   - handleMembersChange - Updates selected members in the Redux store.
   - handleNameChange - Updates group name in the Redux store.
   - handleSnackbarClose - Closes the snackbar.

### AddExpense
- Path: ./components/AddExpense.js
- Description: Allows users to add or edit an expense within a group. Users can enter a description, amount, and select the members involved in the expense.
- State:
   - description - Stores the entered description.
   - amount - Stores the entered amount.
   - open - Controls the visibility of the snackbar.
   - snackbarMessage - Message displayed in the snackbar.
   - severity - Severity type of the snackbar message.
- Functions:
   - handleSubmit - Handles form submission for adding or updating an expense.
   - handleDescriptionChange - Updates the description state.
   - handleAmountChange - Updates the amount state.
   - handleSnackbarClose - Closes the snackbar.

### Home
- Path: ./components/Home.js
- Description: The dashboard page that provides an overview of the user's groups and expenses. Users can navigate to add a group or add an expense from this page.
  
### Signup
- Path: ./components/Signup.js
- Description: Handles user registration functionality. Users can enter their details to create an account.

### Logout
- Path: ./components/Logout.js
- Description: Handles user logout functionality. Clears the JWT token from local storage and logs the user out.

### Redux Setup

#### Store:
- Path: ./redux/Store.js
- Description: Configures the Redux store and combines all reducers.

#### Slices:
##### Auth Slice:
- Path: ./redux/authSlice.js
- Description: Manages authentication state including login success and login failure actions.

##### Group Slice:
- Path: ./redux/groupSlice.js
- Description: Manages group state including setting users, group name, selected members, and clearing the group form.

### Styles
MUI (Material-UI): The application uses Material-UI components for consistent styling and responsive design. The styles are customized using the sx prop and useMediaQuery hook for responsiveness.

### Usage
- Login: Users can log in using their username and password. Successful login stores a JWT token in local storage.
- Signup: Users can sign up by providing their details.
- Add Group: Users can create new groups by entering a group name and selecting members.
- Add Expense: Users can add expenses to a group by providing a description, amount, and selecting members involved in the expense.
- Dashboard: Users can view an overview of their groups and expenses on the home page.

### CRUD Operations

#### Create
- Description: Allows users to create new groups and expenses.
- Implementation:
   - AddGroup Component: Users can create a new group by entering a group name and selecting members. This information is submitted and stored in the database.
   - AddExpense Component: Users can create a new expense by entering a description, amount, and selecting members involved. The expense is then stored in the database.

#### Read
- Description: Allows users to view existing groups and expenses.
- Implementation:
   - Home Component: Users can view a list of their groups and expenses on the dashboard page.
   - Group Details: Users can click on a group to view details, including members and expenses associated with that group.

#### Update
- Description: Allows users to edit existing groups and expenses.
- Implementation:
   - Edit Group: Users can update the group name and members in the AddGroup component by reusing the same form with pre-filled data.
   - Edit Expense: Users can update the description, amount, and members involved in an expense in the AddExpense component by reusing the same form with pre-filled data.

#### Delete
- Description: Allows users to delete existing groups and expenses.
- Implementation:
   - Group Details: Users can delete a group from the group details page.
   - Expense Details: Users can delete an expense from the expense details page.

### Split Types

#### Equal Split
- Description: Automatically divides the expense amount equally among all members involved. This feature simplifies the process of splitting expenses evenly.
- Implementation:
   - Form Option: Users can select the equal split option in the expense form.
   - Calculation: The application divides the total amount by the number of members and assigns equal amounts to each member.

#### Custom Split
- Description: Allows users to specify custom amounts for each member involved in an expense. This feature is useful when the expense is not evenly shared among the members.
- Implementation:
   - Form Option: Users can enter custom amounts for each member in the expense form.
   - Validation: The application ensures that the sum of custom amounts matches the entered total amount.

### Responsive Design
The application is designed to be responsive and user-friendly on screens as small as 350px and beyond. The useMediaQuery hook from Material-UI is used to adjust styles based on screen size.