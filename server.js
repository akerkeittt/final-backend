const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const nodemailer = require("nodemailer");
const qr = require('qr-image');
const axios = require("axios");
const blogRoutes = require('./routes/blogRoutes');

const fs = require("fs");

const app = express();
const PORT = 5000;

const authDB = mongoose.createConnection('mongodb://127.0.0.1:27017/user_auth');

authDB.on('connected', () => console.log("AuthDB connected"));
authDB.on('error', err => console.error("AuthDB connection error:", err));


const User = authDB.model('User', new mongoose.Schema({
    username: String,
    email: String,
    password: String
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    service: "outlook365",
    auth: {
        user: "231313@astanait.edu.kz",
        pass: "m8srs2eTcAqVBA",
    },
});

const sendWelcomeEmail = async (email, username) => {
    const mailOptions = {
        from: "231313@astanait.edu.kz",
        to: email,
        subject: "Welcome to Our Service!",
        html: `<h1>Welcome, ${username}!</h1><p>You successfully signed up! 🎉</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        await sendWelcomeEmail(email, username);

        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during registration.');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.redirect('/index.html');
            } else {
                res.status(401).send('Invalid credentials.');
            }
        } else {
            res.status(401).send('Invalid credentials.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login.');
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Error during logout.");
        }
        res.redirect('/');
    });
});

app.get('/bmi', (req, res) => {
    res.send(`
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    position: relative;
                }
                form {
                    background-color: white;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    width: 300px;
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                label {
                    font-weight: bold;
                    margin-top: 10px;
                    display: block;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    margin-top: 5px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                button {
                    width: 100%;
                    padding: 10px;
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #45a049;
                }
                .home-button {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 8px 15px;
                    background-color: #ddd;
                    color: #333;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    font-size: 14px;
                }
                .home-button:hover {
                    background-color: #ccc;
                }
            </style>
        </head>
        <body>
            <a href="/index.html" class="home-button">← Home</a>
            <form action="/calculate-bmi" method="POST">
                <h2>BMI Calculator</h2>
                <label>Weight (kg):</label>
                <input type="number" name="weight" step="0.1" required><br><br>
                <label>Height (m):</label>
                <input type="number" name="height" step="0.01" required><br><br>
                <button type="submit">Calculate BMI</button>
            </form>
        </body>
        </html>
    `);
});


app.post('/calculate-bmi', (req, res) => {
    const weight = parseFloat(req.body.weight);
    const height = parseFloat(req.body.height);

    if (weight > 0 && height > 0) {
        const bmi = weight / (height * height);
        let category;
        let resultClass;

        if (bmi < 18.5) {
            category = 'Underweight';
            resultClass = 'underweight';
        } else if (bmi < 24.9) {
            category = 'Normal weight';
            resultClass = 'normal';
        } else if (bmi < 29.9) {
            category = 'Overweight';
            resultClass = 'overweight';
        } else {
            category = 'Obese';
            resultClass = 'obese';
        }


        res.send(`
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .result {
                        padding: 20px;
                        border-radius: 8px;
                        margin-top: 20px;
                        font-size: 18px;
                    }
                    .underweight {
                        background-color: #ffcccb;
                        color: #d8000c;
                    }
                    .normal {
                        background-color: #c8e6c9;
                        color: #388e3c;
                    }
                    .overweight {
                        background-color: #fff9c4;
                        color: #fbc02d;
                    }
                    .obese {
                        background-color: #f8bbd0;
                        color: #d81b60;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        text-decoration: none;
                        color: #007bff;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="result ${resultClass}" style="text-align:center;">
                    <h2>Your BMI is ${bmi.toFixed(2)} (${category})</h2>
                    <a href="/bmi">Calculate Again</a>
                </div>
            </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .error {
                        color: red;
                        text-align: center;
                    }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        text-decoration: none;
                        color: #007bff;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <div class="error">
                    <h2>Invalid input. Please enter positive numbers.</h2>
                    <a href="/bmi">Try Again</a>
                </div>
            </body>
            </html>
        `);
    }
});


app.get('/qr', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'qr.html'));
});

app.post('/generate', (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).send("URL cannot be empty");
    }

    fs.appendFile('userInput.txt', url + '\n', (err) => {
        if (err) throw err;
        console.log("Link saved.");
    });

    const qrCode = qr.imageSync(url, { type: 'png' });
    const base64Image = `data:image/png;base64,${qrCode.toString('base64')}`;

    res.send(`
        <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/qr.css">
        </head>
        <body>
            <div class="container">
                <h1>QR Code Generated!</h1>
                <p>Link: <a href="${url}" target="_blank">${url}</a></p>
                <img src="${base64Image}" alt="QR Code">
                <br>
                <a href="/qr" class="button">Create a new one</a>
            </div>
        </body>
        </html>
    `);
});

const weatherApiKey = "ddb94eb78b072f5759938a8343059a0e";
const timeZoneApiKey = "TMOAAF7PKA9L";
const pixabayApiKey = "48202142-1ee99bc21d9fd985032ff61f7";

const renderHomePage = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather and Air Quality</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Inter', sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: linear-gradient(135deg, #89CFF0, #4682B4);
                color: #ffffff;
            }
            .container {
                text-align: center;
                background: rgba(0, 0, 0, 0.6);
                border-radius: 15px;
                padding: 30px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                width: 90%;
                max-width: 400px;
            }
            h1 {
                font-size: 2em;
                margin-bottom: 20px;
                font-weight: 600;
            }
            form {
                display: flex;
                flex-direction: column;
                gap: 15px;
                width: 100%;
            }
            label {
                font-size: 1em;
                text-align: left;
                font-weight: 400;
            }
            input {
                padding: 10px;
                border: none;
                border-radius: 5px;
                font-size: 1em;
                outline: none;
                background: #f4f4f4;
            }
            input:focus {
                box-shadow: 0 0 5px #1abc9c;
            }
            button {
                padding: 10px;
                border: none;
                border-radius: 5px;
                background: #1abc9c;
                color: #ffffff;
                font-size: 1em;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            button:hover {
                background: #16a085;
            }
            footer {
                margin-top: 20px;
                font-size: 0.8em;
                color: #dcdcdc;
            }
                .home-button {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    padding: 8px 15px;
                    background-color: #ddd;
                    color: #333;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    text-decoration: none;
                    font-size: 14px;
                }
                .home-button:hover {
                    background-color: #ccc;
                }
        </style>
    </head>
    <body>
    <a href="/index.html" class="home-button">← Home</a>s
        <div class="container">
            <h1>Weather & Air Quality</h1>
            <form action="/weather" method="GET">
                <label for="city">Enter your city:</label>
                <input type="text" id="city" name="city" placeholder="e.g., Almaty" required>
                <button type="submit">Check Weather</button>
            </form>
        </div>
    </body>
    </html>
    `;
};


const renderWeatherPage = (weather, rainVolume, airQuality, timeZone, image) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weather Result</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body {
                font-family: 'Poppins', sans-serif;
                text-align: center;
                background: #2c3e50;
                color: #ecf0f1;
                padding: 20px;
            }
            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                background: rgba(0, 0, 0, 0.8);
                border: 1px solid #34495e;
                padding: 20px;
                border-radius: 10px;
                max-width: 900px;
                margin: 20px auto;
            }
            .top-section {
                display: flex;
                width: 100%;
                gap: 20px;
            }
            .left-container {
                flex: 1;
                background: url('${image}') no-repeat center center;
                background-size: cover;
                padding: 20px;
                border-radius: 10px;
                color: #fff;
                text-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
            }
            .left-container h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            .left-container .date {
                font-size: 1.2em;
                margin-bottom: 20px;
            }
            .left-container img {
                width: 80px;
                margin: 20px 0;
            }
            .left-container .temperature {
                font-size: 2em;
                margin-bottom: 10px;
            }
            .right-container {
                flex: 1;
                background: #34495e;
                border-radius: 10px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .info-row {
                display: flex;
                justify-content: space-between;
                font-size: 1.1em;
            }
            .info-row strong {
                font-weight: 600;
            }
            #map {
                height: 400px;
                width: 100%;
                border-radius: 10px;
            }
            a {
                color: #1abc9c;
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <h1>Weather, Air Quality, and Time in ${weather.name}, ${weather.sys.country}</h1>
        <div class="container">
            <div class="top-section">
                <div class="left-container">
                    <h1>${weather.name}, ${weather.sys.country}</h1>
                    <p class="date">${timeZone.formatted}</p>
                    <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="weather icon">
                    <p class="temperature">${weather.main.temp} °C</p>
                    <p>${weather.weather[0].description}</p>
                </div>
                <div class="right-container">
                    <div class="info-row">
                        <strong>Feels Like:</strong>
                        <span>${weather.main.feels_like} °C</span>
                    </div>
                    <div class="info-row">
                        <strong>Humidity:</strong>
                        <span>${weather.main.humidity}%</span>
                    </div>
                    <div class="info-row">
                        <strong>Pressure:</strong>
                        <span>${weather.main.pressure} hPa</span>
                    </div>
                    <div class="info-row">
                        <strong>Wind Speed:</strong>
                        <span>${weather.wind.speed} m/s</span>
                    </div>
                    <div class="info-row">
                        <strong>Rain Volume:</strong>
                        <span>${rainVolume} mm</span>
                    </div>
                    <div class="info-row">
                        <strong>Air Quality Index:</strong>
                        <span>${airQuality.main.aqi}</span>
                    </div>
                    <div class="info-row">
                        <strong>PM2.5:</strong>
                        <span>${airQuality.components.pm2_5} µg/m³</span>
                    </div>
                    <div class="info-row">
                        <strong>PM10:</strong>
                        <span>${airQuality.components.pm10} µg/m³</span>
                    </div>
                    <div class="info-row">
                        <strong>Time Zone:</strong>
                        <span>${timeZone.zoneName}</span>
                    </div>
                </div>
            </div>
            <div id="map"></div>
        </div>
        <a href="/w">Search another city</a>
        <script>
            const map = L.map('map').setView([${weather.coord.lat}, ${weather.coord.lon}], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker([${weather.coord.lat}, ${weather.coord.lon}]).addTo(map)
                .bindPopup('<strong>${weather.name}</strong><br>${weather.weather[0].description}')
                .openPopup();
        </script>
    </body>
    </html>
    `;
};


app.get("/w", (req, res) => {
    res.send(renderHomePage());
});

app.get("/weather", async (req, res) => {
    const city = req.query.city;
    try {
        const weatherResponse = await axios.get(
            `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );
        const weather = weatherResponse.data;

        const rainVolume = weather.rain && weather.rain["3h"] ? weather.rain["3h"] : "No data";

        const airQualityResponse = await axios.get(
            `http://api.openweathermap.org/data/2.5/air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=${weatherApiKey}`
        );
        const airQuality = airQualityResponse.data.list[0];

        const timeZoneResponse = await axios.get(
            `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${weather.coord.lat}&lng=${weather.coord.lon}`
        );
        const timeZone = timeZoneResponse.data;

        const pixabayResponse = await axios.get(
            `https://pixabay.com/api/?key=${pixabayApiKey}&q=${encodeURIComponent(
                weather.weather[0].description
            )}&image_type=photo&category=nature`
        );
        const image = pixabayResponse.data.hits[0]?.largeImageURL || "";

        res.send(renderWeatherPage(weather, rainVolume, airQuality, timeZone, image));
    } catch (error) {
        res.send(`
        <h1>Error</h1>
        <p>Could not fetch data for "${city}". Please try again.</p>
        <a href="/w">Go back</a>
        `);
    }
});

app.use(express.static(path.join(__dirname, 'blog')));


const blogDB = mongoose.createConnection('mongodb://127.0.0.1:27017/blogDB');

blogDB.on('connected', () => console.log("BlogDB connected"));
blogDB.on('error', err => console.error("BlogDB connection error:", err));

const Blog = require('./models/blog')(blogDB);

app.get('/crud', (req, res) => {
    res.sendFile(path.join(__dirname, 'blog', 'index.html'));
});

app.use('/blogs', blogRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

