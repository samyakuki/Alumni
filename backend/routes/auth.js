const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isStrongPassword().withMessage('Password must be strong'),
    body('name').notEmpty().withMessage('Name is required'),
    body('graduationYear').isNumeric().withMessage('Graduation year must be a number')
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, name, graduationYear, linkedinId, profilePic } = req.body;
    console.log(req.body);  
    const newUser = new User({
        username,
        email,
        name,
        graduationYear,
        linkedinId,       
        profilePic           });

    User.register(newUser, password, (err, user) => {
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
