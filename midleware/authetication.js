const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){

    // Get token from header
    const token = req.header('x-auth-token');

    // Chek if no token
    if (!token) {
        res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token not valid' });
    }
};