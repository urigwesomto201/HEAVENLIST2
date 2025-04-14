
const router = require('express').Router();
const  {scheduleInspection, confirmSchedule}= require('../controller/inspectionController');
const { adminAuthenticate } = require('../middlewares/authentication')


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     AdminBearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




/**
 * @swagger
 * /schedule/{tenantId}/{listingId}:
 *   get:
 *     tags:
 *       - Inspections
 *     summary: Schedule an inspection
 *     description: This endpoint allows a tenant to schedule an inspection for a specific listing.
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the tenant scheduling the inspection.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - in: path
 *         name: listingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the listing for which the inspection is being scheduled.
 *         example: "456e7890-e12b-34d5-a678-426614174001"
 *       - in: query
 *         name: days
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
 *         description: The day of the week for the inspection.
 *         example: "Monday"
 *       - in: query
 *         name: timeRange
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["10am-4pm"]
 *         description: The time range for the inspection.
 *         example: "10am-4pm"
 *     responses:
 *       201:
 *         description: Inspection scheduled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inspection scheduled successfully.
 *                 inspection:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the scheduled inspection.
 *                       example: "789e1234-e56b-78d9-a012-426614174002"
 *                     tenantId:
 *                       type: string
 *                       description: The ID of the tenant.
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     listingId:
 *                       type: string
 *                       description: The ID of the listing.
 *                       example: "456e7890-e12b-34d5-a678-426614174001"
 *                     days:
 *                       type: string
 *                       description: The day of the inspection.
 *                       example: "Monday"
 *                     timeRange:
 *                       type: string
 *                       description: The time range of the inspection.
 *                       example: "9am-12pm"
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tenant ID, Listing ID, days, and timeRange are required.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error scheduling inspection.
 */
router.get('/schedule/:tenantId/:listingId', scheduleInspection);



/**
 * @swagger
 * /confirmSchedule/{inspectionId}:
 *   post:
 *     tags:
 *       - Inspections
 *     summary: Confirm or update the status of an inspection
 *     description: This endpoint allows a landlord or admin to confirm or update the status of a scheduled inspection.
 *     security:
 *       - landlordBearerAuth: [] # Optional landlord token
 *       - AdminBearerAuth: []    # Optional admin token
 *     parameters:
 *       - in: path
 *         name: inspectionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the inspection to confirm or update.
 *         example: "789e1234-e56b-78d9-a012-426614174002"
 *       - in: body
 *         name: statusDetails
 *         required: true
 *         description: The details of the status update.
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               description: The new status of the inspection (e.g., "confirmed", "cancelled").
 *               example: "confirmed"
 *     responses:
 *       200:
 *         description: Inspection status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inspection status updated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The ID of the inspection.
 *                       example: "789e1234-e56b-78d9-a012-426614174002"
 *                     status:
 *                       type: string
 *                       description: The updated status of the inspection.
 *                       example: "confirmed"
 *                     tenantId:
 *                       type: string
 *                       description: The ID of the tenant.
 *                       example: "123e4567-e89b-12d3-a456-426614174000"
 *                     listingId:
 *                       type: string
 *                       description: The ID of the listing.
 *                       example: "456e7890-e12b-34d5-a678-426614174001"
 *       400:
 *         description: Bad request. Missing or invalid parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Status is required.
 *       404:
 *         description: Inspection not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inspection not found.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cannot confirm schedule date.
 */


router.post('/confirmSchedule/:inspectionId',adminAuthenticate, confirmSchedule);




module.exports = router;