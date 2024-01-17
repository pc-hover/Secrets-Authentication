# Web Application Authentication Demo

This is a simple web application that demonstrates various levels of authentication for a login/register page. The application allows users to access secrets after successfully authenticating through different authentication methods.

## Authentication Levels

1. **User data in database (Local mongoose DB):** The application stores user data in a local MongoDB database using Mongoose.

2. **Mongoose encryption:** Mongoose encryption is applied to secure sensitive data within the database.

3. **Hashing using MD5 hash:** User passwords are hashed using MD5 hashing for an additional layer of security.

4. **Hashing using bcrypt (Salting rounds):** Bcrypt is utilized for password hashing with salting to enhance password security.

5. **Passport.js for Creating Sessions:** Passport.js is implemented for session management, providing a seamless and secure login experience.

6. **OAuth2.0 Google Authentication:** Users can also log in using their Google accounts through OAuth2.0, adding an extra layer of authentication through a widely used and trusted provider.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/pc-hover/Secrets-Authentication.git
    cd Secrets-Authentication
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the MongoDB connection by providing the appropriate URI in the `app.js` file.

4. Obtain Google OAuth2.0 credentials and create .env file with your client ID and client secret.

## Usage

1. Start the application:

    ```bash
    npm start
    ```

2. Open your web browser and navigate to [http://localhost:3000](http://localhost:3000).

3. Explore the different authentication levels on the login/register page.

## Contributing

Feel free to contribute by submitting issues or pull requests. Your feedback and suggestions are highly appreciated.

## License

This project is licensed under the [MIT License](LICENSE).
