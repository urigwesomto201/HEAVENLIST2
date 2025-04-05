const router = require('express').Router();

const {registerAdmin, loginAdmin, adminForgotPassword, adminResetPassword,changeAdminPassword, logoutAdmin,
     getAdmin, getAllAdmins, deleteAdmin, getAllTenants,
    getAllLandlords, verfiyAlisting, unverifyAlisting,
    getOneTenant, getOneLandlord, getOneLandlordProfile, getAllLandlordProfile,deleteLandlordProfile
} = require('../controller/adminController')
const { adminAuthenticate } = require('../middlewares/authentication')



/**
 * @swagger
 * /api/v1/registeradmin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Register a new admin
 *     description: Create a new admin account with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Bad request due to invalid input
 *       500:
 *         description: Internal server error
 */


router.post('/registeradmin', registerAdmin)



/**
 * @swagger
 * /api/v1/loginAdmin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin login
 *     description: Authenticate an admin with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/loginAdmin', loginAdmin)


/**
 * @swagger
 * /api/v1/adminForgotPassword:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Forgot password
 *     description: Send a password reset link to the admin's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Password reset link sent successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.post('/adminForgotPassword', adminForgotPassword)

/**
 * @swagger
 * /api/v1/reset-adminpassword:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Reset admin password
 *     description: Reset the admin's password using a valid token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: resetToken123
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or input
 *       500:
 *         description: Internal server error
 */

router.post('/reset-adminpassword', adminResetPassword)

/**
 * @swagger
 * /api/v1/changeAdminPassword:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Change admin password
 *     description: Change the admin's password after authentication.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: OldPassword123
 *               newPassword:
 *                 type: string
 *                 example: NewStrongPassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized or invalid old password
 *       500:
 *         description: Internal server error
 */

router.post('/changeAdminPassword',adminAuthenticate, changeAdminPassword)



/**
 * @swagger
 * /api/v1/getAllTenants:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all tenants
 *     description: Retrieve a list of all tenants.
 *     responses:
 *       200:
 *         description: List of tenants retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllTenants', getAllTenants)

/**
 * @swagger
 * /api/v1/getOneTenant/{tenantId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a single tenant
 *     description: Retrieve details of a specific tenant by ID.
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         description: ID of the tenant to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tenant details retrieved successfully
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */

router.get('/getOneTenant/:tenantId', getOneTenant)



/**
 * @swagger
 * /api/v1/getAllLandlords:
 *   get:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
 *     summary: Get all landlords
 *     description: Retrieve a list of all landlords
 *     responses:
 *       200:
 *         description: List of landlords retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllLandlords', getAllLandlords)


/**
 * @swagger
 * /api/v1/getOneLandlord/{landlordId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get one landlord
 *     description: Retrieve details of a specific landlord by ID
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         description: ID of the landlord to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landlord details retrieved successfully
 *       404:
 *         description: Landlord not found
 *       500:
 *         description: Internal server error
 */


router.get('/getOneLandlord/:landlordId', getOneLandlord)

/**
 * @swagger
 * /api/v1/getOneLandlordProfile/{landlordProfileId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get one landlord profile
 *     description: Retrieve details of a specific landlord profile by ID
 *     parameters:
 *       - in: path
 *         name: landlordProfileId
 *         required: true
 *         description: ID of the landlord profile to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landlord profile details retrieved successfully
 *       404:
 *         description: Landlord profile not found
 *       500:
 *         description: Internal server error
 */


router.get('/getOneLandlordProfile/:landlordProfileId', getOneLandlordProfile)


/**
 * @swagger
 * /api/v1/getAllLandlordProfile:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all landlord profiles
 *     description: Retrieve a list of all landlord profiles
 *     responses:
 *       200:
 *         description: List of landlord profiles retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllLandlordProfile', getAllLandlordProfile)




/**
 * @swagger
 * /api/v1/deleteLandlordProfile/{landlordProfileId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a landlord profile
 *     description: Delete a specific landlord profile by ID
 *     parameters:
 *       - in: path
 *         name: landlordProfileId
 *         required: true
 *         description: ID of the landlord profile to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Landlord profile deleted successfully
 *       404:
 *         description: Landlord profile not found
 *       500:
 *         description: Internal server error
 */

router.delete('/deleteLandlordProfile/:landlordProfileId', deleteLandlordProfile)








/**
 * @swagger
 * /api/v1/getadmin/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get a single admin
 *     description: Retrieve details of a specific admin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to retrieve
 *         type: string
 *     responses:
 *       200:
 *         description: Admin details retrieved successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.get('/getadmin/:id',adminAuthenticate, getAdmin); 



/**
 * @swagger
 * /api/v1/getAllAdmins:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all admins
 *     description: Retrieve a list of all admins
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllAdmins',adminAuthenticate, getAllAdmins); 


/**
 * @swagger
 * /api/v1/admin/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete an admin
 *     description: Delete a specific admin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the admin to delete
 *         type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Admin not found
 *       500:
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Error deleting admin
 *             error:
 *               type: string
 *               example: Detailed error message
 */

router.delete('/admin/:id',adminAuthenticate, deleteAdmin); 



/**
 * @swagger
 * /api/v1/verfiyAlisting/{landlordId}/{listingId}:
 *   put:
 *     summary: Verify a listing by a landlord
 *     description: This endpoint allows a landlord to verify a listing.
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         description: The ID of the landlord verifying the listing
 *         required: true
 *         schema:
 *           type: integer
 *       - name: listingId
 *         in: path
 *         description: The ID of the listing to be verified
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: The body contains the landlordId and listingId in the path parameters.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               listingId:
 *                 type: integer
 *                 description: The ID of the listing.
 *               landlordId:
 *                 type: integer
 *                 description: The ID of the landlord.
 *     responses:
 *       200:
 *         description: Listing has been successfully verified and updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing has been verified."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     location:
 *                       type: string
 *                       example: "Downtown Apartment"
 *                     title:
 *                       type: string
 *                       example: "Luxury Apartment for Rent"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Listing has already been verified or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing has already been verified."
 *       404:
 *         description: Listing not found or does not belong to the specified landlord.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing not found or does not belong to the specified landlord."
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying a listing."
 */
router.put('/verfiyAlisting/:landlordId/:listingId', verfiyAlisting);

/**
 * @swagger
 * /api/v1/unverifyAlisting/{landlordId}/{listingId}:
 *   put:
 *     summary: Unverify a listing
 *     description: This endpoint allows a landlord to unverify a listing by setting `isVerified` and `isAvailable` to false.
 *     tags:
 *       - Listings
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         description: The ID of the landlord.
 *         schema:
 *           type: integer
 *       - in: path
 *         name: listingId
 *         required: true
 *         description: The ID of the listing to unverify.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: The listing has been successfully unverified.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Listing has been unverified'
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     isAvailable:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request due to invalid listing ID or landlord ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Listing id or Landlord ID is required'
 *       404:
 *         description: Listing not found or does not belong to the specified landlord.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Listing not found or does not belong to the specified landlord'
 *       500:
 *         description: Internal server error when updating the listing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error unverifying listings'
 */

router.put('/unverifyAlisting/:landlordId/:listingId', adminAuthenticate,unverifyAlisting)



module.exports = router;