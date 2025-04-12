const router = require('express').Router();

const {registerAdmin, loginAdmin, adminForgotPassword, adminResetPassword,changeAdminPassword, logoutAdmin,
    getAdmin, getAllAdmins, deleteAdmin, getAllTenants, verifyAdminEmail,
    getAllLandlords, verifyAlisting, unverifyAlisting,
    getOneTenant, getOneLandlord, getOneLandlordProfile,deleteLandlordProfile, alllandlordProfiles

} = require('../controller/adminController')
const { adminAuthenticate } = require('../middlewares/authentication')



/**
 * @swagger
 * /api/v1/registeradmin:
 *   post:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
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
 *                 description: this is the full name of the user
 *                 example: Alaekeka Ebuka
 *               email:
 *                 type: string
 *                 description: this is the email of the user
 *                 example: alaekekaebuka200@gmail.com
 *               password:
 *                 type: string
 *                 description: this is the password of the user
 *                 example: Successtoall20$
 *               confirmPassword:
 *                 type: string
 *                 description: this is the confirm password of the user
 *                 example: Successtoall20$
 *     responses:
 *       201:
 *         description: user created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   description: this is the full name of the user
 *                   example: Alaekeka Ebuka
 *                 email:
 *                   type: string
 *                   description: this is the email of the user
 *                   example: alaekekaebuka200@gmail.com
 *                 password:
 *                   type: string
 *                   description: this is the password of the user
 *                   example: Successtoall20$
 *                 isVerified:
 *                   type: boolean 
 *                   description: this is the verification status of the user
 *                   example: true
 *                 isAdmin:
 *                   type: boolean 
 *                   description: this is the admin status of the user
 *                   example: true
 *       400:
 *        description: user with Email already exists
 *        content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                  type: string
 *                  description: this is the email of the user
 *                  example: alaekekaebuka200@gmail.com
 *       500:
 *         description: error registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: internal server error
 * 
 * 
 * 
 * 
 */


router.post('/registeradmin', registerAdmin)



/**
 * @swagger
 * /api/v1/admin-verify/{token}:
 *   get:
 *     tags:
 *       - Admin
   *     security: [] # No authentication required
 *     summary: Verify admin email
 *     description: Verify the admin's email using a token.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: The verification token sent to the admin's email.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin verified successfully
 *       400:
 *         description: Invalid or missing token
 *       500:
 *         description: Internal server error
 */


router.get('/admin-verify/:token', verifyAdminEmail)



/**
 * @swagger
 * /api/v1/loginAdmin:
 *   post:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
 *     summary: Admin login
 *     description: Authenticate an admin with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: alaekekaebuka200@gmail.com
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: Successtoall20$
 *     responses:
 *       200:
 *         description: user login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   description: this is the full name of the user
 *                   example: Alaekeka Ebuka
 *                 email:
 *                   type: string
 *                   description: this is the email of the user
 *                   example: alaekekaebuka200@gmail.com
 *                 isVerified:
 *                   type: boolean
 *                   description: this is the verification status of the user
 *                   example: true
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: failed to login user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: internal server error
 */
router.post('/loginAdmin', loginAdmin)


/**
 * @swagger
 * /api/v1/adminForgotPassword:
 *   post:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
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
 *                 description: The email of the user to reset password
 *                 example: alaekekaebuka200@gmail.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Forgot password failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: internal server error
 */

router.post('/adminForgotPassword', adminForgotPassword)


/**
 * @swagger
 * /api/v1/adminResetPassword:
 *   post:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
 *     summary: Reset admin password
 *     description: Reset the admin's password using a valid token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to reset password
 *                 example: alaekekaebuka200@gmail.com
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user's email
 *                 example: 6759
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: brown
 *               confirmPassword:
 *                  type: string
 *                  description: this is the confirm password of the user
 *                  example: brown
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: reset password failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: internal server error
 */



router.post('/adminResetPassword', adminResetPassword)

