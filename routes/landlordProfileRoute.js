const express = require('express');
const router = express.Router();
const { createLandlordProfile,deleteLandlordProfile,updateLandlordProfile,alllandlordProfiles, getOneLandlordProfile} = require('../controller/landlordProfileController');
const { landlordAuthenticate,adminAuthenticate} = require('../middlewares/authentication')

const upload = require('../utils/multer')


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     landlordBearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




/**
 * @swagger
 * /api/v1/createProfile/{landlordId}:
 *   post:
 *     summary: Create a new landlord profile
 *     description: Allows a landlord to create their profile with personal details and a profile image. Requires landlord authentication
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The first name of the landlord.
 *                 example: "alaekeka ebuka"
 *               email:
 *                 type: string
 *                 description: The email address of the landlord.
 *                 example: "alaekekaebuka200@gmail.com"
 *               state:
 *                 type: string
 *                 description: The state where the landlord resides.
 *                 example: "lagos"
 *               street:
 *                 type: string
 *                 description: The street address of the landlord.
 *                 example: "123 Main St,Olodi,Apapa"
 *               locality:
 *                 type: string
 *                 description: The locality or city where the landlord resides.
 *                 example: "Ajeromi-Ifelodun"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image of the landlord.
 *     responses:
 *       201:
 *         description: Landlord profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Landlord profile created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique ID of the landlord profile.
 *                       example: "12345"
 *                     fullName:
 *                       type: string
 *                       description: The first name of the landlord.
 *                       example: "alaekeka ebuka"
 *                     email:
 *                       type: string
 *                       description: The email address of the landlord.
 *                       example: "alaekekaebuka200@gmail.com"
 *                     state:
 *                       type: string
 *                       description: The state where the landlord resides.
 *                       example: "lagos"
 *                     street:
 *                       type: string
 *                       description: The street address of the landlord.
 *                       example: "123 Main St,olodi,Apapa"
 *                     locality:
 *                       type: string
 *                       description: The locality or city where the landlord resides.
 *                       example: "Ajeromi-Ifelodun"
 *                     profileImage:
 *                           type: string
 *                           description: The URL of the uploaded profile image.
 *                           example: "https://res.cloudinary.com/example/image.jpg"

 *       400:
 *         description: Bad request, missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All fields are required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating profile"
 */

router.post('/createProfile/:landlordId', landlordAuthenticate, upload.single('profileImage'), createLandlordProfile);


/**
 * @swagger
 * /api/v1/getlandlordprofile/{landlordId}:
 *   get:
 *     summary: Get a landlord profile
 *     description: Fetch the details of a specific landlord profile by their ID. Requires landlord authentication
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully fetched the landlord profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Landlord profile fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     fullName:
 *                       type: string
 *                       example: "Alaekeka Ebuka"
 *                     email:
 *                       type: string
 *                       example: "alaekekaebuka200@gmail.com"
 *                     state:
 *                       type: string
 *                       example: "Lagos"
 *                     street:
 *                       type: string
 *                       example: "123 Main St, Olodi, Apapa"
 *                     locality:
 *                       type: string
 *                       example: "Ajeromi-Ifelodun"
 *                     profileImage:
 *                           type: string
 *                           example: "https://res.cloudinary.com/example/image.jpg"

 *       400:
 *         description: Landlord ID is required
 *       404:
 *         description: Landlord profile not found
 *       500:
 *         description: Error fetching landlord profile
 */


router.get('/getlandlordprofile/:landlordId', landlordAuthenticate, getOneLandlordProfile);




/**
 * @swagger
 * /api/v1/updateLandlordProfile/{landlordId}:
 *   put:
 *     summary: Update landlord profile
 *     description: Update the details of a specific landlord profile. Requires landlord authentication
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the landlord.
 *                 example: "Alaekeka Ebuka"
 *               email:
 *                 type: string
 *                 description: The email address of the landlord.
 *                 example: "alaekekaebuka200@gmail.com"
 *               state:
 *                 type: string
 *                 description: The state where the landlord resides.
 *                 example: "Lagos"
 *               street:
 *                 type: string
 *                 description: The street address of the landlord.
 *                 example: "123 Main St, Olodi, Apapa"
 *               locality:
 *                 type: string
 *                 description: The locality or city where the landlord resides.
 *                 example: "Ajeromi-Ifelodun"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image of the landlord.
 *     responses:
 *       200:
 *         description: Successfully updated the landlord profile
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Landlord profile not found
 *       500:
 *         description: Error updating landlord profile
 */
router.put('/updateLandlordProfile/:landlordId', landlordAuthenticate, upload.single('profileImage'), updateLandlordProfile);


/**
 * @swagger
 * /api/v1/deleteLandlordProfile/{landlordId}:
 *   delete:
 *     summary: Delete a landlord profile
 *     description: Delete a specific landlord profile by their ID. Requires landlord authentication
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Successfully deleted the landlord profile
 *       400:
 *         description: Landlord ID is required
 *       404:
 *         description: Landlord profile not found
 *       500:
 *         description: Error deleting landlord profile
 */
router.delete('/deleteLandlordProfile/:landlordId',landlordAuthenticate, deleteLandlordProfile);



module.exports = router;
