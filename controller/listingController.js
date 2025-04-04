const { Sequelize, DataTypes, Model } = require('sequelize');
const listingModel = require('../models/listing')
const cloudinary = require('../database/cloudinary')
const landlordModel = require('../models/landlord')
const { Op } = require('sequelize')

const fs = require('fs')


exports.createListing = async (req, res) => {
    try {
        const { landlordId } = req.params
        const { title, type, bedrooms,bathrooms,price,toilets,
            state,area,description, minrent, maxrent, street
         } = req.body



        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const landlord = await landlordModel.findOne({ where: { id : landlordId } })

        if (!landlord) {
            return res.status(404).json({ message: 'Landlord not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one listing image is required.' });
        }

        const result = await cloudinary.uploader.upload(req.files[0].path)

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
            listingImage: {
                imageUrl: result.secure_url,
                publicId: result.public_id
            },
            landlordId: landlordId,
            isVerified: false,
            isAvailable: false,
            isClicked: 0,
            
            
        })

        res.status(201).json({message: 'listing created successfully', data: newListing})

    } catch (error) {
       
        res.status(500).json({ message: 'Error creating listing',  }+ error.message)
         
    }
}




exports.getAllListings = async (req, res) => {
    try {
        
        const listings = await listingModel.findAll({
            where: {isVerified: true, isAvailable: true},
            include: [
                {
                model: landlordModel,
                attributes: ['id', 'fullName'], 
                as: 'landlords', 
                },
            ],
        });

        res.status(200).json({message: 'find all Listing below', total: listings.length, data: listings})

    } catch (error) {
       
        res.status(500).json({ message: 'Error fetching listings',  }+ error.message)
    }
}




exports.getOneListingByLandlord= async (req, res) => {
    try {
        const {landlordId} = req.params

        const { listingId } = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }
        if(!landlordId) {
            return res.status(400).json({message: 'landlordId is required'})
        }

        const listing = await listingModel.findOne({
            where: { id: listingId, landlordId}, 
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlords', 
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
            where: { id: listingId, isAvailable:true, isVerified:true },
            include: [
                {
                    model: landlordModel,
                    attributes: ['id', 'fullName'], 
                    as: 'landlords', 
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
      
        res.status(500).json({ message: 'Error fetching listing',  }+ error.message )
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
                attributes: ['id', 'fullName'], 
                 as: 'landlords', 
                },
            ],
        });
            
        if (listings.length === 0) {
            return res.status(404).json({ message: 'No listings found for this landlord' });
        }

        res.status(200).json({message: 'find all Listing by one landlord below', total: listings.length, data: listings})

        
    } catch (error) {
        console.error(error.message)
        res.status(500).json({ message: 'Error fetching listing',  }+error.message)
    }
}





exports.updateListing = async (req, res) => {
    try {
        const {landlordId} = req.params

        const { listingId } = req.params


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

       
        if (req.files) {
            if (listing.listingImage && listing.listingImage.publicId) {
                await cloudinary.uploader.destroy(listing.listingImage.publicId);
            }

            const result = await cloudinary.uploader.upload(req.files[0].path);
            updatedImage = {
                imageUrl: result.secure_url,
                publicId: result.public_id,
            };
        }

        await listingModel.update(
            {
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
            listingImage: updatedImage,
            },
            { where: { id: listingId, landlordId } } 
        );

       
        const updatedListing = await listingModel.findOne({ where: { id: listingId, landlordId },
        include: [
            {
            model: landlordModel,
            attributes: ['id', 'fullName'], 
             as: 'landlords', 
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
        const {landlordId} = req.params
        const { listingId } = req.params

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
                attributes: ['id', 'fullName'], 
                 as: 'landlords', 
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
        res.status(500).json({ message: 'Error deleting listings', }+error.message);
    }
}





exports.searchListing = async (req, res) => {
    try {
        const { area, type, bedrooms, minrent, maxrent } = req.body;

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
                isVerified: true,
            },
            include: [
                {
                    model: landlordModel, 
                    attributes: ['id', 'fullName'], 
                    as: 'landlords', 
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
        const { listingId } = req.params

        if(!listingId) {
            return res.status(400).json({message: 'listingId is required'})
        }

        const listing = await listingModel.findOne({ where: { id : listingId, isAvailable:true, isVerified:true },
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
