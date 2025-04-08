const { Sequelize, DataTypes, Model } = require('sequelize'); // Ensure Sequelize and DataTypes are imported
const sequelize = require('../database/sequelize'); // Import the sequelize instance
const Landlord = require('./landlord'); // Import the Landlord model
const LandlordProfile = require('./landlordprofile'); // Import 


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
      type: DataTypes.ENUM('Houses', 'Apartments')
  
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
    minrent: {
      type: DataTypes.ENUM('500000','600000','700000','800000','900000','1000000')
    
    },
    maxrent: {
      type: DataTypes.ENUM('1000000','2000000','3000000','4000000','5000000')
      
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
    isClicked: {
      type: DataTypes.INTEGER, 
      defaultValue: 0
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
      // type: DataTypes.TEXT('long'), // JSON can store arrays of objects
      allowNull: false
    },
    landlordId: {
      type: DataTypes.UUID,
      references: {
        model: 'Landlord',
        key: 'id'
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

LandlordProfile.hasMany(Listing, {
  foreignKey: 'landlordId', // Ensure this matches the actual column name in the `listings` table
  as: 'listings', 
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'// Alias for the relationship
});

Listing.belongsTo(LandlordProfile, {
  foreignKey: 'landlordId', // Ensure this matches the actual column name in the `listings` table
  as: 'landlordProfile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE' // Alias for the relationship
});

module.exports = Listing;