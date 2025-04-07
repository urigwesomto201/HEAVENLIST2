const adminModel = require('../models/admin')
const tenantModel = require('../models/tenant')
const listingModel = require('../models/listing')
const landlordModel = require('../models/landlord')
const LandlordProfile = require('../models/landlordprofile')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { totp } = require('otplib');
const { signUpTemplate ,forgotTemplate, adminTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')
totp.options = { digits: 4, step: 300}


exports.registerAdmin = async (req, res) => {
    try {
        
        const validated = await validate(req.body, registerSchema);
        const { fullName, email, password, confirmPassword } = validated;

        if(!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({message:'please input correct fields'})
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingAdmin = await adminModel.findOne({ where: { email: email.toLowerCase() } });

        if (existingAdmin) {
            if (existingAdmin.isAdmin) {
                return res.status(400).json({ message: 'User is already an Admin' });
            }

            // If the admin exists but is not marked as admin, update it
            await adminModel.update({ isAdmin: true }, { where: { id: existingAdmin.id } });

            return res.status(200).json({ message: 'User has been updated to Admin', data: existingAdmin });
        }

       

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newAdmin = await adminModel.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            isVerified: true,
            isAdmin: true,
        });

    

        const token = await jwt.sign({ adminId: newAdmin.id}, process.env.JWT_SECRET, { expiresIn: '1day'})
        
        const link = `${req.protocol}://${req.get('host')}/api/v1/admin-verify/${token}`

        const firstName = newAdmin.fullName.split(' ')[0];

        const mailDetails = {
            subject: 'Welcome Admin',
            email: newAdmin.email,
            html: adminTemplate(firstName, link),
        };

        await sendEmail(mailDetails);


        return res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};






exports.verifyAdminEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const admin = await adminModel.findOne({ where: { id: decodedToken.adminId }})

        if(!admin) {
            return res.status(404).json({message: 'admin not found'})
        }

        if(admin.isVerified) {
            return res.status(400).json({message: 'Admin is verified'})
        }

        admin.isVerified = true

        await admin.save()

        res.status(200).json({message: 'admin verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
        res.status(500).json({message: 'error verifying admin:' , error:error.message})
    }
}








exports.loginAdmin = async (req, res) => {
    try {
        
        const validated = await validate(req.body, loginSchema);
        const { email, password } = validated;

       
        if (!email) {
            return res.status(400).json({ message: 'Please enter email' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Please enter your password' });
        }

    
        const admin = await adminModel.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

       
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        admin.isLoggedIn = true;

        await admin.save();
        
        const token = jwt.sign({ adminId: admin.id, isLoggedIn: admin.isLoggedIn },process.env.JWT_SECRET,{ expiresIn: '1d' });
        

        res.status(200).json({ message: 'Login successful', data: admin, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in admin', error: error.message });
    }
};



exports.adminForgotPassword = async (req, res) => {
    try {
        
        const validated = await validate(req.body , forgotPasswordSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const admin = await adminModel.findOne({ where: { email: email.toLowerCase() } })

        if(!admin) {
            return res.status(404).json({message: 'admin not found'})
        }

        const secret = `${process.env.OTP_SECRET}${email.toLowerCase()}`;
        const otp = totp.generate(secret);

        
        const firstName = admin.fullName.split(' ')[0]

        const html = forgotTemplate(firstName, otp)

        const mailOptions = {
            subject: 'admin reset password',
            email: admin.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'otp has been sent, please check mail box'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error initializing forget password:' , error:error.message})
    }
}



exports.adminResetPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , resetPasswordschema)

   
        const { email,otp, password, confirmPassword } = validated;


        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const secret = `${process.env.OTP_SECRET}${email.toLowerCase()}`;
        const isValidOTP = totp.check(otp, secret);
  
        if (!isValidOTP) {
           return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
  

        const admin = await adminModel.findOne({ where: { email: email.toLowerCase() } });

        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        admin.password = hashedPassword;

        await admin.save();

        res.status(200).json({ message: 'Password reset successful' });

        
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({message: 'Session expired. Please enter your email to resend link'})
        }  
        
       res.status(500).json({message: 'Error resetting password', error: error.message});
    }
}




exports.changeAdminPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , changePassword )

        const {oldPassword, newPassword, confirmPassword} = validated

        const {id} = req.admin;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. admin not authenticated' });
        }
        

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const admin = await adminModel.findOne( { where: { id } });

        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, admin.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        admin.password = hashedPassword;

        admin.isLoggedIn = true

        await admin.save();

        res.status(200).json({ message: 'Password change successful' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error initiating change password', error: error.message }); 
    }
};



exports.logoutAdmin = async (req, res) => {
    try {
        const { id } = req.admin;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. admin not authenticated' });
        }

        const admin = await adminModel.findOne({ where: { id } });

        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        if (!admin.isLoggedIn) {
            return res.status(400).json({ message: 'Admin is already logged out' });
        }


        admin.isLoggedIn = false;

        await admin.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging out admin', error: error.message });
    }
};




exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await tenantModel.findAll({where: {} })

        if(tenants.length === 0) {
            return res.status(404).json({message: 'no tenants found'})
        }

        res.status(200).json({message: 'find all tenants below', total: tenants.length, data: tenants})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error getting all users' , error:error.message })
    }
}



exports.getOneTenant = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = await tenantModel.findOne({ where: { id: tenantId }});

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json({ message: 'find tenant by id below', data: tenant });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching tenant: ' , error:error.message });
    }
}



