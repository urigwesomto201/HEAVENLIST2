const userModel = require('../models/user')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { signUpTemplate ,forgotTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')


exports.registerUser = async (req, res) => {
    try {
        const validated = await validate(req.body , registerSchema)
       
        
        const {fullName, email, password, username, confirmPassword} = validated

        if(!fullName || !email || !password || !username || !confirmPassword) {
            return res.status(400).json({message:'please input correct fields'})
        }

        if(password !== confirmPassword) {
            return res.status(400).json({message: 'passwords do not match'})
        }

        const user = await userModel.findOne({ where: { email: email.toLowerCase() } })

        if(user) {
            return res.status(400).json({message: `user with email: ${email} already exists`})
        }


        const usernameExists = await userModel.findOne({where:{ username: username.toLowerCase()}})

        if(usernameExists) {
            return res.status(400).json({message: 'username has been taken'})
        }



        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

     

        const newUser = await userModel.create({
            fullName,
            email,
            password: hashedPassword,
            username
            
        
        })


        const token = await jwt.sign({ userId: newUser.id}, process.env.JWT_SECRET, { expiresIn: '1day'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = newUser.fullName.split(' ')[0]


        const mailDetails = {
            subject: 'Welcome Email',
            email: newUser.email,
            html : signUpTemplate(link, firstName)
        }

        await sendEmail(mailDetails)

        res.status(201).json({message: 'user registered successfully', data: newUser })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error registering user' , error: error.message})
    
    }
}




exports.verifyUserEmail = async (req, res) => {
    try {
        
        const {token}  = req.params

        if(!token) {
            return res.status(400).json({message: 'token not found'})
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({ where: { id: decodedToken.userId }})

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        if(user.isVerified === true) {
            return res.status(400).json({message: 'user has already been verified'})
        }

        user.isVerified = true

        await user.save()

        res.status(200).json({message: 'user verified successfully'})


    } catch (error) {
        console.log(error.message)
        if(error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({message: 'verification link expired'})
        }
        res.status(500).json({message: 'error verifying user:' , error:error.message})
    }
}



exports.resendVerificationEmail = async (req, res) => {
    try {
        
        const validated = await validate(req.body , verificationEmailSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const user = await userModel.findOne({ where: { email: email.toLowerCase() } })

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        const token = await jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/user-verify/${token}`

        const firstName = user.fullName.split(' ')[0]

        const html = signUpTemplate(link, firstName)

        const mailOptions = {
            subject: 'email verification',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'verification email sent, please check mail box'})


    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error resending verification email', error: error.message})
    }
}



exports.loginUser = async (req, res) => {
    try {
  
        const validated = await validate(req.body , loginSchema)

        const {email, password, username} = validated

        if(!email && !username) {
            return res.status(400).json({message: 'please enter either email or username'})    
        }

        if(email && username) {
            return res.status(400).json({message: 'please enter either email or username, not both'})
        }

        if(!password) {
            return res.status(400).json({message: 'please enter your password'})    
        }

        const queryCondition = [];
        if (email) queryCondition.push({ email: email.toLowerCase() });
        if (username) queryCondition.push({ username: username.toLowerCase() });

        const user = await userModel.findOne({
            where: {
                [Op.or]: queryCondition
            }
        });


        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: 'Account not verified. Please check your email for the verification link' });
        }

        user.isLoggedIn = true;

        const token = jwt.sign({ userId: user.id, isLoggedIn: user.isLoggedIn }, process.env.JWT_SECRET, { expiresIn: '1day' });

        await user.save();

       
        res.status(200).json({ message: 'Login successful', data: user, token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging in user', error: error.message });
    }
};




exports.forgotPassword = async (req, res) => {
    try {
        
        const validated = await validate(req.body , forgotPasswordSchema)

        const {email} = validated

        if(!email) {
            return res.status(400).json({message: 'please enter email address'})
        }

        const user = await userModel.findOne({ where: { email: email.toLowerCase() } })

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        const token = await jwt.sign({ userId: user.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/reset-password/${token}`

        const firstName = user.fullName.split(' ')[0]

        const html = forgotTemplate(link, firstName)

        const mailOptions = {
            subject: 'reset password',
            email: user.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'reset password email sent, please check mail box'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error initializing forget password:' , error:error.message})
    }
}




exports.resetPassword = async (req, res) => {
    try {

        const validated = await validate(req.body , resetPasswordschema)

        const {password, confirmPassword} = validated

        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token not found' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ where: { id: decodedToken.userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });

        
    } catch (error) {
        console.log(error.message);
        if (error instanceof jwt.JsonWebTokenError) {
          return res.status(400).json({message: 'Session expired. Please enter your email to resend link'})
        }  
        
       res.status(500).json({message: 'Error resetting password', error: error.message});
    }
}





exports.changePassword = async (req, res) => {
    try {

        const validated = await validate(req.body , changePassword )

        const {oldPassword, newPassword, confirmPassword} = validated

        const {id} = req.user;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. User not authenticated' });
        }
        

        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const user = await userModel.findOne( { where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect old password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;

        await user.save();

        res.status(200).json({ message: 'Password change successful' });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error initiating change password', error: error.message }); 
    }
}





exports.logoutUser = async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized. User not authenticated' });
        }

        const user = await userModel.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isLoggedIn = false;

        await user.save();

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error logging out user', error: error.message });
    }
};




// exports.getUserProfile = async (req, res) => {
//     try {
//         const { id } = req.user;

//         if (!id) {
//             return res.status(401).json({ message: 'Unauthorized. Please log in to access this resource.' });
//         }

//         const user = await userModel.findOne({ where: { id }, attributes: { exclude: ['password']}});

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ message: 'User profile retrieved successfully', data: user });
        

//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ message: 'Error getting userprofile', error: error.message });
//     }
// }


exports.updateUserProfile = async (req, res) => {
    try {
        const {id } = req.user

        const {fullName, username} = req.body

        if (!fullName || !username) {
            return res.status(400).json({message: 'input the correct fields'})
        }

        // const usernameExists = await userModel.findOne({where: {username: username.toLowerCase()}})
        const usernameExists = await userModel.findOne({
            where: { username: username.toLowerCase(), id: { [Op.ne]: id } },
        });

        if(usernameExists) {
            return res.status(400).json({message: `${username} already exists, try another`})
        }
        const user = await userModel.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        user.fullName = fullName;
        user.username = username.toLowerCase();

        await user.save();
        res.status(200).json({message: 'profile update successful', data: user})

    } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Error getting userprofile', error: error.message });
    }
}