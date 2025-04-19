const router = require('express').Router();
const {
    createListing,
    getAllListings,
    getOneListingByLandlord,
    getOneListing,
    getAllListingsByLandlord,
    updateListing,
    deleteListing,
    searchListing,
    getClicksbyListing,
} = require('../controller/listingController');
const { landlordAuthenticate, adminAuthenticate } = require('../middlewares/authentication');
const upload = require('../utils/multer');


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     landlordBearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */




/**
 * @swagger
 * /api/v1/createlisting/{landlordId}:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new property listing
 *     description: Allows a verified landlord to create a new property listing with details and images.
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The unique ID of the landlord creating the listing
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the property listing
 *                 example: "Luxury 3-Bedroom Apartment in Lekki"
 *               type:
 *                 type: string
 *                 enum: ["Bungalow", "Flat", "Duplex", "Mini-flat"]
 *                 description: The type of the property
 *                 example: "Bungalow"
 *               bedrooms:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of bedrooms
 *                 example: "3"
 *               bathrooms:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of bathrooms
 *                 example: "2"
 *               toilets:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of toilets
 *                 example: "2"
 *               state:
 *                 type: string
 *                 enum: ["Lagos"]
 *                 description: The state where the property is located
 *                 example: "Lagos"
 *               price:
 *                 type: number
 *                 description: The price of the property
 *                 example: 1500000
 *               area:
 *                 type: string
 *                 enum: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju Lekki", "Ikeja", "Ikorodu", "Lagos Island", "Mushin", "Ojo", "Shomolu", "Surulere"]
 *                 description: The area where the property is located
 *                 example: "Ikeja"
 *               street:
 *                 type: string
 *                 description: The street address of the property
 *                 example: "123 Main Street"
 *               year:
 *                 type: string
 *                 enum: ["1year", "2years", "3years+"]
 *                 description: The year of the rent of the property
 *                 example: "1year"
 *               description:
 *                 type: string
 *                 description: A description of the property
 *                 example: "A beautiful 3-bedroom apartment in the heart of Lagos."
 *               partPayment:
 *                 type: string
 *                 enum: ["10%", "20%", "30%"]
 *                 description: The part-payment percentage for the property
 *                 example: "20%"
 *               listingImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 8 images of the property
 *     responses:
 *       201:
 *         description: Listing created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing created successfully"
 *                 data:
 *                   type: object
 *                   description: Details of the created listing
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Landlord not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Landlord not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "error creating listing"
 */
router.post('/createlisting/:landlordId', landlordAuthenticate, upload.array('listingImage', 8), createListing);


/**
 * @swagger
 * /api/v1/getAllListings:
 *   get:
 *     summary: Retrieve all available and verified listings
 *     description: Fetch all listings that are verified and available for rent.
 *     tags:
 *       - Listings
  *     security: [] # No authentication required
 *     responses:
 *       200:
 *         description: A list of available and verified listings
 *       500:
 *         description: error while fetching all listings
 */
router.get('/getAllListings', getAllListings);


/**
 * @swagger
 * /api/v1/getOneListingByLandlord/{landlordId}/{listingId}:
 *   get:
 *     summary: Get a specific listing owned by a landlord
 *     description: Retrieves a single listing based on the landlord's ID and the listing's ID. Requires landlord authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The unique ID of the landlord creating the listing
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *       - name: listingId
 *         in: path
 *         required: true
 *         description: ID of the listing to retrieve
 *         schema:
 *           type: string
 *         example: "789012"
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: error while fetching listing by landlord
 */
router.get('/getOneListingByLandlord/:landlordId/:listingId', landlordAuthenticate, getOneListingByLandlord);

/**
 * @swagger
 * /api/v1/getOneListing/{listingId}:
 *   get:
 *     summary: Get a single listing by listing ID
 *     description: This endpoint retrieves a specific listing by its ID. The listing must be verified and available.
 *     tags:
 *       - Listings
 *     security: [] # No authentication required
 *     parameters:
 *       - name: listingId
 *         in: path
 *         required: true
 *         description: ID of the listing to retrieve
 *         schema:
 *           type: string
 *         example: "789012"
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: error while fetching one listing
 */
router.get('/getOneListing/:listingId', getOneListing);



/**
 * @swagger
 * /api/v1/getAllListingsByLandlord/{landlordId}:
 *   get:
 *     summary: Get all listings by a specific landlord
 *     description: Fetch all available and verified listings created by the landlord specified by `landlordId`. Requires authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The unique ID of the landlord creating the listing
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: error while fetching listing by landlord
 */
router.get('/getAllListingsByLandlord/:landlordId', landlordAuthenticate, getAllListingsByLandlord);



