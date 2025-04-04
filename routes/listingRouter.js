const router  = require('express').Router()
const { createListing, getAllListings, getOneListingByLandlord,getOneListing, getAllListingsByLandlord,
    updateListing,deleteListing, searchListing} = require('../controller/listingController')
const { landlordAuthenticate, adminAuthenticate } = require('../middlewares/authentication')

const upload = require('../utils/multer')


router.post('/createlisting/:landlordId',landlordAuthenticate, upload.array('listingImage', 8), createListing )

router.get('/getAllListings', getAllListings)

router.get('/getOneListingByLandlord/:landlordId/:listingId',landlordAuthenticate, getOneListingByLandlord)

router.get('/getOneListing/:listingId', getOneListing)

router.get('/getAllListingsByLandlord/:landlordId',landlordAuthenticate, getAllListingsByLandlord)

router.put('/updateListing/:landlordId/:listingId',landlordAuthenticate,upload.array('listingImage', 8), updateListing)

router.delete('/deleteListing/:landlordId/:listingId',landlordAuthenticate, deleteListing)

router.get('/searchListing', searchListing)






module.exports = router


// upload.array('photos', 12)
