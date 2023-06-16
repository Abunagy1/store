const userRouter = require("express").Router();
// const { express, Request, Response } = require('express');
const jwt = require('jsonwebtoken');
const store = require ('../controllers/user');
// const {jwt, JwtPayload } = require ('jsonwebtoken'); // doesn't work
const secret = process.env.TOKEN_SECRET;
// validation should be on index routes modue only for no dublication on routes that needs validation
// next routes could be put here or stay in server/app.js as the rest of routes
// but due to auth or validation just put all in one file
const { createAuthToken, verifyAuthToken } = require ('../utilities/authentication');
const { validateRequest, loginValidation } = require("../utilities/validation");

// ##############################################################################\\\

// ########################## Routes Views #################################### \\\

/* GET users listing. */
// the next users function has been merged into one user controller fn for simplisity => see user.js index function
// ########################## List All Users View #################################### \\\
const users = async (_req, res) => {
  try {
    const users = await store.index();
    res.json(users);  
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};
// ##############################################################################\\\

// ########################## User Details view #################################### \\\
// if you are going to use this function you must put verifyAuthToken on the route path address or use self verfication fn like getUserBytoken
const user_details = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};
// the next function is the self verfication copy of user_details fn w/o using external verifyAuthToken on the route address below
const getUserByToken = async (req, res) => {
  // Verifying the existence of valid token
  // before writing it as middleware function
  const user_id = parseInt(req.params.id);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, secret);
    //const decoded = jwt.verify(req.body.token, secret)
    if (decoded.user.id !== user_id) {
      res.json('User ID mismatch with token');
      return;
    } else {
      const user = await store.show(user_id);
      // const updatedUser = await store.update(user, req.body);
      res.json(user);
      return;
    }
  } catch (err) {
    res.json(err);
  }
};
// ##############################################################################\\\

// ########################## Create User view #################################### \\\
const createUser = async (req, res) => {
   const userInfo = {
    username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password
  };
  try {
    const user = await store.create(userInfo);
    // Creating tokens and returning it to the client side using sign method => you can use sign method as external module or writen direct 
    //const token = createAuthToken(userInfo);
    const token = jwt.sign(user, secret);
    //const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET);
    res.json(token)
  } catch (err) {
    console.error(err);
    res.json(() => {res.status(500).send(`${err}`);+userInfo}) // res.status(500).send(`${err}`)
  }
};

// ##############################################################################\\\

// ########################## Update User View #################################### \\\
// auth method to confirm that the users can only update their information (simple one)
const updateUser = async (req, res) => {
  // const user_id = parseInt(req.params.id);
  // console.log(req.params)
  // const email =  req.body.email
  // const password = req.body.password
  const user = {id: parseInt(req.params.id), username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password,};
  try {
    // const authHeader = req.headers.authorization?.split(' ')[1];
    // const decoded = jwt.verify(authHeader, secret);
    // // decoded has a Payload of the request token that contains user info
    // if (decoded.user.id !== user_id) {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader? authorizationHeader.split(' ')[1] : '';
    res.locals.userData = jwt.verify(token, process.env.TOKEN_SECRET);
    if (res.locals.userData.id !== user.id) {
      throw new Error('User id does not match!');
    }
    // this snippet portion has been added from above updateUser
    else {
      // const user = await store.show(user_id);
      const userInfo = await store.show(user.id);
      const updatedUser = await store.update(userInfo);
      res.json(updatedUser);
    }
    // end of snippet portion
  } catch (err) {
    res.status(401);
    res.json(() => {res.status(500).send(`${err}`);+user;});
    return;
  }
};
// ##############################################################################\\\

// ########################## Login View #################################### \\\
const login = async (req, res) => {
// const user = {username: req.body.username, first_name: req.body.first_name, last_name: req.body.last_name, email: req.body.email, password: req.body.password,};
  try {
    // const userInfo = await store.authenticate(user.username, user.password);
    const userInfo = await store.authenticate(req.body.username, req.body.password); // userInfo has all user data
    if (userInfo) {
      const token = jwt.sign(userInfo, secret);
      //const token = jwt.sign({ user: userInfo }, process.env.TOKEN_SECRET);
      res.json(token);
    } else {
      res.json(userInfo);
      res.send('Invalid username and/or password');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`${err}`);
  }
};
// ##############################################################################\\\
// need self verfication or put verify on the route address below
const destroyUser = async (_req, res) => {
  const deleted = await store.delete(_req.body.id);
  res.json(deleted);
};
// ##############################################################################\\\

userRouter.get('/', users);  // OR => router.get('/', async (req, res) => {...} ) directly
userRouter.post('/create', createUser);
userRouter.get('/id', verifyAuthToken, user_details);
userRouter.get('/id/get', getUserByToken); // app.get('/{:id}', getUser)
userRouter.put('/id/update', updateUser); // i made this just correct it as needed
userRouter.post('/login', verifyAuthToken, login);
userRouter.delete('/id/delete', verifyAuthToken, destroyUser);


module.exports = userRouter;
