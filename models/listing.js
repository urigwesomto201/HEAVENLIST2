const { Sequelize, DataTypes, Model } = require('sequelize'); // Ensure Sequelize and DataTypes are imported
const sequelize = require('../database/sequelize'); // Import the sequelize instance
const Landlord = require('./landlord'); // Import the Landlord model

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
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.ENUM('Houses', 'Apartments'),
      allowNull: false
    },
    bedrooms: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'),
      allowNull: false
    },
    bathrooms: {
      type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'),
      allowNull: false
    },
    minrent: {
      type: DataTypes.ENUM('500000','600000','700000','800000','900000','1000000'),
      allowNull: false
    },
    maxrent: {
      type: DataTypes.ENUM('1000000','2000000','3000000','4000000','5000000'),
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    locality: {
      type: DataTypes.ENUM(
        'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo Odofin',
        'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju Lekki', 'Ikeja', 'Ikorodu',
        'Lagos Island', 'Mushin', 'Ojo', 'Shomolu', 'Surulere'
      ),
      allowNull: false
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    listingImage: {
      type: DataTypes.JSON, // JSON can store arrays of objects
      allowNull: false,
      defaultValue: [] // Default to an empty array
    },
    landlordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Landlord, // Reference the Landlord model directly
        key: 'id' // Ensure this matches the primary key in the Landlord model
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  },
  {
    // Other model options go here
    sequelize, // Pass the connection instance
    modelName: 'Listing', // Define the model name
    tableName: 'Listings' // Define the table name
  },
);


module.exports = Listing;