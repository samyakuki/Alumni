

const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isStrongPassword().withMessage('Password must be strong')
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password,graduationYear} = req.body;
    console.log(req.body);

    User.register(new User({ username, email }), password, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        passport.authenticate('local')(req, res, () => {
            res.json({ message: 'Registration successful' });
        });
    });
});

module.exports = router;