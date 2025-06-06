const landlordModel = require('../models/landlord')
const transactionModel = require('../models/transaction');
const tenantModel = require('../models/tenant')
const landlordProfileModel = require('../models/landlordprofile')
const listingModel = require('../models/listing')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { totp } = require('otplib');
const { signUpTemplate ,forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema,
    verifyPasswordSchema, changePassword} = require('../validation/user')
totp.options = { digits: 4, step: 900}




exports.registerlandlord = async (req, res) => {
    try {

        let validated;
        try {
            validated = await validate(req.body, registerSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }
        
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

        const link = `https://haven-list.vercel.app/api/v1/landlord/${token}`

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



// exports.verifylandlordEmail = async (req, res) => {
//     try {
//         const { token } = req.params;

//         if (!token) {
//             return res.status(400).send('Verification token not found.');
//         }

//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//         const landlord = await landlordModel.findOne({ where: { id: decodedToken.landlordId } });

//         if (!landlord) {
//             return res.status(404).send('Landlord not found.');
//         }

//         if (landlord.isVerified) {
//             return res.redirect('https://haven-list.vercel.app/email-verified?status=already');
//         }

//         landlord.isVerified = true;
//         await landlord.save();

//         return res.redirect('https://haven-list.vercel.app/email-verified?status=success');
//     } catch (error) {
//         console.error(error.message);
//         return res.redirect('https://haven-list.vercel.app/email-verified?status=failed');
//     }
// };



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

        let validated;
        try {
            validated = await validate(req.body, verificationEmailSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }
        

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } })

        if(!landlord) {
            return res.status(404).json({message: 'landlord not found'})
        }

        const token = await jwt.sign({ landlordId: landlord.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `https://haven-list.vercel.app/api/v1/resendlandlord-verify/${token}`

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

        let validated;
        try {
            validated = await validate(req.body, loginSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }

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
            return res.status(400).json({ message: 'invalid credentials' });
        }

        
        if (!landlord.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please check your email for the verification link' });
        }

       
        const token = jwt.sign({ landlordId: landlord.id, isLoggedIn: true },process.env.JWT_SECRET,{ expiresIn: '1d' });

        const landlordProfile = await landlordProfileModel.findOne({
            where: { landlordId: landlord.id }
        });

        landlord.isLoggedIn = true;
        await landlord.save();

        
        res.status(200).json({ message: 'Login successful', data: landlord, token, landlordProfile });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in landlord', error: error.message });
    }
};



exports.landlordForgotPassword = async (req, res) => {
    try {
        let validated;
        try {
            validated = await validate(req.body, forgotPasswordSchema);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }
        

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const landlord = await landlordModel.findOne({ where: { email: email.toLowerCase() } })

        if(!landlord) {
            return res.status(404).json({message: 'landlord not found'})
        }

        const secret = `${process.env.OTP_SECRET}${email.toLowerCase()}`;
        const otp = totp.generate(secret);

      
        const resetLink = `https://haven-list.vercel.app/api/v1/verify/landlord`;

        const firstName = landlord.fullName.split(' ')[0];
        const html = forgotTemplate(firstName, otp, resetLink);

        const mailOptions = {
            subject: 'landlord reset password',
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



exports.verifyLandlordOtp = async (req, res) => {
    try {
        let validated;
        try {
            validated = await validate(req.body, verifyPasswordSchema);
        } catch (validationError) {
            return res.status(400).json({ message: validationError.message });
        }

        const { otp } = validated;

        if (!otp) {
            return res.status(400).json({ message: 'OTP is required' });
        }

        const landlords = await landlordModel.findAll();
        let landlord = null;

        for (const l of landlords) {
            const secret = `${process.env.OTP_SECRET}${l.email.toLowerCase()}`;
            if (totp.check(otp, secret, { window: 10 })) {
                landlord = l;
                break;
            }
        }

        if (!landlord) {
            return res.status(404).json({ message: 'Invalid or expired OTP' });
        }

        // Generate JWT token valid for 10 minutes
        const token = jwt.sign(
            { id: landlord.id, email: landlord.email },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        return res.status(200).json({
            message: 'OTP verified successfully',
            token
        });

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({
            message: 'Error verifying OTP',
            error: error.message
        });
    }
};

exports.landlordResetPassword = async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token is required in the URL parameters' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        const landlord = await landlordModel.findByPk(decoded.id);

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

        let validated;
        try {
            validated = await validate(req.body, resetPasswordschema);
        } catch (validationError) {
            return res.status(400).json({ message: validationError.message });
        }

        const { password, confirmPassword } = validated;

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: 'Password and Confirm Password are required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await landlord.update({ password: hashedPassword });

        return res.status(200).json({ message: 'Password reset successful' });

    } catch (error) {
        console.error('Reset Password Error:', error);
        return res.status(500).json({
            message: 'An error occurred while resetting password',
            error: error.message
        });
    }
};


exports.changelandlordPassword = async (req, res) => {
    try {

        
        let validated;
        try {
            validated = await validate(req.body, changePassword);
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message });
        }


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
            return res.status(400).json({ message: 'invalid credentials' });
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






exports.getLandlordTransactions = async (req, res) => {
    try {
      const { landlordId } = req.params;
  
    
      if (!landlordId) {
        return res.status(400).json({ message: 'Landlord ID is required' });
      }
  
     
      const transactions = await transactionModel.findAll({
        where: {
          landlordId,
          status: 'success',
        },
        order: [['paymentDate', 'DESC']],
      });
  
     
      const totalAmount = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  
      
      await landlordModel.update(
        { transactionHistory: totalAmount }, 
        { where: { id: landlordId } }
      );
  
     
      res.status(200).json({
        message: 'Landlord transaction history retrieved successfully',
        totalAmount, 
        transactions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching landlord transactions', error: error.message });
    }
  };