exports.getAllLandlords = async (req, res) => {
    try {
        const landlord = await landlordModel.findAll({where: {
        }, include: [
            {
                model: listingModel,
                attributes: ['area', 'description', 'type', 'isVerified', 'isAvailable'], 
                as: 'listings', 
            },
        ],
        });

        res.status(200).json({message: 'find all landlord below', total: landlord.length, data: landlord})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error getting all landlords' , error:error.message })
    }
}



exports.getOneLandlord = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const landlord = await landlordModel.findOne({ where: { id: landlordId 
             },
            include: [
                {
                    model: listingModel,
                    attributes: ['area', 'description', 'type', 'isVerified', 'isAvailable'], 
                    as: 'listings', 
                },
            ], 
        });

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

        res.status(200).json({ message: 'find landlord by id below', data: landlord });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching landlord: ' , error:error.message });
    }
}




exports.getOneLandlordProfile = async (req, res) => {
    try {
        const { landlordProfileId } = req.params;
        const landlordProfile = await LandlordProfile.findOne({ where: { id: landlordProfileId
            },
            include: [
                {
                    model: listingModel,
                    attributes: ['area', 'description', 'type', 'isVerified', 'isAvailable'], 
                    as: 'listings', 
                },
            ], 
         });

        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        res.status(200).json({ message: 'find landlord profile by id below', data: landlordProfile });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching landlord profile: ' , error:error.message });
    }
}



exports.getAllLandlordProfile = async (req, res) => {
    try {
        const landlordProfile = await LandlordProfile.findAll( { where: {
            id: listingId },
            include: [
                {
                    model: listingModel,
                    attributes: ['area', 'description', 'type', 'isVerified', 'isAvailable'], 
                    as: 'listings', 
                },
            ],
    })

        res.status(200).json({message: 'find all landlord profile below', total: landlordProfile.length, data: landlordProfile})
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error getting all landlords' , error:error.message })
    }
}




exports.deleteLandlordProfile = async (req, res) => {
    try {
        const { landlordProfileId } = req.params;
        const landlordProfile = await LandlordProfile.findOne({ where: { id: landlordProfileId,
            id: listingId, isAvailable:true, isVerified:true },
                include: [
                    {
                        model: listingModel,
                        attributes: ['area', 'description', 'category', 'type', 'isVerified', 'isAvailable'], 
                        as: 'listing', 
                    },
                ],
          });

        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        await LandlordProfile.destroy({ where: { id: landlordProfileId, id: listingId } });

        res.status(200).json({ message: 'Landlord profile deleted successfully' });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error deleting landlord profile: ' , error:error.message });
    }
}





// exports.makeAdmin = async (req, res) => {

//     try {
//         const { id } = req.params;


//         const user = await userModel.findByPk(id);
//         if (!user) {
//             return res.status(404).json({
//                 message: 'user not found'
//             })
//         }


//         if (user.isAdmin == true) {
//             return res.status(400).json({
//                 message: 'user already an Admin'
//             })
//         }
//         await userModel.update({ isAdmin: true }, { where: { id: id } });


//         const updatedTenant = await userModel.findByPk(id);

//         res.status(200).json({
//             message: 'user is now an Admin',
//             data: updatedTenant
//         })

//     } catch (error) {
//         console.error(error.message)
//         res.status(500).json({ message: 'Error making User an Admin: ' , error:error.message })
//     }
// }





// Get a single admin by ID
exports.getAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const admin = await adminModel.findOne({ where: { adminId, isAdmin: true },
            include: [
                {
                    model: adminModel,
                    attributes: ['adminId', 'fullName', 'email'],
                }

            ]});

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({ message: 'find admin by id below', data: admin });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching admin: ' , error:error.message });
    }
};



// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.findAll({ where: { isAdmin: true } });

        if (admins.length === 0) {
            return res.status(404).json({ message: 'No admins found' });
        }

        res.status(200).json({ message: 'find all admins below', total: admins.length, data: admins });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching admins: ' , error:error.message });
    }
};


// Update an admin
exports.updateAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { name, email } = req.body;

        const admin = await adminModel.findOne({ where: { adminId, isAdmin: true } });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await adminModel.update({ name, email }, { where: { adminId } });

        res.status(200).json({ message: 'Admin updated successfully' });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error updating admin: ' , error:error.message });
    }
};


// Delete an admin
exports.deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        const admin = await adminModel.findOne({ where: { adminId, isAdmin: true } });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        await adminModel.destroy({ where: { adminId } });

        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error deleting admin: ' , error:error.message });
    }
};





exports.verfiyAlisting = async (req, res) => {
    try {
        const {listingId, landlordId} = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listing id is required'})
        }

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }
 
        const listing = await listingModel.findOne({
            where: { id: listingId, landlordId}, 
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found or does not belong to the specified landlord' });
        }

        if(listing.isVerified === true){
            return res.status(400).json({message:'listing has already been verified'})
        }

        listing.isVerified = true
        listing.isAvailable = true

        await listing.save()

        res.status(200).json({message:'listing has been verified',data: listing})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error verifying a listing', error: error.message })
    }
}




exports.unverifyAlisting = async (req, res) => {
    try {
        const {listingId, landlordId} = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listing id is required'})
        }

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }
 
        const listing = await listingModel.findOne({
            where: { id: listingId, landlordId}, 
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found or does not belong to the specified landlord' });
        }

        if(listing.isVerified === false){
            return res.status(400).json({message:'listing has already been unverified'})
        }

        listing.isVerified = false
        listing.isAvailable = false

        await listing.save()

        res.status(200).json({message:'listing has been unverified',data: listing})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error unverifying listings', error: error.message })
    }
}
