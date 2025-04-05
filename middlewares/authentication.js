
const tenantModel = require('../models/tenant')
const landlordModel = require('../models/landlord')
const adminModel = require('../models/admin')
const jwt = require('jsonwebtoken')



// exports.userAuthenticate = async (req, res, next) => {
//     try {
//         const auth = req.headers.authorization;
//         if (!auth) {
//             return res.status(400).json({
//                 message: 'token not found'
//             })
//         }
//         const token = auth.split(' ')[1]
//         if (!token) {
//             return res.status(404).json({
//                 message: 'Invalid Token'
//             })
//         }
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

//         const user = await userModel.findByPk(decodedToken.userId)
        
//         if (!user) {
//             return res.status(400).json({
//                 message: 'Authentication failed : user not found'
//             })
//         }

//         if(user.isLoggedIn !== decodedToken.isLoggedIn) {
//             return res.status(401).json({
//               message: "User is not logged in" })
//         }


//         req.user = user

//         next()

//     } catch (error) {
//         console.log(error.message);
//         if (error instanceof jwt.JsonWebTokenError) {
//             return res.status(400).json({
//                 message: 'Session timeout : Please Login To Continue'
//             })
//         }
//         res.status(500).json({
//             message: 'internal server error'
//         })
//     }
// }



exports.tenantAuthenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const tenant = await tenantModel.findByPk(decodedToken.tenantId)
        
        if (!tenant) {
            return res.status(400).json({
                message: 'Authentication failed : tenant not found'
            })
        }

        if(tenant.isLoggedIn !== decodedToken.isLoggedIn) {
            return res.status(401).json({
            message: "tenant is not logged in" })
        }


        req.tenant = tenant

        next()

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout : Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
}



exports.landlordAuthenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const landlord = await landlordModel.findByPk(decodedToken.landlordId)
        
        if (!landlord) {
            return res.status(400).json({
                message: 'Authentication failed : landlord not found'
            })
        }

        if(landlord.isLoggedIn !== decodedToken.isLoggedIn) {
            return res.status(401).json({
            message: "landlord is not logged in" })
        }


        req.landlord = landlord

        next()

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout : Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
}



exports.adminAuthenticate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            return res.status(400).json({
                message: 'token not found'
            })
        }
        const token = auth.split(' ')[1]
        if (!token) {
            return res.status(404).json({
                message: 'Invalid Token'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const admin = await adminModel.findByPk(decodedToken.adminId)
        
        if (!admin) {
            return res.status(404).json({
                message: 'Authentication failed : admin not found'
            })
        }

        if(admin.isAdmin === false) {
            return res.status(403).json({message: 'unauthorized: you are not allowed to perform this action'})
        }

        if(admin.isLoggedIn !== decodedToken.isLoggedIn) {
            return res.status(401).json({
            message: "User is not logged in" })
        }


        req.admin = admin

        next()

    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(400).json({
                message: 'Session timeout : Please Login To Continue'
            })
        }
        res.status(500).json({
            message: 'internal server error'
        })
    }
}







  




