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
 * /api/v1/createlisting/{landlordId}:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new property listing
 *     description: Allows a verified landlord to create a new property listing with details and images.
 *     security:
 *       - bearerAuth: []
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
 *                 enum: ["Houses", "Apartments"]
 *                 description: The type of the property
 *                 example: "Apartments"
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
 *               minrent:
 *                 type: string
 *                 enum: ["500000", "600000", "700000", "800000", "900000", "1000000"]
 *                 description: Minimum rent price
 *                 example: "500000"
 *               maxrent:
 *                 type: string
 *                 enum: ["1000000", "2000000", "3000000", "4000000", "5000000"]
 *                 description: Maximum rent price
 *                 example: "2000000"
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
 *               description:
 *                 type: string
 *                 description: A description of the property
 *                 example: "A beautiful 3-bedroom apartment in the heart of Lagos."
 *               listingImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 8 images of the property
 *     responses:
 *       201:
 *         description: Listing created successfully
 *       400:
 *         description: Bad request, missing or invalid fields
 *       404:
 *         description: Landlord not found
 *       500:
 *         description: Internal server error
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
 *         description: Internal server error while fetching listings
 */
router.get('/getAllListings', getAllListings);

/**
 * @swagger
 * /api/v1/getOneListingByLandlord/{listingId}:
 *   get:
 *     summary: Get a specific listing owned by a landlord
 *     description: Retrieves a single listing based on the landlord's ID and the listing's ID. Requires authentication.
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: ID of the landlord who owns the listing
 *         schema:
 *           type: string
 *         example: "123456"
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
 *         description: Internal server error
 */
router.get('/getOneListingByLandlord/:listingId', landlordAuthenticate, getOneListingByLandlord);

/**
 * @swagger
 * /api/v1/getOneListing/{listingId}:
 *   get:
 *     summary: Get a single listing by listing ID
 *     description: This endpoint retrieves a specific listing by its ID. The listing must be verified and available.
 *     tags:
 *       - Listings
  *     security: [] # No authentication required
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Internal server error
 */
router.get('/getOneListing/:listingId', getOneListing);

/**
 * @swagger
 * /api/v1/getAllListingsByLandlord:
 *   get:
 *     summary: Get all listings by a specific landlord
 *     description: Fetch all available and verified listings created by the landlord specified by `landlordId`.
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The ID of the landlord whose listings you want to retrieve.
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: A list of listings by the landlord
 *       404:
 *         description: No listings found for the given landlordId
 *       500:
 *         description: Internal server error
 */
router.get('/getAllListingsByLandlord', landlordAuthenticate, getAllListingsByLandlord);
/**
 * @swagger
 * /api/v1/updateListing/{listingId}:
 *   put:
 *     summary: Update a listing by landlord
 *     description: Allows a landlord to update the details of a specific listing.
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the listing
 *                 example: "Spacious 3-bedroom apartment for rent"
 *               type:
 *                 type: string
 *                 enum: ["Houses", "Apartments"]
 *                 description: The type of the property
 *                 example: "Apartments"
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
 *               minrent:
 *                 type: string
 *                 enum: ["500000", "600000", "700000", "800000", "900000", "1000000"]
 *                 description: Minimum rent price
 *                 example: "500000"
 *               maxrent:
 *                 type: string
 *                 enum: ["1000000", "2000000", "3000000", "4000000", "5000000"]
 *                 description: Maximum rent price
 *                 example: "2000000"
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
 *               description:
 *                 type: string
 *                 description: A description of the property
 *                 example: "A beautiful 3-bedroom apartment in the heart of Lagos."
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
 *         description: Internal server error while updating listing
 */
router.put('/updateListing/:listingId', landlordAuthenticate, upload.array('listingImage', 8), updateListing);

/**
 * @swagger
 * /api/v1/deleteListing/{listingId}:
 *   delete:
 *     summary: Delete a listing by listing ID
 *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The ID of the landlord who owns the listing
 *         schema:
 *           type: string
 *         example: "12345"
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
 *         description: Internal server error
 */
router.delete('/deleteListing/:listingId', landlordAuthenticate, deleteListing);

/**
 * @swagger
 * /api/v1/searchListing:
 *   get:
 *     summary: Search for listings based on specific criteria
 *     description: Allows the user to search for property listings based on various filters such as locality, type, number of bedrooms, bathrooms, price range, and availability.
 *     tags:
 *       - Listings
  *     security: [] # No authentication required
 *     parameters:
 *       - name: locality
 *         in: query
 *         description: The locality of the property to search for.
 *         required: false
 *         schema:
 *           type: string
 *           example: "Victoria Island"
 *       - name: type
 *         in: query
 *         description: The type of the property (e.g., Houses, Apartments).
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["Houses", "Apartments"]
 *           example: "Apartments"
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
 *       - name: minPrice
 *         in: query
 *         description: The minimum price of the property.
 *         required: false
 *         schema:
 *           type: number
 *           example: 500000
 *       - name: maxPrice
 *         in: query
 *         description: The maximum price of the property.
 *         required: false
 *         schema:
 *           type: number
 *           example: 2000000
 *       - name: isAvailable
 *         in: query
 *         description: Filter by availability of the property.
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *     responses:
 *       200:
 *         description: A list of listings that match the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "64a8e9b7b56c8d001c9a4b2d"
 *                   title:
 *                     type: string
 *                     example: "Luxury 3-Bedroom Apartment in Lekki"
 *                   type:
 *                     type: string
 *                     example: "Apartments"
 *                   bedrooms:
 *                     type: string
 *                     example: "3"
 *                   bathrooms:
 *                     type: string
 *                     example: "2"
 *                   price:
 *                     type: number
 *                     example: 1500000
 *                   locality:
 *                     type: string
 *                     example: "Victoria Island"
 *                   isAvailable:
 *                     type: boolean
 *                     example: true
 *       404:
 *         description: No listings found for the specified criteria.
 *       500:
 *         description: Internal server error.
 */


router.get('/searchListing', searchListing);

/**
 * @swagger
 * /api/v1/getClicksbyListing/{listingId}:
 *   get:
 *     summary: Get the number of clicks/views for a specific listing
 *     description: Retrieve the number of times a specific listing has been viewed (clicked).
 *     tags:
 *       - Listings
  *     security: [] # No authentication required
 *     parameters:
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
 *         description: Internal server error while retrieving the listing clicks.
 */
router.get('/getClicksbyListing/:listingId', getClicksbyListing);

module.exports = router;