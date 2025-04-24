const { Sequelize, DataTypes, Model } = require('sequelize');
const listingModel = require('../models/listing')
const cloudinary = require('../database/cloudinary')
const landlordModel = require('../models/landlord')
// const { Op } = require('sequelize')
const { Op } = require('sequelize');

const fs = require('fs')

const {  pendingListingMessage,approvedListingMessage,rejectedListingMessage} = require('../utils/mailTemplates');
const sendEmail = require('../middlewares/nodemailer');






exports.createListing = async (req, res) => {
    try {
        const { landlordId } = req.params;
        const {
            title, type, bedrooms, bathrooms, price, toilets,
            state, area, description, street, year, partPayment
        } = req.body;

        // Validate required fields
        if (!title || !type || !bedrooms || !bathrooms || !price || !toilets ||
            !state || !area || !description || !street || !year || !partPayment) {
            return res.status(400).json({ message: 'Please provide all required fields'});
        }

        if (!landlordId) {
            return res.status(400).json({ message: 'Landlord ID is required.' });
        }

        // Validate partPayment
        const allowedPartPayments = ['10%', '20%', '30%'];
        if (!allowedPartPayments.includes(partPayment)) {
            return res.status(400).json({ message: `Invalid partPayment value. Allowed values are: ${allowedPartPayments.join(', ')}` });
        }

        // Calculate part-payment amount
        const partPaymentPercentage = parseFloat(partPayment) / 100; // Convert '10%' to 0.1
        const partPaymentAmount = price * partPaymentPercentage;

        // Check if landlord exists
        const landlord = await landlordModel.findOne({
            where: { id: landlordId },
            attributes: ['id', 'fullName','email'],
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
            street,
            year,
            partPayment,
            partPaymentAmount, // Save the calculated part-payment amount
            listingImage: uploadedImages, // Save as JSON string
            landlordId,
            isAvailable: false,
            isClicked: 0,
            status: 'pending',
        });
     await sendEmail({
        to: landlord.email,
        subject: 'Your Property Listing is Under Review',
        html: pendingListingMessage(landlord.fullName)
     })
   
        res.status(201).json({
            message: 'Listing created successfully',
            data: newListing,
        });
    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: 'Error creating listing',
            error: error.message,
        });
    }
};



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
            where: { landlordId},
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
            state, area, description,street, year, partPayment
        } = req.body;

        // Validate required fields
        if (!title || !type || !bedrooms || !bathrooms || !price || !toilets ||
            !state || !area || !description || !street || !year || !partPayment) {
            return res.status(400).json({ message: 'Please provide all required fields, including partPayment' });
        }

        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }

        // Validate partPayment
        const allowedPartPayments = ['10%', '20%', '30%'];
        if (!allowedPartPayments.includes(partPayment)) {
            return res.status(400).json({ message: `Invalid partPayment value. Allowed values are: ${allowedPartPayments.join(', ')}` });
        }

        // Calculate part-payment amount
        const partPaymentPercentage = parseFloat(partPayment) / 100; // Convert '10%' to 0.1
        const partPaymentAmount = price * partPaymentPercentage;

        // Find the listing
        const listing = await listingModel.findOne({ where: { id: listingId, landlordId } });

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
            street,
            year,
            partPayment,
            partPaymentAmount, // Save the calculated part-payment amount
            listingImage: updatedImages,
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
        updatedListing.status = Status;
        await updatedListing.save();
        if(!updatedListing){return res.status(404).json({message:'Listing not found'})};

        const landlordEmail = updatedListing.landlord.email;
        const landlordName = updatedListing.landlord.fullName;

        if(Status === 'accpted'){
            await sendEmail({ to: landlordEmail,
                subject:'Your property Has Been Approved',
                html: approvedListingMessage(landlordName)}
            )
        }else if(Status === 'rejected'){
            await sendEmail({ to: landlordEmail,
                subject:'Your property Has Been rejected',
                html: rejectedListingMessage(landlordName)}
            )
        }

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
        where: { id: listingId, landlordId },
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
  
      // Permanently delete the listing from the database
      await listing.destroy();
  
      res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
      console.error('Error deleting listing:', error.message);
      res.status(500).json({ message: 'Error deleting listing', error: error.message });
    }
};



exports.searchListing = async (req, res) => {
    try {
      const { area, type, bedrooms, bathrooms} = req.query;
  
      if (!area && !type && !bedrooms && !bathrooms) {
        return res.status(400).json({ message: 'Please provide at least one search criteria' });
      }
  
      // Build the query condition using Sequelize's Op.or
      const queryConditions = [];
      if (area) queryConditions.push({ area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', `%${area.toLowerCase()}%`) });
      if (type) queryConditions.push({ type });
      if (bedrooms) queryConditions.push({ bedrooms });
      if (bathrooms) queryConditions.push({ bathrooms });
  
      const listings = await listingModel.findAll({
        where: {
          [Op.and]: [
            { isAvailable: true },
            { status: 'accepted' },
            { [Op.or]: queryConditions }, // At least one condition must match
          ],
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


exports.getAllPropertiesRentedOut = async (req, res) => {
    try {
        const listings = await listingModel.findAll({
            where: { isAvailable: false },
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No rented out properties found' });
        }

        res.status(200).json({message: 'find all rented out properties below', total: listings.length, data: listings})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error fetching rented out properties',   error:error.message})
    }
}


exports.getAllAreasCovered = async (req, res) => {
    try {
        const areas = await listingModel.findAll({
            attributes: ['area'],
            where: { isAvailable: true, status: 'accepted' },
        });

        if (!areas || areas.length === 0) {
            return res.status(404).json({ message: 'No areas found' });
        }

        res.status(200).json({message: 'find all areas covered below', total: areas.length, data: areas})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error fetching areas',   error:error.message})
    }
}


exports.getAllPropertiesListed = async (req,res) => {
    try {
        const listings = await listingModel.findAll({
        
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlord', 
                },
            ],
        });

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: 'No properties listed found' });
        }

        res.status(200).json({message: 'find all properties listed below', total: listings.length, data: listings})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: 'Error fetching properties listed',   error:error.message})
    }
}