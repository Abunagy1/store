// import bodyParser from 'body-parser';
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// import fs from 'fs';
// import fs from "fs-extra";
// import express, { Request, Response } from 'express'

const cors = require ('cors');

// import express, { Application } from 'express';
// const app: express.Application = express()
const express = require('express');
const app = express(); // const app = express(); // Create the Express application object

// Instead of the follwing two lines
//const express = require('express');
//const router = express.Router();
// write just one Line
// const routes = require("express").Router();

const path = require('path');
// import path from 'path';

// import routes from './routes/index';
const index = require('./routes/index');
// import errorMiddleware from './middleware/error.middleware'

// next set of functions call app.use() to add the middleware libraries into the request handling chain
// HTTP request logger middleware to console log all requests
// HTTP security middleware headers
// import { Handler } from 'express'

// HTTP request logger middleware
// const logger: Handler = morgan('short')
// import morgan from 'morgan';
// const morgan = require ('morgan');
const logger = require('morgan');
app.use(logger('short'));
app.use(logger('dev'));

const stylus = require('stylus');

// import helmet from 'helmet'
const helmet = require('helmet');  // secure your Express apps by setting constious HTTP headers
app.use(helmet()); // setting various HTTP headers adds a subset of the available headers

// require('dotenv').config();
// import express, { NextFunction, Request, Response, response } from 'express';
// const config = require ('config');

app.use(express.json()); // to recognize the incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: true })); // parse incoming Request Object of any type, false to parse just strings or arrays request Object بتفسر الريكوستات الجايه
app.use(cookieParser()); // Parse Cookie header and populate req.cookies

// add middleware for static files
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use("/images", express.static(path.join(__dirname, "images")));

const compression = require('compression'); // compress response bodies for all request that traverse through the middleware, based on the given options.
app.use(compression()); // Compress all routes bodies across the middlewares

// create an instance server const app: express.Application = express()

// set up template engine and set the directory
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// app.use(express.json()) // to recognize the incoming Request Object as a JSON Object
app.use(express.urlencoded({ extended: true })); // parse incoming Request Object of any type, false to parse just strings or arrays request Object بتفسر الريكوستات الجايه
// app.use(cookieParser()); // Parse Cookie header and populate req.cookies

// add middleware to for static files
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// add routing for / path to set all routes

app.use('/', index);

// app.use('/', indexRouter)
// app.use('/users', usersRouter) //
// app.use('/catalog', catalogRouter) //Add catalog routes to middleware chain.
/* 
app.get('/', (req: express.Request, res: express.Response) => {
    res.redirect('/api')
})
routes.get("/api", (_req: express.Request, res: express.Response): void =>
  const imagesFilenames: string[] = fs
    .readdirSync(path.resolve("images"))
    .map((filename) => filename.slice(0, -4));
  res.render("index", { filenames: imagesFilenames });
});
app.get('/', (_, res: Response): void => {
    res.status(200).send('Server is working!');
});

routes.get('/', (_req: express.Request, res: express.Response): void => {
  res.sendFile(path.join(__dirname, '../index.html'))
})
*/
// error handler middleware
// app.use(errorMiddleware)

// import { promises as fsPromises } from 'fs'
// import routes from './routes/index'

// const port = 3000 // Default port

// start express server
// import * as dotenv from 'dotenv';
// import dotenv from 'dotenv'
// const dotenv = require('dotenv');
// const result = dotenv.config();
// const { parsed: envs } = result;
// const { port } = require('./config');

/*
app.listen(PORT, () => {
  console.log(`Server is starting at prot:${PORT}`)
  console.log(`Your app is running at port ${port}`); // 
})

// config.js
module.exports = {
  endpoint: process.env.API_URL,
  masterKey: process.env.API_KEY,
  port: process.env.PORT
};
module.exports = envs;
*/
// const createError = require('http-errors');
// catch 404 and forward to error handler http-errors
// app.use(function(req, res, next) { // will cause error NotFoundError: Not Found 404
//   next(createError(404));
// });

// // catch 404 and forward to manual error handler
// app.use(function(err, req, res) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// let PORT = process.env.PORT || 3000;
// if (process.env.ENV === 'test') {
//   PORT = 3001;
// }
// app.listen(PORT, async () => {
//   const url = `\x1b[2mhttp://localhost:${PORT}\x1b[0m`;
//   console.log(`Please open ${url} to review the project ...`);
// });
// app.use(express.json());
// app.use(bodyParser.json());
// app.use(
//   cors({
//     origin: `http://localhost:${PORT}`,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     optionsSuccessStatus: 200,
//   })
// );
module.exports = app;
