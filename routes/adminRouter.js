const router = require('express').Router();

const {registerAdmin, loginAdmin, adminForgotPassword, adminResetPassword,changeAdminPassword, logoutAdmin,
    getAdmin, getAllAdmins, deleteAdmin, getAllTenants, verifyAdminEmail,
    getAllLandlords, verifyAlisting, unverifyAlisting,
    getOneTenant, getOneLandlord, getOneLandlordProfile,deleteLandlordProfile,verifyAdminOtp, alllandlordProfiles

} = require('../controller/adminController')
const { adminAuthenticate, eitherAuthenticate } = require('../middlewares/authentication')





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
 *                   example: failed to register admin
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
 *         description: error verifying admin email
 */


router.get('/admin-verify/:token', verifyAdminEmail)



/**
 * @swagger
 * /api/v1/loginAdmin:
 *   post:
 *     tags:
 *       - Admin
  *     security: [] # No authentication required
 *     summary: Login admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the admin
 *                 example: alaekekaebuka200@gmail.com
 *               password:
 *                 type: string
 *                 description: The password of the admin
 *                 example: Successtoall20$
 *     responses:
 *       200:
 *         description: admin login successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                   description: this is the full name of the admin
 *                   example: Alaekeka Ebuka
 *                 email:
 *                   type: string
 *                   description: this is the email of the admin
 *                   example: alaekekaebuka200@gmail.com
 *                 isVerified:
 *                   type: boolean
 *                   description: this is the verification status of the admin
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
 *                   example: failed to login admin
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
 *                   example: error sending password reset email
 */

router.post('/adminForgotPassword', adminForgotPassword)


/**
 * @swagger
 * /api/v1/verify-adminOtp:
 *   post:
 *     summary: Verify admin OTP
 *     description: Verifies the OTP (One Time Password) sent to an admin by checking it against all registered admins.
  *     tags:
 *       - Admin
  *     security: [] # No authentication required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "456789"
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *                 adminId:
 *                   type: string
 *                   example: "21e8029c-c493-4e9d-9f64-4b2d8d12fa12"
 *                 adminEmail:
 *                   type: string
 *                   example: "admin@example.com"
 *       400:
 *         description: OTP is missing from the request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP is required"
 *       404:
 *         description: OTP does not match any admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired OTP"
 *       500:
 *         description: Internal server error during OTP verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while verifying OTP"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/verify-adminOtp', verifyAdminOtp)
/**
 * @swagger
 * /api/v1/reset-adminpassword/{adminId}:
 *   post:
 *     summary: Reset admin password
 *     description: Resets the password for an admin given the admin's ID. Requires the admin ID in the URL parameters and the new password details in the request body.
  *     tags:
 *       - Admin
 *     security: [] # No authentication required
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin whose password will be reset
 *         example: "b85a4b8c-67b3-4d7c-ae5f-67e2b8656e1d"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the admin
 *                 example: "newAdminPassword123"
 *               confirmPassword:
 *                 type: string
 *                 description: The password confirmation to ensure the correct password is entered
 *                 example: "newAdminPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successful"
 *       400:
 *         description: Invalid input (e.g., missing required fields, passwords don't match)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Passwords do not match"
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin not found"
 *       500:
 *         description: Internal server error during password reset process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while resetting password"
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.post('/reset-adminpassword/:adminId', adminResetPassword);



/**
 * @swagger
 * /api/v1/changeAdminPassword:
 *   post:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error changing password
 */
router.post('/changeAdminPassword',adminAuthenticate, changeAdminPassword)



/**
 * @swagger
 * /api/v1/logoutAdmin:
 *   post:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *       - AdminBearerAuth: [] # Requires admin authentication
 *     summary: Get all tenants
 *     description: Retrieve a list of all tenants.
 *     responses:
 *       200:
 *         description: List of tenants retrieved successfully
 *       500:
 *         description: error retrieving tenants
 */

router.get('/getAllTenants',adminAuthenticate, getAllTenants)