/**
 * @swagger
 * /api/v1/changeAdminPassword:
 *   post:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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
 *                 description: The current password of the user
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the user
 *                 example: Successtoall20$
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password
 *                 example: Successtoall20$
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error or incorrect old password
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post('/changeAdminPassword',adminAuthenticate, changeAdminPassword)



/**
 * @swagger
 * /api/v1/logoutAdmin:
 *   post:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Logout admin
 *     description: Logs out the currently authenticated admin by invalidating their session or token.
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin logged out successfully"
 *       401:
 *         description: Unauthorized, admin is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging out admin"
 */


router.post('/logoutAdmin',adminAuthenticate, logoutAdmin)



/**
 * @swagger
 * /api/v1/getAllTenants:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Get all tenants
 *     description: Retrieve a list of all tenants.
 *     responses:
 *       200:
 *         description: List of tenants retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllTenants',adminAuthenticate, getAllTenants)


/**
 * @swagger
 * /api/v1/getOneTenant/{tenantId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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

router.get('/getOneTenant/:tenantId',adminAuthenticate, getOneTenant)



/**
 * @swagger
 * /api/v1/getAllLandlords:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Get all landlords
 *     description: Retrieve a list of all landlords
 *     responses:
 *       200:
 *         description: List of landlords retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllLandlords',adminAuthenticate, getAllLandlords)


/**
 * @swagger
 * /api/v1/getOneLandlord/{landlordId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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


router.get('/getOneLandlord/:landlordId',adminAuthenticate, getOneLandlord)

/**
 * @swagger
 * /api/v1/getOneLandlordProfile/{landlordProfileId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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


router.get('/getOneLandlordProfile/:landlordProfileId',adminAuthenticate, getOneLandlordProfile)




/**
* @swagger
 * /api/v1/getAllLandlordProfiles:
 *   get:
 *     summary: "Get all landlords"
 *     description: "Fetch the list of all landlords along with their basic profile information."
 *     tags:
 *       - Landlord Profile
 *     security:
 *       - bearerAuth: []
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
router.get('/alllandlordProfiles', adminAuthenticate, alllandlordProfiles);




/**
 * @swagger
 * /api/v1/deleteLandlordProfile/{landlordProfileId}:
 *   delete:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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

router.delete('/deleteLandlordProfile/:landlordProfileId',adminAuthenticate, deleteLandlordProfile)








/**
 * @swagger
 * /api/v1/getoneadmin/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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

router.get('/getoneadmin/:id',adminAuthenticate, getAdmin); 



/**
 * @swagger
 * /api/v1/getAllAdmins:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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
 * /api/v1/deleteadmin/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
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

router.delete('/deleteadmin/:id',adminAuthenticate, deleteAdmin); 



/**
 * @swagger
 * /api/v1/verifyAlisting/{landlordId}/{listingId}:
 *   put:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Verify a listing by a admin
 *     description: This endpoint allows an admin to verify a listing.
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
 *             status:
 *               type: string
 *               description: The new status of the listing (e.g., "accepted", "rejected").
 *               example: "accepted"
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
router.put('/verifyAlisting/:listingId/:landlordId',adminAuthenticate, verifyAlisting);

/**
 * @swagger
 * /api/v1/unverifyAlisting/{landlordId}/{listingId}:
 *   put:
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     summary: Verify a unverify by a admin
 *     description: This endpoint allows an admin to unverify a listing.
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         description: The ID of the landlord unverify the listing
 *         required: true
 *         schema:
 *           type: integer
 *       - name: listingId
 *         in: path
 *         description: The ID of the listing to be unverify
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
 *             status:
 *               type: string
 *               description: The new status of the listing (e.g., "accepted", "rejected").
 *               example: "rejected"
 *     responses:
 *       200:
 *         description: Listing has been successfully unverify and updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing has been unverified."
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
 *         description: Listing has already been unverify or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing has already been unverify."
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
 *                   example: "Error unverifying a listing."
 */
router.put('/unverifyAlisting/:listingId/:landlordId', adminAuthenticate,unverifyAlisting)



module.exports = router;