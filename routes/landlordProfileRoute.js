const express = require('express');
const router = express.Router();
const { createLandlordProfile,deleteLandlordProfile,updateLandlordProfile,getLandlordProfile, getOneLandlordProfile} = require('../controller/landlordProfileController');
const { landlordAuthenticate } = require('../middlewares/authentication')

const upload = require('../utils/multer')
/**
 * @swagger
 * /api/landlord/createProfile:
 *   post:
 *     summary: Create a new landlord profile
 *     description: Allows a landlord to create their profile with personal details and an optional profile image.
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - state
 *               - street
 *               - locality
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               state:
 *                 type: string
 *                 example: "California"
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               locality:
 *                 type: string
 *                 example: "Los Angeles"
 *               profileImage:
 *                 type: string
 *                 format: binary
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
 *                       example: "12345"
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     state:
 *                       type: string
 *                       example: "California"
 *                     street:
 *                       type: string
 *                       example: "123 Main St"
 *                     locality:
 *                       type: string
 *                       example: "Los Angeles"
 *                     profileImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: "https://res.cloudinary.com/example/image.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "profile123"
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

// Route to create landlord profile
router.post('/createProfile/:landlordId', landlordAuthenticate, upload.single('profileImage'), createLandlordProfile);


/**
 * @swagger
 * /landlord/{landlordId}:
 *   get:
 *     summary: "Get a landlord profile"
 *     description: "Fetch the details of a specific landlord profile by their ID."
*     tags:
 *       - Landlord Profile
  *     security: [] # No authentication required
 *     parameters:
 *       - name: "landlordId"
 *         in: "path"
 *         description: "ID of the landlord to fetch the profile"
 *         required: true
 *         schema:
 *           type: "string"
 *     responses:
 *       200:
 *         description: "Successfully fetched the landlord profile"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   example: "Landlord profile fetched successfully"
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     id:
 *                       type: "string"
 *                       example: "1"
 *                     firstName:
 *                       type: "string"
 *                       example: "John"
 *                     lastName:
 *                       type: "string"
 *                       example: "Doe"
 *                     email:
 *                       type: "string"
 *                       example: "john.doe@example.com"
 *                     state:
 *                       type: "string"
 *                       example: "Lagos"
 *                     profileImage:
 *                       type: "object"
 *                       properties:
 *                         imageUrl:
 *                           type: "string"
 *                           example: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/images/john-doe.jpg"
 *                         publicId:
 *                           type: "string"
 *                           example: "public-id-of-the-image"
 *       400:
 *         description: "Landlord ID is required"
 *       404:
 *         description: "Landlord profile not found"
 *       500:
 *         description: "Error fetching landlord profile"
 */

router.get('/landlord/:landlordId', getOneLandlordProfile);
/**
* @swagger
 * /landlords:
 *   get:
 *     summary: "Get all landlords"
 *     description: "Fetch the list of all landlords along with their basic profile information."
 *     tags:
 *       - Landlord Profile
  *     security: [] # No authentication required
 *     responses:
 *       200:
 *         description: "Successfully fetched all landlords"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   example: "Landlords fetched successfully"
 *                 data:
 *                   type: "array"
 *                   items:
 *                     type: "object"
 *                     properties:
 *                       id:
 *                         type: "string"
 *                         example: "1"
 *                       firstName:
 *                         type: "string"
 *                         example: "John"
 *                       lastName:
 *                         type: "string"
 *                         example: "Doe"
 *                       email:
 *                         type: "string"
 *                         example: "john.doe@example.com"
 *                       state:
 *                         type: "string"
 *                         example: "Lagos"
 *                       profileImage:
 *                         type: "object"
 *                         properties:
 *                           imageUrl:
 *                             type: "string"
 *                             example: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/images/john-doe.jpg"
 *                           publicId:
 *                             type: "string"
 *                             example: "public-id-of-the-image"
 *       500:
 *         description: "Internal server error"
*/
router.get('/landlords', getLandlordProfile);

/**
 * @swagger
 * /landlord/{landlordId}:
 *   put:
 *     summary: "Update landlord profile"
 *     description: "Update the details of a specific landlord profile."
*     tags:
 *       - Landlord Profile
  *     security: [] # No authentication required
 *     parameters:
 *       - name: "landlordId"
 *         in: "path"
 *         description: "ID of the landlord to update the profile"
 *         required: true
 *         schema:
 *           type: "string"
 *       - name: "profileImage"
 *         in: "formData"
 *         description: "Profile image file"
 *         required: false
 *         type: "file"
 *       - name: "firstName"
 *         in: "body"
 *         description: "First name of the landlord"
 *         required: false
 *         schema:
 *           type: "string"
 *       - name: "lastName"
 *         in: "body"
 *         description: "Last name of the landlord"
 *         required: false
 *         schema:
 *           type: "string"
 *       - name: "email"
 *         in: "body"
 *         description: "Email address of the landlord"
 *         required: false
 *         schema:
 *           type: "string"
 *       - name: "Password"
 *         in: "body"
 *         description: "New password for the landlord"
 *         required: false
 *         schema:
 *           type: "string"
 *       - name: "confirmPassword"
 *         in: "body"
 *         description: "Confirm new password"
 *         required: false
 *         schema:
 *           type: "string"
 *     responses:
 *       200:
 *         description: "Successfully updated the landlord profile"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   example: "Landlord profile updated successfully"
 *                 data:
 *                   type: "object"
 *                   properties:
 *                     id:
 *                       type: "string"
 *                       example: "1"
 *                     firstName:
 *                       type: "string"
 *                       example: "John"
 *                     lastName:
 *                       type: "string"
 *                       example: "Doe"
 *                     email:
 *                       type: "string"
 *                       example: "john.doe@example.com"
 *                     state:
 *                       type: "string"
 *                       example: "Lagos"
 *                     profileImage:
 *                       type: "object"
 *                       properties:
 *                         imageUrl:
 *                           type: "string"
 *                           example: "https://res.cloudinary.com/your-cloud-name/image/upload/v1/images/john-doe.jpg"
 *                         publicId:
 *                           type: "string"
 *                           example: "public-id-of-the-image"
 *       400:
 *         description: "Missing required fields or passwords do not match"
 *       404:
 *         description: "Landlord profile not found"
 *       500:
 *         description: "Error updating landlord profile"
 */

router.put('/landlord/:landlordId', upload.single('profileImage'), updateLandlordProfile);

/**
 * @swagger
 * /landlord/{landlordId}:
 *   delete:
 *     summary: "Delete a landlord profile"
 *     description: "Delete a specific landlord profile by their ID."
*     tags:
 *       - Landlord Profile
  *     security: [] # No authentication required
 *     parameters:
 *       - name: "landlordId"
 *         in: "path"
 *         description: "ID of the landlord to delete the profile"
 *         required: true
 *         schema:
 *           type: "string"
 *     responses:
 *       200:
 *         description: "Successfully deleted the landlord profile"
 *         content:
 *           application/json:
 *             schema:
 *               type: "object"
 *               properties:
 *                 message:
 *                   type: "string"
 *                   example: "Landlord profile deleted successfully"
 *       400:
 *         description: "Landlord ID is required"
 *       404:
 *         description: "Landlord profile not found"
 *       500:
 *         description: "Error deleting landlord profile"
 */
router.delete('/landlord/:landlordId', deleteLandlordProfile);

module.exports = router;
