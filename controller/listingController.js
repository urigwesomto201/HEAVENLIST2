const { Sequelize, DataTypes, Model } = require('sequelize');
const listingModel = require('../models/listing')
const cloudinary = require('../database/cloudinary')
const landlordModel = require('../models/landlord')
const { Op } = require('sequelize')

const fs = require('fs')





exports.createListing = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const {
            title, type, bedrooms, bathrooms, price, toilets,
            state, area, description, minrent, maxrent, street, year
        } = req.body;

        // Validate required fields
        if (!title || !type || !bedrooms || !bathrooms || !price || !toilets ||
            !state || !area || !description || !minrent || !maxrent || !street || !year) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required.' });
        }

        // Check if landlord exists
        const landlord = await landlordModel.findOne({
            where: { landlordId },
            attributes: ['id', 'fullName'],
        });
    

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found.' });
        }


        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one listing image is required.' });
        }

        // Upload each image to Cloudinary
        const uploadedImages = [];
        try {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path);
                uploadedImages.push({
                    imageUrl: result.secure_url,
                    publicId: result.public_id,
                });

                // Delete the file from the server after upload
                fs.unlinkSync(file.path);
            }
        } catch (uploadError) {
            console.error('Error uploading images to Cloudinary:', uploadError.message);

            // Clean up already uploaded images in case of an error
            for (const image of uploadedImages) {
                await cloudinary.uploader.destroy(image.publicId);
            }

            return res.status(500).json({
                message: 'Error uploading images to Cloudinary',
                error: uploadError.message,
            });
        }

        // Save the listing
        const newListing = await listingModel.create({
            title,
            type,
            bedrooms,
            bathrooms,
            price,
            toilets,
            state,
            area,
            description,
            minrent,
            maxrent,
            street,
            year,
            listingImage: JSON.stringify(uploadedImages), // Save as JSON string
            landlordId,
            isAvailable: false,
            isClicked: 0,
            status: 'pending',
        });

 

    res.status(201).json({
      message: 'Listing created successfully',
      data: newListing,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating listing',
      error: error.message,
    });
  }
}




exports.getAllListings = async (req, res) => {
    try {
        
        const listings = await listingModel.findAll({
            where: { isAvailable: true , status: 'accepted'},
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName'], 
                as: 'landlord', 
                },
            ],
        });

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No listings found' });
        }
      

        res.status(200).json({message: 'find all Listing below', total: listings.length, data: listings})

    } catch (error) {
        
        res.status(500).json({ message: 'Error fetching listings',   error:error.message})
    }
}




exports.getOneListingByLandlord= async (req, res) => {
    try {
        const {landlordId, listingId} = req.params

        

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
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
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({message: 'find one id listing by landlord below', data: listing})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listing', error: error.message })
    }
}



exports.getOneListing = async (req, res) => {
    try {
        const { listingId } = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }

        const listing = await listingModel.findOne({
            where: { id: listingId, isAvailable:true, status: 'accepted' },
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        listing.isClicked += 1
        await listing.save()

        res.status(200).json({message: 'find listing by id below', data: listing})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listing',   error:error.message})
    }
}



exports.getAllListingsByLandlord = async (req, res) => {
    try {
        const {landlordId} = req.params

        const listings = await listingModel.findAll({
            where: {  landlordId},
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName'], 
                 as: 'landlord', 
                },
            ],
        });
            
        if (listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for this landlord' });
        }

        res.status(200).json({message: 'find all Listing by one landlord below', total: listings.length, data: listings})

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listing',   error:error.message})
    }
}



