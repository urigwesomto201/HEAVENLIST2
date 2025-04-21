const { Sequelize, DataTypes, Model } = require('sequelize'); // Ensure Sequelize and DataTypes are imported
const sequelize = require('../database/sequelize'); // Import the sequelize instance
const Landlord = require('./landlord'); // Import the Landlord model
const LandlordProfile = require('./landlordprofile'); // Import 
const Inspection = require('./inspection');
const Transaction = require('./transaction');

class Listing extends Model {}

Listing.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Bungalow','Flat','Duplex','Mini-flat')
  
    },
    bedrooms: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5+')
    
    },
    bathrooms: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5+')
      
    },
    toilets: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5+')
      
    },
    state: {
      type: DataTypes.ENUM('Lagos')
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    area: {
      type: DataTypes.ENUM(
        'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo Odofin',
        'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju Lekki', 'Ikeja', 'Ikorodu',
        'Lagos Island', 'Mushin', 'Ojo', 'Shomolu', 'Surulere'
      ),
      allowNull: false
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    year: {
      type: DataTypes.ENUM('1year', '2years', '3years+'),
      allowNull: false
    },
    isClicked: {
      type: DataTypes.INTEGER, 
      defaultValue: 0
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
    partPayment: {
      type: DataTypes.ENUM('10%', '20%', '30%'),
      allowNull: false 
    },
    partPaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0
    },

    // listingImage: {
    //   // type: DataTypes.JSON, // JSON can store arrays of objects
    //   type: DataTypes.TEXT('long'), // JSON can store arrays of objects
    //   allowNull: false
    // },
    listingImage: {
      type: DataTypes.TEXT,
      allowNull: false, // No default value, can be null
      get() {
        const raw = this.getDataValue('listingImage');
        try {
          return raw ? JSON.parse(raw) : [];
        } catch (e) {
          return []; // fallback if somehow stored invalid JSON
        }
      },
      set(value) {
      this.setDataValue('listingImage', JSON.stringify(value));
      }
    },
    landlordId: {
      type: DataTypes.UUID,
      references: {
        model: Landlord, // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    // Other model options go here
    sequelize, // Pass the connection instance
    modelName: 'Listing', // Define the model name
    tableName: 'Listings' // Define the table name
  },
);

// LandlordProfile.hasMany(Listing, {
//   foreignKey: 'landlordId', // Ensure this matches the actual column name in the `listings` table
//   as: 'listings', 
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE'// Alias for the relationship
// });

// Listing.belongsTo(LandlordProfile, {
//   foreignKey: 'landlordId', // Ensure this matches the actual column name in the `listings` table
//   as: 'landlordProfile',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE' // Alias for the relationship
// });




// Listing.belongsTo(Inspection, {
//   foreignKey: 'ListingId',
//   as: 'landlord', // Plural form for one-to-many relationship
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE'
// });

module.exports = Listing;

