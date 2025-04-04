const adminModel = require('../models/admin')
const userModel = require('../models/user')
const tenantModel = require('../models/tenant')
const bcrypt  = require('bcrypt')
const fs = require('fs');
const listingModel = require('../models/listing')
const landlordModel = require('../models/landlordprofile')
const cloudinary = require('../database/cloudinary')




exports.createLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const { firstName, lastName, email, state, street, locality, confirmPassword, Password } = req.body;
        console.log("ID", landlordId);

        if (!firstName || !lastName || !email || !state || !street || !locality || !confirmPassword || !Password) {
            return res.status(400).json({ message: 'Please input correct fields' });
        }
        if (Password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        const existingLandlord = await landlordModel.findOne({ where: { id: landlordId } });

        if (existingLandlord) {
            if (req.file && fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (err) {
                    console.error("Error deleting file:", err.message);
                }
            }
            return res.status(400).json({ message: 'Landlord profile already exists' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Landlord profile image is required.' });
        }

        console.log("Uploading file:", req.file.path);

        const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });

        if (!result.secure_url) {
            return res.status(400).json({ message: 'Error uploading image to Cloudinary' });
        }

        // Delete the file safely
        if (fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Error deleting file after Cloudinary upload:", err.message);
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        const newProfile = await landlordModel.create({
            id: landlordId,
            firstName,
            lastName,
            email,
            state,
            landlordId,
            street,
            Password: hashedPassword,
            locality,
            profileImage: result.secure_url
        });

        res.status(201).json({ message: 'Landlord profile created successfully', data: newProfile });

    } catch (error) {
        console.error("Error:", error.message);
        
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Error deleting file in catch:", err.message);
            }
        }

        res.status(500).json({ message: 'Error creating landlord profile', error: error.message });
    }
};


// GET one Landlord Profile
exports.getOneLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        // Find the landlord profile by the landlordId
        const landlordProfile = await landlordModel.findOne({ where: { id: landlordId } });

        // If the landlord profile doesn't exist, return an error
        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        // Return the landlord profile data if found
        res.status(200).json({ message: 'Landlord profile fetched successfully', data: landlordProfile });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: 'Error fetching landlord profile', error: error.message });
    }
};

exports.getLandlordProfile = async (req, res) => {
    try {


       const landlords = await landlordModel.findAll();
        if (landlords.length === 0){
            return res.status(4004).json({message:"no landlordsProfile found"})
        }
  res.status(200).json({message:'landlords fetched successfully',
    data:landlords
  })
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: 'Error fetching landlord profile', error: error.message });
    }
};

// UPDATE

exports.updateLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const { firstName, lastName, email, state, street, locality, confirmPassword, Password } = req.body;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        const existingLandlord = await landlordModel.findOne({ where: { id: landlordId } });

        if (!existingLandlord) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        if (Password && Password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (Password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(Password, salt);
            existingLandlord.Password = hashedPassword;
        }

        let updatedImage = existingLandlord.profileImage;

        // Handle file upload if a new image is provided
        if (req.file) {
            // If the landlord profile has an existing image, remove it from Cloudinary
            if (existingLandlord.profileImage && existingLandlord.profileImage.publicId) {
                await cloudinary.uploader.destroy(existingLandlord.profileImage.publicId);
            }

           
            
            
        }
         // Upload the new image to Cloudinary
         const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });

        // Update the landlord profile
        await existingLandlord.update({
            firstName,
            lastName,
            email,
            state,
            street,
            locality,
            profileImage: result.secure_url
        });

        // Fetch the updated landlord profile
        const updatedLandlord = await landlordModel.findOne({
            where: { id: landlordId },
        });

        res.status(200).json({ message: 'Landlord profile updated successfully', data: updatedLandlord });

    } catch (error) {
        console.error("Error:", error.message);
        if (req.file && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error("Error deleting file in catch:", err.message);
            }
        }
        res.status(500).json({ message: 'Error updating landlord profile', error: error.message });
    }
};


exports.deleteLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        const landlordProfile = await landlordModel.findOne({
            where: { id: landlordId },
        });

        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        // If the landlord profile has an image, remove it from Cloudinary
        if (landlordProfile.profileImage && landlordProfile.profileImage.publicId) {
            await cloudinary.uploader.destroy(landlordProfile.profileImage.publicId);
        }

        await landlordProfile.destroy();

        res.status(200).json({ message: 'Landlord profile deleted successfully' });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: 'Error deleting landlord profile', error: error.message });
    }
};















exports.getAll = async(req,res)=>{
    try {
        const cate = await categoryModel.find().populate('rooms',['roomName','price','description']);
     res.status(200).json({message:'All category in the database',
        data:cate
     })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            message: "Internal Server Erroor"
    })
}
}