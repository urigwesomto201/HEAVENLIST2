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
  
        
        if (!fullName || !email || !state || !street || !locality) {
            return res.status(400).json({ message: 'All fields are required: fullName, email, state, street, locality' });
        }
  
       
        const existingProfile = await landlordProfileModel.findOne({ where: {  landlordId } });
        if (existingProfile) {
            return res.status(400).json({ message: 'A profile already exists for this landlord' });
        }
  
        if (!req.file) {
            return res.status(400).json({ message: 'Landlord profile image is required' });
        }
  
      
        let uploadedImage;
        try {
            uploadedImage = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
        } catch (uploadError) {
            console.error('Error uploading image to Cloudinary:', uploadError.message);
            return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: uploadError.message });
        }
  
        
        if (!uploadedImage.secure_url) {
            return res.status(500).json({ message: 'Failed to retrieve secure URL from Cloudinary' });
        }
  
        
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
        console.error(error.message);
  
        res.status(500).json({ message: 'Error creating landlord profile', error: error.message });
    }
};





exports.getOneLandlordProfile = async (req, res) => {
    try {
        const { landlordProfileId } = req.params

        const landlordProfile = await landlordProfileModel.findOne({ where: {  id: landlordProfileId  } });

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
      const { landlordProfileId } = req.params;
      const { fullName, email, state, street, locality } = req.body;
  
      // Find the existing landlord profile
      const existingLandlord = await landlordProfileModel.findOne({ where: { id: landlordProfileId } });
  
      if (!existingLandlord) {
        return res.status(404).json({ message: 'Landlord profile not found' });
      }
  
      let updatedImage = existingLandlord.profileImage;
  
      // Handle profile image update
      if (req.file) {
        try {
          // Upload the new image to Cloudinary
          const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
          updatedImage = result.secure_url; // Save only the secure URL to the database
  
          // Optionally, delete the file from the server after upload
          // fs.unlinkSync(req.file.path);
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
        profileImage: updatedImage, // Save the updated image URL
      });
  
      existingLandlord.isVerified = true;
      await existingLandlord.save();
  
      // Fetch the updated profile
      const updatedLandlord = await landlordProfileModel.findOne({ where: { id: landlordProfileId } });
  
      res.status(200).json({ message: 'Landlord profile updated successfully', data: updatedLandlord });
    } catch (error) {
      console.error("Error updating landlord profile:", error.message);
      res.status(500).json({ message: 'Error updating landlord profile', error: error.message });
    }
};




exports.deleteLandlordProfile = async (req, res) => {
    try {
      const { landlordProfileId } = req.params;
  
      // Find the landlord profile
      const landlordProfile = await landlordProfileModel.findOne({ where: { id: landlordProfileId } });
  
      if (!landlordProfile) {
        return res.status(404).json({ message: 'Landlord profile not found' });
      }
  
      // Unverify all listings connected to this landlord profile
      await listingModel.update(
        { isVerified: false }, // Set isVerified to false
        { where: { landlordId: landlordProfile.landlordId } } // Match listings by landlordId
      );
  
      // Handle profile image deletion
      if (landlordProfile.profileImage) {
        try {
          const profileImage = JSON.parse(landlordProfile.profileImage);
          if (profileImage.publicId) {
            await cloudinary.uploader.destroy(profileImage.publicId);
          }
        } catch (parseError) {
          console.error('Error parsing profileImage:', parseError.message);
          return res.status(500).json({ message: 'Error parsing profile image', error: parseError.message });
        }
      }
  
      // Delete the landlord profile
      await landlordProfile.destroy();
  
      res.status(200).json({ message: 'Landlord profile and associated listings unverification completed successfully' });
    } catch (error) {
      console.error('Error deleting landlord profile:', error.message);
      res.status(500).json({ message: 'Error deleting landlord profile', error: error.message });
    }
  };












