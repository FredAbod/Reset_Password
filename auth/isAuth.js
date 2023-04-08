const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
// const User = require('../models/user.models');

exports.isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Invalid token'});

        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        if(!decoded){
            throw new Error();
        }
        req.user = decoded;
        console.log('=================req.user');
        console.log(req.user);
        console.log('=================req.user');
         next();
    } catch (e) {
        return res.status(401).json(` signUp as user || Token expired \n ${e}`);
    }
};