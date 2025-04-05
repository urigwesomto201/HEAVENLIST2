const router  = require('express').Router()
const { createListing, getAllListings, getOneListingByLandlord,getOneListing, getAllListingsByLandlord,
    updateListing,deleteListing, searchListing,getClicksbyListing} = require('../controller/listingController')
const { landlordAuthenticate, adminAuthenticate } = require('../middlewares/authentication')

const upload = require('../utils/multer')

/**
 * @swagger
 * /api/v1/createlisting/{landlordId}:
 *   post:
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
 *               location:
 *                 type: string
 *                 description: The location of the property
 *                 example: "Lekki, Lagos"
 *               title:
 *                 type: string
 *                 description: The title of the property listing
 *                 example: "Luxury 3-Bedroom Apartment in Lekki"
 *               category:
 *                 type: string
 *                 description: The category of the listing (e.g., apartment, house, office space)
 *                 example: "Apartment"
 *               bedrooms:
 *                 type: integer
 *                 description: The number of bedrooms in the property
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 description: The number of bathrooms in the property
 *                 example: 2
 *               price:
 *                 type: number
 *                 description: The price of the property in USD
 *                 example: 500000
 *               size:
 *                 type: number
 *                 description: The size of the property in square feet
 *                 example: 2000
 *               locality:
 *                 type: string
 *                 description: The locality/area where the property is located
 *                 example: "Victoria Island"
 *               area:
 *                 type: string
 *                 description: The specific area or landmark near the property
 *                 example: "Near Landmark Beach"
 *               type:
 *                 type: string
 *                 description: The type of listing (e.g., rent, sale)
 *                 example: "Rent"
 *               minrent:
 *                 type: number
 *                 description: The minimum rent price if applicable
 *                 example: 2000
 *               maxrent:
 *                 type: number
 *                 description: The maximum rent price if applicable
 *                 example: 3000
 *               description:
 *                 type: string
 *                 description: A detailed description of the property
 *                 example: "A beautiful and modern 3-bedroom apartment with ocean views."
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
 *                   example: "listing created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "65c7e8f7a12b34001b3d2c4e"
 *                     location:
 *                       type: string
 *                       example: "Lekki, Lagos"
 *                     title:
 *                       type: string
 *                       example: "Luxury 3-Bedroom Apartment in Lekki"
 *                     category:
 *                       type: string
 *                       example: "Apartment"
 *                     bedrooms:
 *                       type: integer
 *                       example: 3
 *                     bathrooms:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 500000
 *                     size:
 *                       type: number
 *                       example: 2000
 *                     locality:
 *                       type: string
 *                       example: "Victoria Island"
 *                     area:
 *                       type: string
 *                       example: "Near Landmark Beach"
 *                     type:
 *                       type: string
 *                       example: "Rent"
 *                     minrent:
 *                       type: number
 *                       example: 2000
 *                     maxrent:
 *                       type: number
 *                       example: 3000
 *                     description:
 *                       type: string
 *                       example: "A beautiful and modern 3-bedroom apartment with ocean views."
 *                     listingImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: "https://res.cloudinary.com/dummy/image/upload/v1234567890/sample.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "sample_image_1234"
 *                     landlordId:
 *                       type: string
 *                       example: "64a8e9b7b56c8d001c9a4b2d"
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     isAvailable:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Bad request, missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Please input correct fields"
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
 *                   example: "Error creating listing"
 */

router.post('/createlisting/:landlordId',landlordAuthenticate, upload.array('listingImage', 8), createListing )

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: find all Listing below
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       location:
 *                         type: string
 *                         example: "Downtown, New York"
 *                       title:
 *                         type: string
 *                         example: "Luxury Apartment"
 *                       category:
 *                         type: string
 *                         example: "Apartment"
 *                       bedrooms:
 *                         type: integer
 *                         example: 3
 *                       bathrooms:
 *                         type: integer
 *                         example: 2
 *                       price:
 *                         type: number
 *                         example: 2500.00
 *                       size:
 *                         type: string
 *                         example: "1500 sqft"
 *                       locality:
 *                         type: string
 *                         example: "Manhattan"
 *                       area:
 *                         type: string
 *                         example: "Times Square"
 *                       type:
 *                         type: string
 *                         example: "Rent"
 *                       description:
 *                         type: string
 *                         example: "A beautiful 3-bedroom luxury apartment in downtown New York."
 *                       listingImage:
 *                         type: object
 *                         properties:
 *                           imageUrl:
 *                             type: string
 *                             example: "https://cloudinary.com/sample-image.jpg"
 *                           publicId:
 *                             type: string
 *                             example: "sample-public-id"
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       isAvailable:
 *                         type: boolean
 *                         example: true
 *                       landlord:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           fullName:
 *                             type: string
 *                             example: "John Doe"
 *       500:
 *         description: Internal server error while fetching listings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching listings
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

