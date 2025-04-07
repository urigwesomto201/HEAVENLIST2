const adminModel = require('../models/admin')
const tenantModel = require('../models/tenant')
const LandlordProfile = require('../models/landlordprofile')
const bcrypt  = require('bcrypt')
const fs = require('fs');
const listingModel = require('../models/listing')
const landlordModel = require('../models/landlordprofile')
const cloudinary = require('../database/cloudinary')




exports.createLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const { fullName, email, state, street, locality} = req.body;

        console.log("ID", landlordId);

        if (!fullName || !email || !state || !street || !locality) {
            return res.status(400).json({ message: 'Please input correct fields' });
        }

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        const existingLandlord = await LandlordProfile.findOne({ where: { id: landlordId } });

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

        const newProfile = await LandlordProfile.create({
            id: landlordId,
            fullName,
            email,
            state,
            landlordId,
            street,
            locality,
            profileImage: result.secure_url
        });

        newProfile.isVerified = true; 

        await newProfile.save()

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
        const { landlordId } = req.landlord

        const landlordProfile = await LandlordProfile.findOne({ where: { },
            include: [
                {
                    model: listingModel,
                    as: 'listings',
                    attributes: ['title', 'price', 'description'],
                },
            ],
        });
       
        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        res.status(200).json({ message: 'Landlord profile fetched successfully', data: landlordProfile });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: 'Error fetching landlord profile', error: error.message });
    }
};





exports.alllandlordProfiles = async (req, res) => {
    try {

       const landlords = await LandlordProfile.findAll({
            include: [
                {
                    model: listingModel,
                    as: 'listings',
                    attributes: ['title', 'price', 'description'],
                },
            ],

       });

        if (landlords.length === 0){
            return res.status(404).json({message:"no landlordsProfile found"})
        }

  res.status(200).json({message:'landlords profile fetched successfully',  total: landlords.length, 
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
        const { fullName, email, state, street, locality } = req.body;

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required' });
        }

        const existingLandlord = await LandlordProfile.findOne({ where: { id: landlordId } });

        if (!existingLandlord) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        let updatedImage = existingLandlord.profileImage;

        
        if (req.file) {
            if (existingLandlord.profileImage && existingLandlord.profileImage.publicId) {
                await cloudinary.uploader.destroy(existingLandlord.profileImage.publicId);
            }

            const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
            updatedImage = result.secure_url;

            if (fs.existsSync(req.file.path)) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (err) {
                    console.error("Error deleting file:", err.message);
                }
            }
        }

       
        await existingLandlord.update({
            fullName,
            state,
            street,
            locality,
            email,
            profileImage: updatedImage 
        });

        existingLandlord.isVerified = true;

       
        const updatedLandlord = await landlordModel.findOne({
            where: { id: landlordId },
            include: [{
                model: listingModel,
                attributes: ['title', 'price', 'description'],
                as: 'listings'
            }]
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
        const { landlordId } = req.landlord;

        const landlordProfile = await landlordModel.findOne({
            where: { },
            include: [{
                model: listingModel,
                attributes: ['title', 'price', 'description'],
                as: 'listings'
            }]
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















