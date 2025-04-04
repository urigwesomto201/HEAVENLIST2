const router = require('express').Router();

const {registerAdmin, loginAdmin, adminForgotPassword, adminResetPassword,changeAdminPassword, logoutAdmin,
     getAdmin, getAllAdmins, updateAdmin, deleteAdmin, getAllUser,
    getAllLandlords, verfiyAlisting, unverifyAlisting
} = require('../controller/adminController')
const { adminAuthenticate } = require('../middlewares/authentication')



// router.post('/registeradmin', registerAdmin)


// router.post('/loginAdmin', loginAdmin)


// router.post('/adminForgotPassword', adminForgotPassword)



// router.post('/reset-adminpassword/:token', adminResetPassword)



// router.post('/changeAdminPassword',adminAuthenticate, changeAdminPassword)



/**
 * @swagger
 * /admin/getAllUser:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       500:
 *         description: Internal server error
 */

router.get('/getAllUser', getAllUser)

/**
 * @swagger
 * /admin/getAllLandlords:
 *   get:
 *     tags:
 *       - Admin
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
 * /admin/makeAdmin/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Make a user an admin
 *     description: Grant admin privileges to a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to make an admin
 *         type: string
 *     responses:
 *       200:
 *         description: User successfully made an admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */


// router.put('/makeAdmin/:id', adminAuthenticate,makeAdmin);
/**
 * @swagger
 * /admin/getadmin/{id}:
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
 * /admin/getAllAdmins:
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
 * /admin/{id}:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update admin details
 *     description: Update the details of a specific admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to update
 *         type: string
 *       - in: body
 *         name: body
 *         description: Admin details to update
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             fullName:
 *               type: string
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: Admin details updated successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete an admin
 *     description: Delete a specific admin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the admin to delete
 *         type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.put('/admin/:id',adminAuthenticate, updateAdmin); 

/**
 * @swagger
 * /admin/{id}:
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



router.put('/verfiyAlisting/:landlordId/:listingId', verfiyAlisting)

router.put('/unverifyAlisting/:landlordId/:listingId', unverifyAlisting)



module.exports = router;