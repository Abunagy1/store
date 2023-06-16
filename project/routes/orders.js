const orderRouter = require("express").Router();
//const express = require('express');
// const orderRouter = express.Router()
// import express, { Request, Response } from 'express'
// import { verifyAuthToken } from '../utilities/authentication'
const { createAuthToken, verifyAuthToken } = require ('../utilities/authentication');
// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');
const store = require ('../controllers/order');
//import { UserStore } from '../models/user'
// import { Order, OrderStore } from '../controllers/order'
// const store = new OrderStore()
// const userStore = new UserStore()
  // ##############################################################################\\\

// ########################## List All orders View #################################### \\\
const orders = async (_req, res) => {
  const orders = await store.index()
  res.json(orders)
};
  // ##############################################################################\\\

// ########################## Order Details View #################################### \\\
const order_details = async (req, res) => {
  const order = await store.show(req.body.id)
  res.json(order)
};
// ##############################################################################\\\
// ########################## Create Order View #################################### \\\
const createOrder = async (req, res) => {
  try {
    const data = {user_id: req.body.user_id, current_status: req.body.current_status,};
    if (!data) {
      return res.status(400).json({error: 'Missing one or more required parameters',
    })}
    const order = await store.create(data.user_id, data.current_status)
    res.status(200).json(order)
    //res.json(order)
  } catch (err) {
    console.error(err)
    res.status(400).json('' + `${err}`)
  }
};
// ##############################################################################\\\
    // ########################## ADD Product View #################################### \\\
const addProduct = async (req, res) => {
  try {
    const user_id = parseInt(req.params.id)
    const { product_id, quantity } = req.body
    const orderDetails = await store.addProductToOrder(user_id, product_id, quantity)
    res.json(orderDetails)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
};
  // ##############################################################################\\\
// ########################## Delete Product View #################################### \\\
const removeProduct = async (req, res) => {
  try {
    const user_id = parseInt(req.params.id)
    const product_id = req.body.product_id
    const orderDetails = await store.removeProductFromOrder(user_id, product_id)
    res.json(orderDetails)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
};
// ##############################################################################\\\
  // ########################## Add Product To orders View #################################### \\\
const openCart = async (req, res) => {
  const order_id = req.body.id
  const product_id = req.body.product_id
  const quantity = parseInt(req.body.quantity)
  const user_id = parseInt(req.params.id)
  if (!order_id || !product_id || !quantity) {
    return res.status(400).json({ error: 'Missing one or more required parameters', })
  }
  try {
    const product = await store.openCart(quantity, order_id, product_id, user_id)
    res.status(200).json(product)
  } catch (err) {
    res.status(500).json(err); ('cannot add product')
    //res.status(400)
    // res.json(err)
  }
};
  // ##############################################################################\\\
// ########################## Update Order View #################################### \\\
const updateStatus = async (req, res) => {
  // const user_id = req.body.user_id
  const user_id = parseInt(req.params.id)
  try {
    const order = await store.updateStatus(user_id)
    res.status(201).json(order)
    //res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
};
  // ##############################################################################\\\
// ########################## Delete Order View #################################### \\\
const removeOrder = async (req, res) => {
  try {
    await store.delete(parseInt(req.params.id))
    res.status(200).json({ status: `Deleted order ${req.params.id}` })
  } catch (e) {
    res.status(500).json(e)
  }
};
// with jwt auth
const deleteOrder = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : ''
    res.locals.userData = jwt.verify(token, process.env.TOKEN_SECRET)
  } catch (err) {
    res.status(401)
    res.json('Access denied, invalid token')
    return
  }
  try {
    const deleted = await store.delete(req.body.id)
    //const deleted = await store.delete(parseInt(req.params.id))
    //res.status(200).json({ status: `Deleted order ${req.params.id}`})
    res.json(deleted)
  } catch (error) {
    res.status(400)
    res.json({ error })
  }
};
  // ##############################################################################\\\
  // ##############################################################################\\\

// ##############################################################################\\\
// ########################## Get Active Orders View #################################### \\\
const getActive = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id)
    const order = await store.getActiveOrder(user_id)
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
};
  // ##############################################################################\\\

// ########################## Get Current Orders View #################################### \\\
const getCurrentOrders = async (req, res) => {
  try {
    const currentOrders = await store.getCurrentOrders(
      parseInt(req.params.id)
    )
    res.status(200).json(currentOrders)
  } catch (e) {
    res.status(400).json(e)
  }
};
  // ##############################################################################\\\

// ########################## Get Completed Orders View #################################### \\\
const getCompleted = async (req, res) => {
  try {
    const user_id = parseInt(req.params.user_id)
    const order = await store.getCompletedOrders(user_id)
    res.json(order)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
};
  // ##############################################################################\\\

// ########################## Routes View #################################### \\\

// orderRouter.get('/', orders)
orderRouter.get('/', verifyAuthToken, orders)
orderRouter.get('/id', verifyAuthToken, order_details)
orderRouter.get('/id/current', verifyAuthToken, getCurrentOrders)
orderRouter.get('/id/active', verifyAuthToken, getActive)
orderRouter.get('/id/completed', verifyAuthToken, getCompleted)
orderRouter.put('/id/update', verifyAuthToken, updateStatus)
// If we were to add a user as an owner of the order
// /:userID/orders/:orderID/products
orderRouter.post('/create', createOrder) 
orderRouter.post('/add-open/', verifyAuthToken, openCart) // addProductToOrder
orderRouter.delete('/id/delete-order', verifyAuthToken, removeOrder)
orderRouter.delete('/id/delete', verifyAuthToken, deleteOrder)
orderRouter.post('/id/add-product', verifyAuthToken, addProduct)
orderRouter.delete('/id/remove-product', verifyAuthToken, removeProduct)
// export default orderRouter

module.exports = orderRouter;