router.get('/getAllListings', getAllListings)

/**
 * @swagger
 * /api/v1/getOneListingByLandlord/{landlordId}/{listingId}:
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "789012"
 *                     title:
 *                       type: string
 *                       example: "Luxury 2-bedroom apartment"
 *                     location:
 *                       type: string
 *                       example: "New York, NY"
 *                     category:
 *                       type: string
 *                       example: "Apartment"
 *                     bedrooms:
 *                       type: integer
 *                       example: 2
 *                     bathrooms:
 *                       type: integer
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 1500.0
 *                     size:
 *                       type: string
 *                       example: "1200 sqft"
 *                     locality:
 *                       type: string
 *                       example: "Downtown"
 *                     area:
 *                       type: string
 *                       example: "Manhattan"
 *                     type:
 *                       type: string
 *                       example: "For Rent"
 *                     description:
 *                       type: string
 *                       example: "A spacious and luxurious 2-bedroom apartment in the heart of the city."
 *                     listingImage:
 *                       type: object
 *                       properties:
 *                         imageUrl:
 *                           type: string
 *                           example: "https://res.cloudinary.com/example/image/upload/sample.jpg"
 *                         publicId:
 *                           type: string
 *                           example: "listing12345"
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request (Invalid landlordId or listingId format)
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Listing not found
 *       500:
 *         description: Internal server error
 */

router.get('/getOneListingByLandlord/:landlordId/:listingId',landlordAuthenticate, getOneListingByLandlord)

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
 *         description: The ID of the listing to fetch
 *         schema:
 *           type: string
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Listing retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "find listing by id below"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     location:
 *                       type: string
 *                       example: "Lagos, Nigeria"
 *                     title:
 *                       type: string
 *                       example: "Luxury Apartment for Rent"
 *                     price:
 *                       type: number
 *                       example: 1200
 *                     bedrooms:
 *                       type: integer
 *                       example: 3
 *                     bathrooms:
 *                       type: integer
 *                       example: 2
 *                     description:
 *                       type: string
 *                       example: "A beautiful 3-bedroom apartment with a scenic view and modern amenities."
 *                     landlord:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "landlordId123"
 *                         fullName:
 *                           type: string
 *                           example: "John Doe"
 *       400:
 *         description: listingId is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "listingId is required"
 *       404:
 *         description: Listing not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching listing"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */

router.get('/getOneListing/:listingId', getOneListing)

/**
 * @swagger
 * /api/v1/getAllListingsByLandlord/{landlordId}:
 *   get:
 *     summary: Get all listings by a specific landlord
 *     description: Fetch all available and verified listings created by the landlord specified by `landlordId`.
  *     tags:
 *       - Listings
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The ID of the landlord whose listings you want to retrieve.
 *         schema:
 *           type: string
 *           example: 12345
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of listings by the landlord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "find all Listing by one landlord below"
 *                 total:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 101
 *                       location:
 *                         type: string
 *                         example: "Lagos, Nigeria"
 *                       title:
 *                         type: string
 *                         example: "3 Bedroom Apartment for Rent"
 *                       price:
 *                         type: integer
 *                         example: 2000000
 *                       size:
 *                         type: string
 *                         example: "1200 sqft"
 *                       isVerified:
 *                         type: boolean
 *                         example: true
 *                       isAvailable:
 *                         type: boolean
 *                         example: true
 *                       landlord:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 12345
 *                           fullName:
 *                             type: string
 *                             example: "John Doe"
 *       400:
 *         description: Bad Request - Missing or invalid landlordId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "landlordId is required"
 *       404:
 *         description: No listings found for the given landlordId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No listings found for this landlord"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching listing"
 */

router.get('/getAllListingsByLandlord/:landlordId',landlordAuthenticate, getAllListingsByLandlord)

