const tenantModel = require('../models/tenant')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { totp } = require('otplib');
const { signUpTemplate ,forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')
totp.options = { digits: 4, step: 300}



exports.registerTenant = async (req, res) => {
    try {
        const validated = await validate(req.body , registerSchema)
        
        const {fullName, email, password, confirmPassword} = validated

        if(!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({message:'please input correct fields'})
        }

        if(password !== confirmPassword) {
            return res.status(400).json({message: 'passwords do not match'})
        }

        const tenant = await tenantModel.findOne({ where: { email: email.toLowerCase() } })

        if(tenant) {
            return res.status(400).json({message: `user with email: ${email} already exists please use another email`})
        }


        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newTenant = await tenantModel.create({
            fullName,
            email,
            password: hashedPassword,
            
             
        })

        const token = await jwt.sign({ tenantId: newTenant.id}, process.env.JWT_SECRET, { expiresIn: '2day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/tenant-verify/${token}`

        const firstName = newTenant.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newTenant.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        res.status(201).json({message: 'tenant registered successfully', data: newTenant })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering tenant' , error: error.message})
    
    }
}


exports.verifyTenantEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const tenant = await tenantModel.findOne({ where: { id: decodedToken.tenantId }})

        if(!tenant) {
            return res.status(404).json({message: 'tenant not found'})
        }

        if(tenant.isVerified === true) {
            return res.status(400).json({message: 'tenant has already been verified'})
        }

        tenant.isVerified = true

        await tenant.save()

        res.status(200).json({message: 'tenant verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
        res.status(500).json({message: 'error verifying tenant:' , error:error.message})
    }
}



exports.resendTenantVerificationEmail = async (req, res) => {
    try {
        
        const validated = await validate(req.body , verificationEmailSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const tenant = await tenantModel.findOne({ where: { email: email.toLowerCase() } })

        if(!tenant) {
            return res.status(404).json({message: 'tenant not found'})
        }

        const token = await jwt.sign({ tenantId: tenant.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/tenant-verify/${token}`

        const firstName = tenant.fullName.split(' ')[0]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: tenant.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'verification email sent, please check mail box'})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error resending verification email', error: error.message})
    }
}


exports.loginTenant = async (req, res) => {
    try {
        const validated = await validate(req.body, loginSchema);

        const { email, password } = validated;

        if (!email) {
            return res.status(400).json({ message: 'Please enter email' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Please enter your password' });
        }

        
        const tenant = await tenantModel.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, tenant.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        if (!tenant.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please check your email for the verification link' });
        }

        
        const token = jwt.sign({ tenantId: tenant.id, isLoggedIn: true }, process.env.JWT_SECRET,{ expiresIn: '2d' });
        
        tenant.isLoggedIn = true;
        await tenant.save();

        res.status(200).json({ message: 'Login successful', data: tenant, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in tenant', error: error.message });
    }
};



exports.TenantForgotPassword = async (req, res) => {
    try {
        
        const validated = await validate(req.body , forgotPasswordSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const tenant = await tenantModel.findOne({ where: { email: email.toLowerCase() } })

        if(!tenant) {
            return res.status(404).json({message: 'tenant not found'})
        }

        const secret = process.env.OTP_SECRET + email; 
        const otp = totp.generate(secret);

    

        const firstName = tenant.fullName.split(' ')[0]

        const html = forgotTemplate(otp, firstName)

        const mailOptions = {
            subject: 'reset password',
            email: tenant.email,
            html 
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'otp has been sent, please check mail box'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error initializing forget password:' , error:error.message})
    }
}




exports.TenantResetPassword = async (req, res) => {
    try {

        const validated = await validate(req.body, resetPasswordschema);

        const { email, otp, password, confirmPassword } = validated;

    

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const secret = `${process.env.OTP_SECRET}${email.toLowerCase()}`;
        const isValidOTP = totp.check(otp, secret);
  
        if (!isValidOTP) {
           return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
  

        const tenant = await tenantModel.findOne({ where: { email: email.toLowerCase() } });

        if (!tenant) {
            return res.status(404).json({ message: 'tenant not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        tenant.password = hashedPassword;

        await tenant.save();

        res.status(200).json({ message: 'Password reset successful' });

        
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({message: 'Session expired. Please enter your email to resend link'})
        }  
        
       res.status(500).json({message: 'Error resetting password', error: error.message});
    }
}




exports.changeTenantPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , changePassword )

        const {oldPassword, newPassword, confirmPassword} = validated

        const {id} = req.tenant;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. tenant not authenticated' });
        }
        

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const tenant = await tenantModel.findOne( { where: { id } });

        if (!tenant) {
            return res.status(404).json({ message: 'tenant not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, tenant.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        tenant.password = hashedPassword;

        await tenant.save();

        res.status(200).json({ message: 'Password change successful' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error initiating change password', error: error.message }); 
    }
};



exports.logoutTenant = async (req, res) => {
    try {
        const { id } = req.tenant;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. tenant not authenticated' });
        }

        const tenant = await tenantModel.findOne({ where: { id } });

        if (!tenant) {
            return res.status(404).json({ message: 'tenant not found' });
        }

        tenant.isLoggedIn = false;

        await tenant.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging out tenant', error: error.message });
    }
};


