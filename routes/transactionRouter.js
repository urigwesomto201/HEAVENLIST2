const transactionrouter = require("express").Router();
const {initialPayment,verifyPayment,getLandlordTransactions}= require('../controller/transaction')



/**
 * @swagger
 * /api/v1/initialize/{tenantid}/{landlordid}/{listingId}:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Initialize a payment
 *     description: This endpoint initializes a payment process by generating a transaction reference and saving the transaction details.
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
 *                 example: 100.0
 *               email:
 *                 type: string
 *                 description: The email of the customer.
 *                 example: "customer@example.com"
 *               name:
 *                 type: string
 *                 description: The name of the customer.
 *                 example: "John Doe"
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
 * /api/v1/charges/{reference}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Verify a payment
 *     description: This endpoint verifies the status of a payment transaction using the transaction reference.
 *     parameters:
 *       - in: query
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
transactionrouter.get("/charges/:reference",verifyPayment)



/**
 * @swagger
 * /api/v1/landlordtransactions/{landlordId}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get landlord transactions
 *     description: This endpoint retrieves all transactions for a specific landlord.
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord whose transactions are to be retrieved.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Landlord transactions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Landlord transaction history retrieved successfully
 *                 totalAmount:
 *                   type: number
 *                   description: The total amount of successful transactions.
 *                   example: 5000.0
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The transaction ID.
 *                         example: "123e4567-e89b-12d3-a456-426614174000"
 *                       amount:
 *                         type: number
 *                         description: The transaction amount.
 *                         example: 100.0
 *                       status:
 *                         type: string
 *                         description: The transaction status.
 *                         example: "success"
 *       404:
 *         description: Landlord not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Landlord not found
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching landlord transactions
 */

transactionrouter.get('/landlordtransactions/:landlordId', getLandlordTransactions);




module.exports = transactionrouter;