/**
 * @swagger
 * /api/v1/updateListing/{landlordId}/{listingId}:
 *   put:
 *     summary: Update a listing by landlord
 *     description: Allows a landlord to update the details of a specific listing. Requires landlord authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - name: listingId
 *         in: path
 *         required: true
 *         description: The ID of the listing being updated
 *         schema:
 *           type: string
 *           example: "67890"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the property listing
 *                 example: "Luxury 3-Bedroom Apartment in Lekki"
 *               type:
 *                 type: string
 *                 enum: ["Bungalow", "Flat", "Duplex", "Mini-flat"]
 *                 description: The type of the property
 *                 example: "Flat"
 *               bedrooms:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of bedrooms
 *                 example: "3"
 *               bathrooms:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of bathrooms
 *                 example: "2"
 *               toilets:
 *                 type: string
 *                 enum: ["1", "2", "3", "4", "5+"]
 *                 description: Number of toilets
 *                 example: "2"
 *               state:
 *                 type: string
 *                 enum: ["Lagos"]
 *                 description: The state where the property is located
 *                 example: "Lagos"
 *               price:
 *                 type: number
 *                 description: The price of the property
 *                 example: 1500000
 *               area:
 *                 type: string
 *                 enum: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju Lekki", "Ikeja", "Ikorodu", "Lagos Island", "Mushin", "Ojo", "Shomolu", "Surulere"]
 *                 description: The area where the property is located
 *                 example: "Ikeja"
 *               street:
 *                 type: string
 *                 description: The street address of the property
 *                 example: "123 Main Street"
 *               year:
 *                 type: string
 *                 enum: ["1year", "2years", "3years+"]
 *                 description: The year of the rent of the property
 *                 example: "1year"
 *               description:
 *                 type: string
 *                 description: A description of the property
 *                 example: "A beautiful 3-bedroom apartment in the heart of Lagos."
 *               partPayment:
 *                 type: string
 *                 enum: ["10%", "20%", "30%"]
 *                 description: The part-payment percentage for the property
 *                 example: "20%"
 *               listingImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 8 images of the property
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *       404:
 *         description: Listing or landlord not found
 *       500:
 *         description: error while updating listing
 */
router.put('/updateListing/:landlordId/:listingId', landlordAuthenticate, upload.array('listingImage', 8), updateListing);



/**
 * @swagger
 * /api/v1/deleteListing/{landlordId}/{listingId}:
 *   delete:
 *     summary: Delete a listing by listing ID
 *     description: Allows a landlord to delete the details of a specific listing. Requires landlord authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - name: listingId
 *         in: path
 *         required: true
 *         description: The ID of the listing to be deleted
 *         schema:
 *           type: string
 *         example: "67890"
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *       404:
 *         description: Listing not found or does not belong to the specified landlord
 *       500:
 *         description: error while deleting listing
 */
router.delete('/deleteListing/:landlordId/:listingId', landlordAuthenticate, deleteListing);



/**
 * @swagger
 * /api/v1/searchListing:
 *   get:
 *     summary: Search for listings based on specific criteria
 *     description: Allows users to search for property listings based on various filters such as locality, type, number of bedrooms, bathrooms, price range, and availability. At least one search criterion must be provided.
 *     tags:
 *       - Listings
 *     security: [] # No authentication required
 *     parameters:
 *       - name: area
 *         in: query
 *         description: The locality of the property to search for.
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry", "Epe", "Eti-Osa", "Ibeju Lekki", "Ikeja", "Ikorodu", "Lagos Island", "Mushin", "Ojo", "Shomolu", "Surulere"]
 *           example: "Ikeja"
 *       - name: type
 *         in: query
 *         description: The type of the property.
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["Bungalow", "Flat", "Duplex", "Mini-flat"]
 *           example: "Flat"
 *       - name: bedrooms
 *         in: query
 *         description: The number of bedrooms in the property.
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["1", "2", "3", "4", "5+"]
 *           example: "3"
 *       - name: bathrooms
 *         in: query
 *         description: The number of bathrooms in the property.
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["1", "2", "3", "4", "5+"]
 *           example: "2"
 *     responses:
 *       200:
 *         description: A list of listings that match the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listings for the specified criteria"
 *                 total:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "64a8e9b7b56c8d001c9a4b2d"
 *                       title:
 *                         type: string
 *                         example: "Luxury 3-Bedroom Apartment in Lekki"
 *                       type:
 *                         type: string
 *                         example: "Flat"
 *                       bedrooms:
 *                         type: string
 *                         example: "3"
 *                       bathrooms:
 *                         type: string
 *                         example: "2"
 *                       price:
 *                         type: number
 *                         example: 150000
 *                       area:
 *                         type: string
 *                         example: "Ikeja"
 *                       isAvailable:
 *                         type: boolean
 *                         example: true
 *       400:
 *         description: No search criteria provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please provide at least one search criterion"
 *       404:
 *         description: No listings found for the specified criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No listings found for the specified criteria"
 *       500:
 *         description: Error while searching for listings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error while searching for listings"
 */
router.get('/searchListing', searchListing);


/**
 * @swagger
 * /api/v1/getClicksbyListing/{landlordId}/{listingId}:
 *   get:
 *     summary: Get the number of clicks/views for a specific listing
 *     description: Retrieve the number of times a specific listing has been viewed (clicked). Requires landlord authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - landlordBearerAuth: [] # Requires landlord authentication
 *     parameters:
 *       - in: path
 *         name: landlordId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the landlord creating the profile.
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *       - name: listingId
 *         in: path
 *         required: true
 *         description: The ID of the listing to retrieve the click count for.
 *         schema:
 *           type: string
 *           example: "64a8e9b7b56c8d001c9a4b2d"
 *     responses:
 *       200:
 *         description: Successfully retrieved the number of clicks for the listing.
 *       404:
 *         description: Listing not found.
 *       500:
 *         description: error while fetching clicks for the listing.
 */
router.get('/getClicksbyListing/:landlordId/:listingId', landlordAuthenticate, getClicksbyListing);

module.exports = router;