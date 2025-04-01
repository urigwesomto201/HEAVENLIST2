const adminModel = require('../models/admin')
// const bcrypt  = require('bcryptjs')
const sendEmail = require('../middlewares/nodemailer')
const bcrypt  = require('bcrypt')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')
const { signUpTemplate ,forgotTemplate, adminTemplate } = require('../utils/mailTemplates')
const {validate} = require('../helper/utilities')
const {registerSchema, loginSchema, verificationEmailSchema, forgotPasswordSchema, resetPasswordschema, changePassword} = require('../validation/user')


exports.registerAdmin = async (req, res) => {
    try {
        // Validate request body
        const validated = await validate(req.body, registerSchema);
        const { fullName, email, password, username, confirmPassword } = validated;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if the admin already exists
        const existingAdmin = await adminModel.findOne({ where: { email: email.toLowerCase() } });
        if (existingAdmin) {
            if (existingAdmin.isAdmin) {
                return res.status(400).json({ message: 'User is already an Admin' });
            }

            // If the admin exists but is not marked as admin, update it
            await adminModel.update({ isAdmin: true }, { where: { id: existingAdmin.id } });

            return res.status(200).json({ message: 'User has been updated to Admin', data: existingAdmin });
        }

        // Check if the username is taken
        const usernameExists = await adminModel.findOne({ where: { username: username.toLowerCase() } });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username has already been taken' });
        }

        // Hash the password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new admin in the adminModel
        const newAdmin = await adminModel.create({
            fullName,
            email: email.toLowerCase(),
            password: hashedPassword,
            username: username.toLowerCase(),
            isVerified: true,
            isAdmin: true,
        });

        // Send an email to the new admin
        const firstName = newAdmin.fullName.split(' ')[0];
        const mailDetails = {
            subject: 'Welcome Admin',
            email: newAdmin.email,
            html: adminTemplate(firstName),
        };

        await sendEmail(mailDetails);

        return res.status(201).json({ message: 'Admin registered successfully', data: newAdmin });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Error registering admin', error: error.message });
    }
};




exports.loginAdmin = async (req, res) => {
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

        const admin = await adminModel.findOne({
            where: {
                [Op.or]: queryCondition
            }
        });


        if (!admin) {
            return res.status(404).json({ message: 'admin not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Incorrect password' });
        }

        admin.isLoggedIn = true;

        const token = jwt.sign({ adminId: admin.id, isLoggedIn: admin.isLoggedIn }, process.env.JWT_SECRET, { expiresIn: '1day' });

        await admin.save();

       
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

        const token = await jwt.sign({ adminId: admin.id}, process.env.JWT_SECRET, { expiresIn: '1h'})

        const link = `${req.protocol}://${req.get('host')}/api/v1/reset-adminpassword/${token}`

        const firstName = admin.fullName.split(' ')[0]

        const html = forgotTemplate(link, firstName)

        const mailOptions = {
            subject: 'admin reset password',
            email: admin.email,
            html
        }

        await sendEmail(mailOptions)

        res.status(200).json({message: 'reset password email sent, please check mail box'})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({message: 'error initializing forget password:' , error:error.message})
    }
}




exports.adminResetPassword = async (req, res) => {
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


        if (!decodedToken || !decodedToken.adminId) {
            return res.status(400).json({ message: 'Invalid token payload' });
        }

        const admin = await adminModel.findOne({ where: { id: decodedToken.adminId } });

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







