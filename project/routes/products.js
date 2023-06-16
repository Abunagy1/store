// import { verifyAuthToken } from '../utilities/authentication'
const { createAuthToken, verifyAuthToken } = require ('../utilities/authentication');
//import jwt from 'jsonwebtoken'
// import express, { Request, Response } from 'express'
const { express, Request, Response } = require('express');
// import { Product, ProductStore } from '../controllers/product'
const productRouter = require("express").Router();
//const express = require('express');
// const productRouter = express.Router()
const store = require ('../controllers/product')
  // ##############################################################################\\\

// ########################## List All Products View #################################### \\\
const products = async (_req, res) => {
  try {
    const products = await store.index()
    res.json(products)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
}
  // ##############################################################################\\\

// ##########################  Product details View ################################### \\\
const product_details = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    const product = await store.show(id)
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
}
  // ##############################################################################\\\

// ########################## Create Product View #################################### \\\
const createProduct = async (req, res) => {
  try {
    const productInfo = {
      sku: req.body.name,
      name: req.body.name,
      price: req.body.price,
      Type_Switcher: req.body.Type_Switcher,
    }
    const product = await store.create(productInfo)
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
}
  // ##############################################################################\\\

// ########################## Delete Product View #################################### \\\
const destroy = async (req, res) => {
  try {
    const id = parseInt(req.body.id)
    const product = await store.delete(id)
    res.json(product)
  } catch (err) {
    console.error(err)
    res.status(500).send(`${err}`)
  }
}
  // ##############################################################################\\\

// ########################## Routes View #################################### \\\
productRouter.get('/', products)
productRouter.get('/id', product_details) // verifyAuthToken
productRouter.post('/add', createProduct) // verifyAuthToken
productRouter.delete('/id/delete', destroy)  // verifyAuthToken
// export default productRouter
module.exports = productRouter;