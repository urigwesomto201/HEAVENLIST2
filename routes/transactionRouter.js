const transactionrouter = require("express").Router();
const {initialPayment,verifyPayment}= require('../controller/transaction')



/**
 * @swagger
 * /transaction/initialize:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Initialize a payment
 *     description: This route initializes a payment process.
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 * /transaction/verify:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Verify a payment
 *     description: This route verifies a payment transaction.
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

transactionrouter.post("/initialize",initialPayment)

/**
 * @swagger
 * /transaction/verify:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Verify a payment
 *     description: This route verifies a payment transaction.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Payment verification details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             transactionId:
 *               type: string
 *               description: The ID of the transaction to verify
 *               example: "txn_123456789"
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Payment verified successfully
 *             data:
 *               type: object
 *               description: Details of the verified transaction
 *       400:
 *         description: Bad request
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Invalid transaction ID
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Error verifying payment
 *             error:
 *               type: string
 *               example: Detailed error message
 */


transactionrouter.get("/verify",verifyPayment)

module.exports = transactionrouter;


