const jwt = require('jsonwebtoken');
//const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// const { TOKEN_SECRET } = process.env;
const secret = process.env.TOKEN_SECRET

exports.createAuthToken = (User) => {
    return jwt.sign(User, secret);
};
// middleware to validate token must have next() as all middlewares functions
exports.verifyAuthToken = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
        jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(401)
        res.json(`An error occurred: ${err}`)
        return
    }
};

// // another syntax for verfication
// const verifyToken = (req, res, next) => {
//   const token = req.header("auth-token");
//   if (!token) return res.status(401).json({ error: "Access denied" });

//   try {
//     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).json({ error: "Token is not valid" });
//   }
// };

// module.exports = verifyToken;