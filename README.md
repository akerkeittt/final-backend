# Singapore Web Application

## Description
This project is a web application that provides various functionalities such as QR code generation, BMI calculation, a weather forecast feature, and a CRUD blog system. The application is built using Node.js, Express, MongoDB, and various APIs.

## Features
- **User Authentication**: Users can register and log in to access different features.
- **Nodemailer Integration**: Upon successful registration, users receive a welcome email using Nodemailer.
- **QR Code Generator**: Users can generate QR codes for any URL.
- **BMI Calculator**: Calculates BMI based on user input.
- **Weather Forecast**: Fetches weather data based on user-entered cities.
- **Blog CRUD System**: Users can create, read, update, and delete blog posts.

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)

### Steps to Install
1. Clone this repository:
   ```sh
   git clone https://github.com/akerkeittt/final-backend.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/user_auth
   WEATHER_API_KEY=your_weather_api_key
   TIMEZONE_API_KEY=your_timezone_api_key
   PIXABAY_API_KEY=your_pixabay_api_key
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```
4. Start the server:
   ```sh
   node server.js
   ```
5. Open your browser and go to:
   ```sh
   http://localhost:5000
   ```

## Usage

### User Registration & Login
- Register a new user at `/register`.
- After successful registration, an email will be sent to the user using Nodemailer.
- Login at `/login`.

### QR Code Generator
- Visit `/qr` to generate QR codes for any URL.

### BMI Calculator
- Go to `/bmi` and enter weight and height to calculate BMI.

### Weather Forecast
- Navigate to `/weather` and enter a city name to fetch weather details.

### Blog System (CRUD)
- Create, read, update, and delete blog posts at `/blogs`.

## API Endpoints

### Authentication
- `POST /register` - Registers a new user and sends a welcome email.
- `POST /login` - Authenticates a user.
- `POST /logout` - Logs out the user.

### QR Code
- `POST /generate` - Generates a QR code for a given URL.

### BMI Calculator
- `POST /calculate-bmi` - Calculates BMI based on user input.

### Weather API
- `GET /weather?city={cityName}` - Fetches weather details for a specified city.

### Blog API
- `POST /blogs` - Creates a new blog post.
- `GET /blogs` - Retrieves all blog posts.
- `GET /blogs/{id}` - Fetches a single blog post by ID.
- `PUT /blogs/{id}` - Updates a blog post.
- `DELETE /blogs/{id}` - Deletes a blog post.

## Technologies Used
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML, CSS, JavaScript
- **APIs**: OpenWeatherMap API, TimeZoneDB API, Pixabay API
- **Libraries**: Nodemailer, QR-Image, Bcrypt, Body-parser, Axios

## License
This project is licensed under the MIT License.


