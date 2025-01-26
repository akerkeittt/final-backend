# Registration and Login System with Node.js and PostgreSQL

## Project Description
This project implements a simple registration and login system using Node.js for the server-side and PostgreSQL as the database. The application allows users to register, log in, and securely manage their credentials.

## Features
- User registration with email, username, and password.
- Password hashing for secure storage (using `bcrypt`).
- Login functionality with user validation.
- Database interaction using PostgreSQL.
- Clean and responsive design for forms.

## Technologies Used
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Packages**: 
  - `express` for server setup.
  - `bcrypt` for password hashing.
  - `pg` for database connection.
  - `dotenv` for environment variables.
- **Frontend**: HTML, CSS

## Setup and Installation

### Prerequisites
- Node.js installed on your machine.
- PostgreSQL installed and configured.
- Basic knowledge of command-line tools.

### Steps to Run
1. Clone the repository:
    ```bash
    git clone https://github.com/your-repo-name.git
    ```
2. Navigate to the project directory:
    ```bash
    cd your-project-folder
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the root directory.
    - Add the following variables:
        ```env
        DATABASE_URL=postgres://username:password@localhost:5432/your_database_name
        PORT=3000
        ```
5. Create the database:
    - Open your PostgreSQL client or terminal.
    - Run the following commands:
        ```sql
        CREATE DATABASE your_database_name;
        \c your_database_name;
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );
        ```
6. Start the server:
    ```bash
    npm start
    ```
7. Open your browser and go to:
    ```
    http://localhost:3000
    ```

## Project Structure

## Usage
- **Registration**: Navigate to `/register.html` to create an account.
- **Login**: Navigate to `/login.html` to log in using your credentials.
- **Home**: After login, you will be redirected to the home page.

## Troubleshooting
If you encounter errors, ensure:
1. PostgreSQL is running, and your database credentials in `.env` are correct.
2. All required npm packages are installed (`npm install`).
3. The database structure matches the schema provided above.

## Future Improvements
- Add password reset functionality.
- Implement session management for user authentication.
- Add input validation on both client and server sides.

## License
This project is licensed under the MIT License.

