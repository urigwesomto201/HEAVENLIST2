const listingModel = require('../models/listing')
const cloudinary = require('../database/cloudinary')
const landlordModel = require('../models/landlord')

const fs = require('fs')


exports.createListing = async (req, res) => {
    try {
        const { landlordId } = req.params
        const { type, description, price, location } = req.body

        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const landlord = await landlordModel.findOne({ where: { id : landlordId } })

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

        const result = await cloudinary.uploader.upload(req.file.path)

        const newListing = new listingModel({
            type,
            description,
            price,
            location,
            listingImage: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            },
            landlordId: landlordId,
            
        })

        await newListing.save()

        res.status(201).json({message: 'listing created successfully', data: newListing})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error creating listing', error: error.message })
         
    }
}




exports.getAllListings = async (req, res) => {
    try {
        
        const listings = await listingModel.findAll({
            where: { },
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName', 'email'], 
                 as: 'landlord', 
                },
            ],
        });

        res.status(200).json({message: 'find all Listing below', total: listings.length, data: listings})

    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listings', error: error.message })
    }
}





exports.getOneListingByLandlord= async (req, res) => {
    try {
        const { landlordId, listingId } = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }
        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const listing = await listingModel.findOne({
            where: { id: listingId, landlordId }, 
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName', 'email'], 
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
            where: { id: listingId },
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName', 'email'], 
                    as: 'landlord', 
                },
            ],
        });

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({message: 'find listing by id below', data: listing})
        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listing', error: error.message })
    }
}



exports.getAllListingsByLandlord = async (req, res) => {
    try {
        const {landlordId} = req.params

        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const listings = await listingModel.findAll({
            where: { landlordId },
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName', 'email'], 
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
        res.status(500).json({ message: 'Error fetching listing', error: error.message })
    }
}





exports.updateListing = async (req, res) => {
    try {
        const {landlordId, listingId } = req.params


        const {type, description, price, location} = req.body

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }

        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const listing = await listingModel.findOne({ where: { id : listingId, landlordId } })

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        } 

        let updatedImage = listing.listingImage

       
        if (req.file) {
            if (listing.listingImage && listing.listingImage.publicId) {
                await cloudinary.uploader.destroy(listing.listingImage.publicId);
            }

            const result = await cloudinary.uploader.upload(req.file.path);
            updatedImage = {
                imageUrl: result.secure_url,
                publicId: result.public_id,
            };
        }

        await listingModel.update(
            {
                type,
                description,
                price,
                location,
                listingImage: updatedImage,
            },
            { where: { id: listingId, landlordId } } 
        );

       
        const updatedListing = await listingModel.findOne({ where: { id: listingId, landlordId },
        include: [
            {
            model: landlordModel,
            attributes: ['id', 'fullName', 'email'], 
             as: 'landlord', 
            },
        ],
    });


        res.status(200).json({ message: 'Listing updated successfully', data: updatedListing });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error updating listings', error: error.message });
    }
}



exports.deleteListing = async (req, res) => {
    try {
        const {landlordId, listingId } = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }

        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const listing = await listingModel.findOne({ where: { id : listingId },
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName', 'email'], 
                 as: 'landlord', 
                },
            ],
        });
    
         
    
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found or does not belong to the specified landlord' });
        }
        

        if (listing.listingImage && listing.listingImage.publicId) {
            await cloudinary.uploader.destroy(listing.listingImage.publicId);
        }

        
        await listingModel.destroy({ where: { id: listingId } });

        res.status(200).json({ message: 'Listing deleted successfully', data: listing });


    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error deleting listings', error: error.message });
    }
}