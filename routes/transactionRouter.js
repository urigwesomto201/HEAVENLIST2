const transactionrouter = require("express").Router();
const {initialPayment,verifyPayment}= require('../controller/transaction')

transactionrouter.post("/initialize",initialPayment)
transactionrouter.get("/verify",verifyPayment)

 module.exports = transactionrouter;


