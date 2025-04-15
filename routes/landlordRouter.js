const router = require('express').Router();

const { registerlandlord, loginlandlord, verifylandlordEmail, landlordForgotPassword, landlordResetPassword, resendlandlordVerificationEmail, changelandlordPassword, logoutlandlord,
    getLandlordTransactions
} = require('../controller/landlordController')
const { landlordAuthenticate } = require('../middlewares/authentication')
const jwt = require('jsonwebtoken');
const passport = require('passport')



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
 * /api/v1/registerlandlord:
 *   post:
 *     tags:
 *       - landlord
  *     security: [] # No authentication required
 *     summary: this is the register or signup route
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
 *                   example: error registering landlord
 * 
 * 
 */


router.post('/registerlandlord', registerlandlord)


/**
 * @swagger
 * /api/v1/loginlandlord:
 *   post:
 *     tags:
 *       - landlord
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
 *                   example: error logging in landlord
 */


router.post('/loginlandlord', loginlandlord)


/**
 * @swagger
 * /api/v1/emailStatus/{token}:
 *   get:
 *     tags:
 *       - landlord
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
 *                   example: error verifying landlord
 */


router.get('/emailStatus/:token', verifylandlordEmail)




/**
 * @swagger
 * /api/v1/resendlandlord-verify:
 *   post:
 *     tags:
 *       - landlord
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


router.post('/resendlandlord-verify', resendlandlordVerificationEmail)



/**
 * @swagger
 * /api/v1/landlordForgotPassword:
 *   post:
 *     tags:
 *       - landlord
  *     security: [] # No authentication required
 *     summary: Send password reset email
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

router.post('/landlordForgotPassword', landlordForgotPassword)



/**
 * @swagger
 * /api/v1/reset-landlordpassword/{otp}:
 *   post:
 *     tags:
 *       - landlord
  *     security: [] # No authentication required
 *     summary: Reset user password
 *     parameters:
 *       - name: otp
 *         in: path
 *         required: true
 *         description: Password reset otp sent to the user's email
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: Successtoall20$
 *               confirmPassword:
 *                  type: string
 *                  description: this is the confirm password of the user
 *                  example: Successtoall20$
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
 *                   example: error resetting password
 */


router.post('/reset-landlordpassword/:otp', landlordResetPassword)


/**
 * @swagger
 * /api/v1/changelandlordPassword:
 *   post:
 *     tags:
 *       - landlord
 *     security:
 *       - landlordBearerAuth: [] # landlord token is required for authentication
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
router.post('/changelandlordPassword',landlordAuthenticate, changelandlordPassword)

/**
 * @swagger
 * /api/v1/logoutlandlord:
 *   post:
 *     tags:
 *       - landlord
 *     summary: Log out user
 *     security:
 *       - landlordBearerAuth: [] # landlord token is required for authentication
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: error logging out landlord
 */
router.post('/logoutlandlord', landlordAuthenticate, logoutlandlord)




/**
 * @swagger
 * /api/v1/landlordtransactions/{landlordId}:
 *   get:
 *     tags:
 *       - landlord
 *     summary: Get landlord transactions
 *     description: This endpoint retrieves all transactions for a specific landlord.
 *     security:
 *       - landlordBearerAuth: [] # landlord token is required for authentication
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

router.get('/landlordtransactions/:landlordId', getLandlordTransactions);










router.get('/google-autheticate', passport.authenticate('google',{scope: ['profile','email']}));


router.get('/auth/google/login', passport.authenticate('google'),async(req,res)=>{
    console.log('Req User: ',req.user)
    const token = await jwt.sign({userId: req.user._id, isVerified: req.user.isVerified}, process.env.JWT_SECRET,{expiresIn:'1day'});
    res.status(200).json({
        message: 'Google Auth Login Successful',
        data:req.user,
        token
    })
});


// Facebook Login Route
router.get("/auth-facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Facebook Callback Route
router.get("/auth/facebook/login",
    passport.authenticate("facebook", {
      failureRedirect: "/login",  // Or wherever you want to redirect on failure
    }),
    async(req, res) => {
        const token = await jwt.sign({userId: req.user._id, isVerified: req.user.isVerified}, process.env.JWT_SECRET,{expiresIn:'1day'});
        res.status(200).json({
            message: 'Facebook Auth Login Successful',
            data:req.user,
            token
        })
    
    }
  );



module.exports = router