/**
 * @swagger
 * /api/v1/getOneTenant/{tenantId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error retrieving tenant details
 */

router.get('/getOneTenant/:tenantId',adminAuthenticate, getOneTenant)



/**
 * @swagger
 * /api/v1/getAllLandlords:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
 *     summary: Get all landlords
 *     description: Retrieve a list of all landlords
 *     responses:
 *       200:
 *         description: List of landlords retrieved successfully
 *       500:
 *         description: error retrieving landlords
 */

router.get('/getAllLandlords',adminAuthenticate, getAllLandlords)


/**
 * @swagger
 * /api/v1/getOneLandlord/{landlordId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error retrieving landlord details
 */


router.get('/getOneLandlord/:landlordId',adminAuthenticate, getOneLandlord)

/**
 * @swagger
 * /api/v1/getOneLandlordProfile/{landlordProfileId}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error retrieving landlord profile details
 */


router.get('/getOneLandlordProfile/:landlordProfileId',adminAuthenticate, getOneLandlordProfile)




/**
* @swagger
 * /api/v1/getAllLandlordProfiles:
 *   get:
 *     summary: "Get all landlords"
 *     description: "Fetch the list of all landlords along with their basic profile information."
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: "error retrieving landlords profiles"
*/
router.get('/alllandlordProfiles', adminAuthenticate, alllandlordProfiles);




/**
 * @swagger
 * /api/v1/deleteLandlordProfile/{landlordProfileId}:
 *   delete:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error deleting landlord profile
 */

router.delete('/deleteLandlordProfile/:landlordProfileId',adminAuthenticate, deleteLandlordProfile)








/**
 * @swagger
 * /api/v1/getoneadmin/{id}:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *         description: error retrieving admin details
 */

router.get('/getoneadmin/:id',adminAuthenticate, getAdmin); 



/**
 * @swagger
 * /api/v1/getAllAdmins:
 *   get:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
 *     summary: Get all admins
 *     description: Retrieve a list of all admins
 *     responses:
 *       200:
 *         description: List of admins retrieved successfully
 *       500:
 *         description: error retrieving admins
 */

router.get('/getAllAdmins',adminAuthenticate, getAllAdmins); 


/**
 * @swagger
 * /api/v1/deleteadmin/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
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
 *               example: error deleting admin
 */

router.delete('/deleteadmin/:id',adminAuthenticate, deleteAdmin); 



/**
 * @swagger
 * /api/v1/verifyAlisting/{listingId}/{landlordId}:
 *   put:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
 *     summary: Verify a listing
 *     description: This endpoint allows an admin to verify a listing by updating its status to "accepted".
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         description: The ID of the landlord who owns the listing
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *       - name: listingId
 *         in: path
 *         description: The ID of the listing to be verified
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["accepted", "rejected"]
 *         description: The status of the listing to be updated as verified.
 *         example: "accepted"
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
 *                   description: Details of the verified listing
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
router.put('/verifyAlisting/:listingId/:landlordId', adminAuthenticate, verifyAlisting);



/**
 * @swagger
 * /api/v1/unverifyAlisting/{listingId}/{landlordId}:
 *   put:
 *     tags:
 *       - Admin
 *     security:
 *       - AdminBearerAuth: [] # Requires admin authentication
 *     summary: Unverify a listing
 *     description: This endpoint allows an admin to unverify a listing by updating its status to "rejected".
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         description: The ID of the landlord who owns the listing
 *         required: true
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *       - name: listingId
 *         in: path
 *         description: The ID of the listing to be unverified
 *         required: true
 *         schema:
 *           type: string
 *           example: "12345"
 *       - in: query
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: ["rejected"]
 *         description: to unverify a listing
 *         example: "rejected"
 *     responses:
 *       200:
 *         description: Listing has been successfully unverified and updated.
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
 *                   description: Details of the unverified listing
 *       400:
 *         description: Listing has already been unverified or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing has already been unverified."
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
router.put('/unverifyAlisting/:listingId/:landlordId', adminAuthenticate, unverifyAlisting);


module.exports = router;