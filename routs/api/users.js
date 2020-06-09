const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const { check, validationResult } = require('express-validator');
const bcript = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');


const User = require('../../models/User')

// @route  Post api/users
// @desc   Register user
// @acces  Public
router.post('/', [
    check('name', 'Name is requierd').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        //See if user exists
        let user = await User.findOne({ email });

        if (user) {
            res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        //Get users Gravatar

        const avatar = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //Encrypt password

        let salt = await bcript.genSalt(10);

        user.password = await bcript.hash(password, salt);

        await user.save()

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