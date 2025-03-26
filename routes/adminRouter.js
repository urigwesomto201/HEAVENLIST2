const router = require('express').Router();

const {registerAdmin, loginAdmin, adminForgotPassword, adminResetPassword,changeAdminPassword, logoutAdmin} = require('../controller/adminController')
const { adminAuthenticate } = require('../middlewares/authentication')


/**
 * @swagger
 * /api/v1/registeradmin:
 *   post:
 *     summary: Register a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the admin
 *               email:
 *                 type: string
 *                 description: Email of the admin
 *               password:
 *                 type: string
 *                 description: Password for the admin
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm password
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

router.post('/registeradmin', registerAdmin)

/**
 * @swagger
 * /api/v1/loginAdmin:
 *   post:
 *     summary: Login an admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email
 *               password:
 *                 type: string
 *                 description: Admin password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.post('/loginAdmin', loginAdmin)

/**
 * @swagger
 * /api/v1/adminForgotPassword:
 *   post:
 *     summary: Send a password reset email to the admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email
 *     responses:
 *       200:
 *         description: Reset password email sent
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.post('/adminForgotPassword', adminForgotPassword)

/**
 * @swagger
 * /api/v1/reset-adminpassword/{token}:
 *   post:
 *     summary: Reset admin password
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.post('/reset-adminpassword/:token', adminResetPassword)

/**
 * @swagger
 * /api/v1/changeAdminPassword:
 *   post:
 *     summary: Change admin password
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
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm new password
 *     responses:
 *       200:
 *         description: Password change successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/changeAdminPassword',adminAuthenticate, changeAdminPassword)

/**
 * @swagger
 * /api/v1/logoutAdmin:
 *   post:
 *     summary: Logout admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.post('/logoutAdmin',adminAuthenticate, logoutAdmin)


module.exports = router;