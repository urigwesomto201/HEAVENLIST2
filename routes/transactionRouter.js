const transactionrouter = require("express").Router();
const {initialPayment,verifyPayment}= require('../controller/transaction')



/**
 * @swagger
 * /api/v1/initialize/{tenantId}/{landlordId}/{listingId}:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Initialize a payment
 *     description: This endpoint initializes a payment process by generating a transaction reference and saving the transaction details.
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tenant initiating the payment.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord receiving the payment.
 *         example: "456e7890-e89b-12d3-a456-426614174111"
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing for which the payment is being made.
 *         example: "789e1234-e89b-12d3-a456-426614174222"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be paid.
 *                 example: 5000
 *               email:
 *                 type: string
 *                 description: The email of the customer.
 *                 example: "alaekekaebuka200@gmail.com"
 *               name:
 *                 type: string
 *                 description: The name of the customer.
 *                 example: "alaekeka ebuka"
 *     responses:
 *       201:
 *         description: Payment initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment initialized successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       description: The unique transaction reference.
 *                       example: "TCA-AF123456789"
 *                     checkout_url:
 *                       type: string
 *                       description: The URL for the payment checkout.
 *                       example: "https://checkout.korapay.com/txn_123456"
 *       400:
 *         description: Bad request. Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: PLEASE INPUT ALL FIELDS
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error initializing payment
 */
transactionrouter.post("/initialize/:tenantId/:landlordId/:listingId", initialPayment)


/**
 * @swagger
 * /api/v1/charges:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Verify a payment
 *     description: This endpoint verifies the status of a payment transaction using the transaction reference.
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The reference ID of the transaction to verify.
 *         example: "TCA-AF123456789"
 *     responses:
 *       200:
 *         description: Payment verification successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verification successful
 *                 reference:
 *                   type: string
 *                   description: The verified transaction reference.
 *                   example: "TCA-AF123456789"
 *       400:
 *         description: Bad request. Payment already verified or failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment has already been verified successfully
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Transaction not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error verifying payment
 */
transactionrouter.get("/charges",verifyPayment)





module.exports = transactionrouter;




// /**
//  * @swagger
//  * /api/v1/charges/{reference}:
//  *   get:
//  *     tags:
//  *       - Transactions
//  *     summary: Verify a payment
//  *     description: This endpoint verifies the status of a payment transaction using the transaction reference.
//  *     parameters:
//  *       - in: query
//  *         name: reference
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The reference ID of the transaction to verify.
//  *         example: "TCA-AF123456789"
//  *     responses:
//  *       200:
//  *         description: Payment verification successful.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Payment verification successful
//  *                 reference:
//  *                   type: string
//  *                   description: The verified transaction reference.
//  *                   example: "TCA-AF123456789"
//  *       400:
//  *         description: Bad request. Payment already verified or failed.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Payment has already been verified successfully
//  *       404:
//  *         description: Transaction not found.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Transaction not found
//  *       500:
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Error verifying payment
//  */