exports.updateListing = async (req, res) => {
    try {
        const { landlordId, listingId } = req.params;
        

        const {
            title, type, bedrooms, bathrooms, price, toilets,
            state, area, description, minrent, maxrent, street, year,
        } = req.body;

        // Validate required fields
        if (!title || !type || !bedrooms || !bathrooms || !price || !toilets ||
            !state || !area || !description || !minrent || !maxrent || !street || !year) {
            return res.status(400).json({ message: 'Please input all fields' });
        }

        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }

        // Find the listing
        const listing = await listingModel.findOne({ where: { id: listingId ,  landlordId} });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Parse existing images
        let updatedImages = [];
        if (listing.listingImage) {
            try {
                updatedImages = JSON.parse(listing.listingImage);
                if (!Array.isArray(updatedImages)) {
                    updatedImages = [];
                }
            } catch (parseError) {
                console.error('Error parsing listingImage:', parseError.message);
                updatedImages = []; // Fallback to an empty array
            }
        }

        // Handle new images
        if (req.files && req.files.length > 0) {
            try {
                // Upload new images to Cloudinary
                updatedImages = [];
                for (const file of req.files) {
                    const result = await cloudinary.uploader.upload(file.path);
                    updatedImages.push({
                        imageUrl: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            } catch (uploadError) {
                console.error('Error uploading images to Cloudinary:', uploadError.message);
                return res.status(500).json({ message: 'Error uploading images to Cloudinary', error: uploadError.message });
            }
        }

        // Update the listing
        await listing.update({
            title,
            type,
            bedrooms,
            bathrooms,
            price,
            toilets,
            state,
            area,
            description,
            minrent,
            maxrent,
            street,
            year,
            listingImage: JSON.stringify(updatedImages),
        });

        // Fetch the updated listing
        const updatedListing = await listingModel.findOne({
            where: { id: listingId },
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'],
                    as: 'landlord',
                },
            ],
        });

        res.status(200).json({ message: 'Listing updated successfully', data: updatedListing });
    } catch (error) {
        console.error('Error updating listing:', error.message);

        res.status(500).json({ message: 'Error updating listing', error: error.message });
    }
};





exports.deleteListing = async (req, res) => {
    try {
        const { landlordId, listingId } = req.params;
        

        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }

        // Find the listing
        const listing = await listingModel.findOne({
            where: { id: listingId,  landlordId},
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

        // Parse and delete images from Cloudinary
        if (listing.listingImage) {
            try {
                const images = JSON.parse(listing.listingImage);
                for (const image of images) {
                    if (image.publicId) {
                        await cloudinary.uploader.destroy(image.publicId);
                    }
                }
            } catch (parseError) {
                console.error('Error parsing listingImage:', parseError.message);
                return res.status(500).json({ message: 'Error parsing listing images', error: parseError.message });
            }
        }

        // Delete the listing
        await listingModel.destroy({ where: { id: listingId } });

        res.status(200).json({ message: 'Listing deleted successfully', data: listing });
    } catch (error) {
        console.error('Error deleting listing:', error.message);
        res.status(500).json({ message: 'Error deleting listing', error: error.message });
    }
};


exports.searchListing = async (req, res) => {
    try {
        const { area, type, bedrooms, minrent, maxrent } = req.query;


        if (!area && !type && !bedrooms && !minrent && !maxrent) {
            return res.status(400).json({ message: 'Please provide at least one search criteria' });
        }

        const queryCondition = {};
        if (area) queryCondition.area = area.toLowerCase();
        if (type) queryCondition.type = type;
        if (bedrooms) queryCondition.bedrooms = bedrooms;
        if (minrent) queryCondition.minrent = minrent
        if (maxrent) queryCondition.maxrent = maxrent

        const listings = await listingModel.findAll({
            where: {
                ...queryCondition,
                isAvailable: true,
                status: 'accepted'
            },
            include: [
                {
                    model: landlordModel, 
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        if (listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for the specified criteria' });
        }

        res.status(200).json({ message: 'Listings for the specified criteria', total: listings.length, data: listings });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error getting listings by criteria', error: error.message });
    }
};






exports.getClicksbyListing = async (req, res) => {
    try {
        const {landlordId, listingId } = req.params
        

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }

        const listing = await listingModel.findOne({ where: { id : listingId, landlordId, isAvailable:true, status: 'accepted' },
            attributes: ['id', 'title', 'price', 'description', 'area', 'isClicked']
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        } 

        res.status(200).json({message: 'find views by listing below', views: listing.isClicked , listing})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error getting clicks by listing', error: error.message });
    }
}
