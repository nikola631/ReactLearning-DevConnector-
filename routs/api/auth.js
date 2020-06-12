const express = require('express');
const router = express.Router();
const auth = require('../../midleware/authetication');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcript = require('bcryptjs');


// @route  GET api/auth
// @desc   Test route
// @acces  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server error');
    }
});

// @route  Post api/auth
// @desc   Authenticate user & get token
// @acces  Public
router.post('/', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        //See if user exists
        let user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        const isMatch = bcript.compare(password, user.password);

        if (!isMatch) {
            res.status(400).json({ errors: [{ msg: 'Invalid credentials' }] });
        }

        //Return jsonwebtoken

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtToken'), { expiresIn: 360000 }, (err, token) => {
            if (err) {
                throw err;
            }
            res.json(token);
        });

    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server error');
    }

});


module.exports = router;