const router  = require('express').Router()
const { createListing, getAllListings, getOneListingByLandlord,getOneListing, getAllListingsByLandlord, updateListing,deleteListing } = require('../controller/listingController')
const { landlordAuthenticate } = require('../middlewares/authentication')

const upload = require('../utils/multer')


router.post('/createlisting/:landlordId',landlordAuthenticate, upload.single('listingImage'), createListing )

router.get('/getAllListings', getAllListings)

router.get('/getOneListingByLandlord/:landlordId/:listingId',landlordAuthenticate, getOneListingByLandlord)

router.get('/getOneListing/:listingId', getOneListing)

router.get('/getAllListingsByLandlord/:landlordId',landlordAuthenticate, getAllListingsByLandlord)

router.put('/updateListing/:landlordId/:listingId',landlordAuthenticate,upload.single('listingImage'), updateListing)

router.delete('/deleteListing/:landlordId/:listingId',landlordAuthenticate, deleteListing)



module.exports = router
