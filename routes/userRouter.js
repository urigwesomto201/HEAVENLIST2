const router = require('express').Router()


const { registerUser, loginUser, verifyUserEmail, getAdmin,getAllAdmins,updateAdmin,deleteAdmin,updateUserProfile,
    forgotPassword,makeAdmin, resetPassword, resendVerificationEmail, changePassword, logoutUser, getUserProfile} = require('../controller/userController')
const { userAuthenticate, adminAuthenticate } = require('../middlewares/authentication')
const jwt = require('jsonwebtoken');
const passport = require('passport')

/**
 * @swagger
 * /api/v1/registerUser:
 *   post:
 *     tags:
 *       - user
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
 *               username:
 *                 type: string
 *                 description: this is the username of the user
 *                 example: digitz
 *               password:
 *                 type: string
 *                 description: this is the password of the user
 *                 example: ebusr09
 *               confirmPassword:
 *                 type: string
 *                 description: this is the confirm password of the user
 *                 example: ebusr09
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
 *                 username:
 *                   type: string
 *                   description: this is the username of the user
 *                   example: digitz
 *                 password:
 *                   type: string
 *                   description: this is the password of the user
 *                   example: ebusr09
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
 *                   example: internal server error
 * 
 * 
 * 
 * 
 */


router.post('/registerUser', registerUser)







/**
 * @swagger
 * /api/v1/loginUser:
 *   post:
 *     tags:
 *       - user
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
 *                 example: ebusr09
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
 *                 username:
 *                   type: string
 *                   description: this is the username of the user
 *                   example: digitz
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


router.post('/loginUser', loginUser)


/**
 * @swagger
 * /api/v1/user-verify/{token}:
 *   get:
 *     tags:
 *       - user
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
 *                   example: internal server error
 */



router.get('/user-verify/:token', verifyUserEmail)




/**
 * @swagger
 * /api/v1/resendverificationemail:
 *   post:
 *     tags:
 *       - user
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
 *                   example: internal server error
 */


router.post('/resendverificationemail', resendVerificationEmail)



/**
 * @swagger
 * /api/v1/forget-password:
 *   post:
 *     tags:
 *       - user
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
 *                   example: internal server error
 */

router.post('/forget-password', forgotPassword)



/**
 * @swagger
 * /api/v1/reset-password/{token}:
 *   post:
 *     tags:
 *       - user
 *     summary: Reset user password
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         description: Password reset token sent to the user's email
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


router.post('/reset-password/:token', resetPassword)

/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     tags:
 *       - user
 *     summary: Change user password
 *     security:
 *       - bearerAuth: []
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
 *                 example: newpassword123
 *               confirmPassword:
 *                 type: string
 *                 description: The confirmation of the new password
 *                 example: newpassword123
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
router.post('/change-password',userAuthenticate, changePassword)

/**
 * @swagger
 * /api/v1/log-out:
 *   post:
 *     tags:
 *       - user
 *     summary: Log out user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/log-out', userAuthenticate, logoutUser)



// router.post('getUserProfile',userAuthenticate,  getUserProfile)

router.put('updateUserProfile',userAuthenticate,  updateUserProfile)





router.get('/google-autheticate', passport.authenticate('google',{scope: ['profile','email']}));


router.get('/auth/google/login', passport.authenticate('google'),async(req,res)=>{
    console.log('Req User: ',req.user)
    const token = await jwt.sign({userId: req.user.id, isVerified: req.user.isVerified}, process.env.SECRET,{expiresIn:'1day'});
    res.status(200).json({
        message: 'Google Auth Login Successful',
        data:req.user,
        token
    })
});


// // Facebook Login Route
// router.get("/auth-facebook", passport.authenticate("facebook", { scope: ["email"] }));

// // Facebook Callback Route
// router.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("/dashboard");
//   }
// );




module.exports = router


