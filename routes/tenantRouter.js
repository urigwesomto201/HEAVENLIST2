const router = require('express').Router();

const { registerTenant, loginTenant, verifyTenantEmail, TenantForgotPassword, getTenantProfile,
    TenantResetPassword, resendTenantVerificationEmail, changeTenantPassword, logoutTenant} = require('../controller/tenantController')
const { tenantAuthenticate } = require('../middlewares/authentication')



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     tenantBearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */





/**
 * @swagger
 * /api/v1/registerTenant:  
 *   post:
 *     tags:
 *       - tenant
  *     security: [] # No authentication required
 *     summary: this is the register or signup route of the tenant
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
 *                   example: false
 *                 isloggedIn:
 *                   type: boolean 
 *                   description: this is the login status of the user
 *                   example: false
 *                 isAdmin:
 *                   type: boolean 
 *                   description: this is the admin status of the user
 *                   example: false
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
 *         description: error registering tenant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: error registering tenant
 * 
 * 
 * 
 * 
 */


router.post('/registerTenant', registerTenant)


/**
 * @swagger
 * /api/v1/loginTenant:
 *   post:
 *     tags:
 *       - tenant
  *     security: [] # No authentication required
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                   example: failed to login user
 */


router.post('/loginTenant', loginTenant)


/**
 * @swagger
 * /api/v1/tenant-verify/{token}:
 *   get:
 *     tags:
 *       - tenant
  *     security: [] # No authentication required
 *     summary: Verify user email
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Verification token sent to the user's email
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 *       500:
 *         description: error verifying user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: error verifying user
 */



router.get('/tenant-verify/:token', verifyTenantEmail)




/**
 * @swagger
 * /api/v1/tenant-verify:
 *   post:
 *     tags:
 *       - tenant
  *     security: [] # No authentication required
 *     summary: Resend verification email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user to resend verification
 *                 example: alaekekaebuka200@gmail.com
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       400:
 *         description: User not found or already verified
 *       500:
 *         description: error resending verification mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: error resending verification mail
 */


router.post('/tenant-verify', resendTenantVerificationEmail)



/**
 * @swagger
 * /api/v1/TenantForgotPassword:
 *   post:
 *     tags:
 *       - tenant
  *     security: [] # No authentication required
 *     summary: Send password forgot email
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
 *                   example: Forgot password failed
 */

router.post('/TenantForgotPassword', TenantForgotPassword)



/**
 * @swagger
 * /api/v1/TenantResetPassword:
 *   post:
 *     tags:
 *       - tenant
 *     security: [] # No authentication required
 *     summary: Reset user password
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
 *                 example: Successtoall20$
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password
 *                 example: Successtoall20$
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP
 *       500:
 *         description: Reset password failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Reset password failed
 */
router.post('/TenantResetPassword', TenantResetPassword)




/**
 * @swagger
 * /api/v1/changeTenantPassword:
 *   post:
 *     tags:
 *       - tenant
 *     security:
 *       - tenantBearerAuth: [] # Tenant token is required for authentication
 *     summary: Change user password
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
 *                 example: Successtoall20$
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
 *         description: Error changing password
 */
router.post('/changeTenantPassword',tenantAuthenticate, changeTenantPassword)

/**
 * @swagger
 * /api/v1/logoutTenant:
 *   post:
 *     tags:
 *       - tenant
 *     summary: Log out user
 *     security:
 *       - tenantBearerAuth: [] # Tenant token is required for authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: error logging out user
 */
router.post('/logoutTenant', tenantAuthenticate, logoutTenant)








module.exports = router;