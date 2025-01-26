const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/dbConfig');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Сохраняем пароль в базу данных без хэширования
        await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, password] // Пароль сохраняется как есть
        );
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during registration.');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length > 0) {
            if (password === user.rows[0].password) { // Сравниваем напрямую
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

module.exports = router;
