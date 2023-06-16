//const fs = require ('fs');
const path = require('path');
// Instead of the follwing two lines
//const express = require('express');
//const router = express.Router();
// write just one Line
const routes = require("express").Router();
const client = require ('../database');
// Users GET / POST Request Routeers functions
const usersRouter = require('./users');  // users router Functions module
// const aboutRouter = require('./about');
// const contactRouter = require('./contact');
const orderRouter = require('./orders');  // users router Functions module
const productRouter = require('./products');  // users router Functions module
/* GET home page. */
routes.get('/', async (_req, res) => {
  try {
    const conn = await client.connect();
    const query = 'SELECT * FROM products;';
    const result = await conn.query(query);
    conn.release();
    res.render("index", { data: result });  // for just API it was res.json(result);  
    // return result.rows; // list all columns  => // will contain the unparsed string value of each column
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
    throw new Error(`Could not get users from Database. Error: ${err}`);
  }
});
// routes.get('/', (_req, res, next) => {
//     res.sendFile(path.join(__dirname, '../../index.html'));
//     next()
// });

// const home = require('../controllers/homeController');
// routes.get('/', home.index);  // index is a function in homeController module

// validation should be on index routes modue only for no dublication on routes that needs validation
// next routes could be put here or stay in server/app.js as the rest of routes
// but due to auth or validation just put all in one file
// const verifyToken = require("../utilities/validate-token");
// const { createAuthToken, verifyAuthToken } = require ('../utilities/authentication');
// const { validateRequest, loginValidation } = require("../utilities/validation");

routes.use('/users', usersRouter);
// routes.use('/about', aboutRouter);
// routes.use('/contact', contactRouter);
// routes.use("/dashboard", dashboardRoutes);
// routes.use('/authors', authorsRouter);

// other paths -- /store
routes.use('/orders', orderRouter);
routes.use('/products', productRouter);


module.exports = routes;