/**
 * @swagger
 * /api/v1/updateListing/{landlordId}/{listingId}:
 *   put:
 *     summary: Update a listing by landlord
  *     tags:
 *       - Listings
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: landlordId
 *         in: path
 *         required: true
 *         description: The ID of the landlord updating the listing
 *         schema:
 *           type: string
 *           example: "12345"
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
 *               location:
 *                 type: string
 *                 description: The location of the property
 *                 example: "Lagos"
 *               title:
 *                 type: string
 *                 description: The title of the listing
 *                 example: "Spacious 3-bedroom apartment for rent"
 *               category:
 *                 type: string
 *                 description: The category of the property
 *                 example: "Apartment"
 *               bedrooms:
 *                 type: integer
 *                 description: The number of bedrooms in the listing
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 description: The number of bathrooms in the listing
 *                 example: 2
 *               price:
 *                 type: number
 *                 format: float
 *                 description: The price of the listing
 *                 example: 1500.00
 *               size:
 *                 type: number
 *                 format: float
 *                 description: The size of the property in square meters
 *                 example: 120.5
 *               locality:
 *                 type: string
 *                 description: The specific locality or neighborhood of the property
 *                 example: "Ikeja"
 *               area:
 *                 type: string
 *                 description: The broader area of the property
 *                 example: "Lagos Mainland"
 *               type:
 *                 type: string
 *                 description: The type of property
 *                 example: "Residential"
 *               description:
 *                 type: string
 *                 description: A brief description of the property
 *                 example: "A modern apartment located in a prime area with easy access to amenities."
 *     responses:
 *       200:
 *         description: Listing updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing updated successfully"
 *                 data:
 *                   type: object
 *                   description: The updated listing details
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "67890"
 *                     location:
 *                       type: string
 *                       example: "Lagos"
 *                     title:
 *                       type: string
 *                       example: "Spacious 3-bedroom apartment for rent"
 *                     price:
 *                       type: number
 *                       example: 1500.00
 *                     bedrooms:
 *                       type: integer
 *                       example: 3
 *                     bathrooms:
 *                       type: integer
 *                       example: 2
 *                     landlordId:
 *                       type: string
 *                       example: "12345"
 *       400:
 *         description: Bad request, required fields missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "listingId or landlordId is required"
 *       404:
 *         description: Listing or landlord not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing not found or does not belong to the specified landlord"
 *       500:
 *         description: Internal server error while updating listing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating listings"
 *       401:
 *         description: Unauthorized, invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */

router.put('/updateListing/:landlordId/:listingId',landlordAuthenticate,upload.array('listingImage', 8), updateListing)

/**
 * @swagger
 * /api/v1/deleteListing/{landlordId}/{listingId}:
 *   delete:
 *     summary: Delete a listing by landlord ID and listing ID
  *     tags:
 *       - Listings
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listing deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "67890"
 *                     location:
 *                       type: string
 *                       example: "Lagos, Nigeria"
 *                     title:
 *                       type: string
 *                       example: "Spacious 2-Bedroom Apartment"
 *                     price:
 *                       type: number
 *                       example: 250000
 *                     description:
 *                       type: string
 *                       example: "A spacious 2-bedroom apartment in a serene environment."
 *       400:
 *         description: Missing required fields (landlordId or listingId)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "listingId is required"
 *       404:
 *         description: Listing not found or does not belong to the specified landlord
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing not found or does not belong to the specified landlord"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting listings"
 */

router.delete('/deleteListing/:landlordId/:listingId',landlordAuthenticate, deleteListing)


/**
 * @swagger
 * /api/v1/searchListing:
 *   get:
 *     summary: Search for listings based on specific criteria
 *     description: Allows the user to search for property listings based on various filters like locality, type, number of bedrooms, and rent range.
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
 *         description: The type of property (e.g., apartment, house).
 *         required: false
 *         schema:
 *           type: string
 *           example: "Apartment"
 *       - name: bedrooms
 *         in: query
 *         description: The number of bedrooms in the property.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 3
 *       - name: minrent
 *         in: query
 *         description: The minimum rent for the property.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 50000
 *       - name: maxrent
 *         in: query
 *         description: The maximum rent for the property.
 *         required: false
 *         schema:
 *           type: integer
 *           example: 200000
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
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Beautiful 3-Bedroom Apartment"
 *                       price:
 *                         type: integer
 *                         example: 150000
 *                       location:
 *                         type: string
 *                         example: "Victoria Island"
 *                       landlord:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 101
 *                           fullName:
 *                             type: string
 *                             example: "John Doe"
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
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting listings by criteria"
 */

router.get('/searchListing', searchListing)


/**
 * @swagger
 * /api/v1/getClicksbyListing/{listingId}:
 *   get:
 *     summary: Get the number of clicks/views for a specific listing
 *     description: Retrieve the number of times a specific listing has been viewed (clicked).
 *     tags:
 *       - Listings
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Find views by listing below"
 *                 views:
 *                   type: integer
 *                   example: 15
 *                 listing:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "64a8e9b7b56c8d001c9a4b2d"
 *                     title:
 *                       type: string
 *                       example: "Luxury 3-Bedroom Apartment in Lekki"
 *                     price:
 *                       type: number
 *                       example: 500000
 *                     description:
 *                       type: string
 *                       example: "A beautiful and modern 3-bedroom apartment with ocean views."
 *                     area:
 *                       type: string
 *                       example: "Lekki Phase 1"
 *                     isClicked:
 *                       type: integer
 *                       example: 15
 *       400:
 *         description: Bad request, listingId is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "listingId is required"
 *       404:
 *         description: Listing not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listing not found"
 *       500:
 *         description: Internal server error while retrieving the listing clicks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error getting clicks by listing"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */



router.get('/getClicksbyListing/:listingId', getClicksbyListing)






module.exports = router


