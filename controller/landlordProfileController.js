const adminModel = require('../models/admin')
const userModel = require('../models/user')
const tenantModel = require('../models/tenant')
const listingModel = require('../models/listing')
const landlordModel = require('../models/landlord')


exports.createLandlordProfile = async (req, res) => {
    try {
        const {landlordId} = req.landlordId

        

        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error creating profile', error: error.message });
    }
}