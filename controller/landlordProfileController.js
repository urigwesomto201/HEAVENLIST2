const adminModel = require('../models/admin')
const tenantModel = require('../models/tenant')
const landlordProfileModel = require('../models/landlordprofile')
const bcrypt  = require('bcrypt')
const fs = require('fs');
const listingModel = require('../models/listing')
const landlordModel = require('../models/landlordprofile')
const cloudinary = require('../database/cloudinary')



exports.createLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const { fullName, email, state, street, locality } = req.body;
  
        // Validate required fields
        if (!fullName || !email || !state || !street || !locality) {
            return res.status(400).json({ message: 'All fields are required: fullName, email, state, street, locality' });
        }
  
        // Check if a profile already exists for the landlord
        const existingProfile = await landlordProfileModel.findOne({ where: { id: landlordId } });
        if (existingProfile) {
            return res.status(400).json({ message: 'A profile already exists for this landlord' });
        }
  
        if (!req.file) {
            return res.status(400).json({ message: 'Landlord profile image is required' });
        }
  
        // Upload the profile image to Cloudinary
        let uploadedImage;
        try {
            uploadedImage = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
        } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError.message);
            return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: uploadError.message });
        }
  
        // Ensure the uploaded image has a secure URL
        if (!uploadedImage.secure_url) {
            return res.status(500).json({ message: 'Failed to retrieve secure URL from Cloudinary' });
        }
  
        // Create the landlord profile
        const newProfile = await landlordProfileModel.create({
            landlordId,
            fullName,
            email,
            state,
            street,
            locality,
            profileImage: uploadedImage.secure_url,
        });
  
        newProfile.isVerified = true;
        await newProfile.save();
  
        res.status(201).json({ message: 'Landlord profile created successfully', data: newProfile });
    } catch (error) {
        console.error('Error creating landlord profile:', error.message);
  
        res.status(500).json({ message: 'Error creating landlord profile', error: error.message });
    }
};





exports.getOneLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params

        const landlordProfile = await landlordProfileModel.findOne({ where: { id: landlordId  } });
       console.log(landlordProfile)
       
        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }

        res.status(200).json({ message: 'Landlord profile fetched successfully', data: landlordProfile });

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

      // Find the existing landlord profile
      const existingLandlord = await landlordProfileModel.findOne({ where: { id: landlordId  } });

      if (!existingLandlord) {
          return res.status(404).json({ message: 'Landlord profile not found' });
      }

      let updatedImage = existingLandlord.profileImage;

      // Handle profile image update
      if (req.file) {
          try {
              // Delete the old image from Cloudinary if it exists
              if (existingLandlord.profileImage && existingLandlord.profileImage.publicId) {
                  await cloudinary.uploader.destroy(existingLandlord.profileImage.publicId);
              }

              // Upload the new image to Cloudinary
              const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
              updatedImage = {
                  imageUrl: result.secure_url,
                  publicId: result.public_id,
              };

              // Delete the file from the server after upload
              safelyDeleteFile(req.file.path);
          } catch (uploadError) {
              console.error("Error uploading image to Cloudinary:", uploadError.message);
              return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: uploadError.message });
          }
      }

      // Update the landlord profile
      await existingLandlord.update({
          fullName,
          email,
          state,
          street,
          locality,
          profileImage: updatedImage,
      });

      existingLandlord.isVerified = true;

      // Fetch the updated profile
      const updatedLandlord = await landlordProfileModel.findOne({ where: { id: landlordId  } });

      res.status(200).json({ message: 'Landlord profile updated successfully', data: updatedLandlord });
  } catch (error) {
      console.error("Error updating landlord profile:", error.message);

      // Delete the file from the server in case of an error
      if (req.file) {
          safelyDeleteFile(req.file.path);
      }

      res.status(500).json({ message: 'Error updating landlord profile', error: error.message });
  }
};


exports.deleteLandlordProfile = async (req, res) => {
    try {
        const { landlordId } = req.params;

        const landlordProfile = await landlordProfileModel.findOne({ where: { id: landlordId  } });

        if (!landlordProfile) {
            return res.status(404).json({ message: 'Landlord profile not found' });
        }


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















