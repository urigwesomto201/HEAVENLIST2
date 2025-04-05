const landlordModel = require('../models/landlord')
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




exports.registerlandlord = async (req, res) => {
    try {
        const validated = await validate(req.body , registerSchema)
        
        const {fullName, email, password, confirmPassword} = validated

        if(!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({message:'please input correct fields'})
        }


        if(password !== confirmPassword) {
            return res.status(400).json({message: 'passwords do not match'})
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } })

        if(landlord) {
            return res.status(400).json({message: `user with email: ${email} already exists please use another email`})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

     

        const newlandlord = await landlordModel.create({
            fullName,
            email,
            password: hashedPassword,
             
        })


        const token = await jwt.sign({ landlordId: newlandlord.id}, process.env.JWT_SECRET, { expiresIn: '1day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/landlord-verify/${token}`

        const firstName = newlandlord.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newlandlord.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        await newlandlord.save()

        res.status(201).json({message: 'landlord registered successfully', data: newlandlord })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering landlord' , error: error.message})
    
    }
}


exports.verifylandlordEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const landlord = await landlordModel.findOne({ where: { id: decodedToken.landlordId }})

        if(!landlord) {
            return res.status(404).json({message: 'landlord not found'})
        }

        if(landlord.isVerified === true) {
            return res.status(400).json({message: 'landlord has already been verified'})
        }

        landlord.isVerified = true

        await landlord.save()

        res.status(200).json({message: 'landlord verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
        res.status(500).json({message: 'error verifying landlord:' , error:error.message})
    }
}



exports.resendlandlordVerificationEmail = async (req, res) => {
    try {
        
        const validated = await validate(req.body , verificationEmailSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } })

        if(!landlord) {
            return res.status(404).json({message: 'landlord not found'})
        }

        const token = await jwt.sign({ landlordId: landlord.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/landlord-verify/${token}`

        const firstName = landlord.fullName.split(' ')[0]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: landlord.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'verification email sent, please check mail box'})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error resending verification email', error: error.message})
    }
}


exports.loginlandlord = async (req, res) => {
    try {
        
        const validated = await validate(req.body, loginSchema);
        const { email, password } = validated;

        
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide both email and password' });
        }

       
        const landlord = await landlordModel.findOne({
            where: { email: email.toLowerCase() }
        });

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

       
        const isPasswordCorrect = await bcrypt.compare(password, landlord.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        
        if (!landlord.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please check your email for the verification link' });
        }

       
        const token = jwt.sign({ landlordId: landlord.id, isLoggedIn: true },process.env.JWT_SECRET,{ expiresIn: '1d' });

        
        landlord.isLoggedIn = true;
        await landlord.save();

        
        res.status(200).json({ message: 'Login successful', data: landlord, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in landlord', error: error.message });
    }
};



exports.landlordForgotPassword = async (req, res) => {
    try {
        
        const validated = await validate(req.body , forgotPasswordSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } })

        if(!landlord) {
            return res.status(404).json({message: 'landlord not found'})
        }

        const secret = process.env.OTP_SECRET + email; 
        const otp = totp.generate(secret);

      
        const firstName = landlord.fullName.split(' ')[0]

        const html = forgotTemplate(otp, firstName)

        const mailOptions = {
            subject: 'reset password',
            email: landlord.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'otp has been sent, please check mail box'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error initializing forget password:' , error:error.message})
    }
}




exports.landlordResetPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , resetPasswordschema)

        const {email, otp, password, confirmPassword } = validated

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const secret = process.env.OTP_SECRET + email; 
        const isValidOTP = totp.check(otp, secret);
  
        if (!isValidOTP) {
           return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } });

        if (!landlord) {
            return res.status(404).json({ message: 'landlord not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        landlord.password = hashedPassword;

        await landlord.save();

        res.status(200).json({ message: 'Password reset successful' });

        
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({message: 'Session expired. Please enter your email to resend link'})
        }  
        
       res.status(500).json({message: 'Error resetting password', error: error.message});
    }
}




exports.changelandlordPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , changePassword )

        const {oldPassword, newPassword, confirmPassword} = validated

        const {id} = req.landlord;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. landlord not authenticated' });
        }
        

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const landlord = await landlordModel.findOne( { where: { id } });

        if (!landlord) {
            return res.status(404).json({ message: 'landlord not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, landlord.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        landlord.password = hashedPassword;

        await landlord.save();

        res.status(200).json({ message: 'Password change successful' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error initiating change password', error: error.message }); 
    }
};



exports.logoutlandlord = async (req, res) => {
    try {
        const { id } = req.landlord;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. landlord not authenticated' });
        }

        const landlord = await landlordModel.findOne({ where: { id } });

        if (!landlord) {
            return res.status(404).json({ message: 'landlord not found' });
        }

        landlord.isLoggedIn = false;

        await landlord.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging out landlord', error: error.message });
    }
};






