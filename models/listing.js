const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
// const Post = require('./post');
const Landlord = require('./landlord');


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
    price: {
      type: DataTypes.INTEGER,
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
    isVerifiedConfirmation: {
      type: DataTypes.ENUM('not-verified', 'verified'), // Changed to ENUM
      defaultValue: 'not-verified', // Default value for ENUM
      allowNull: false
    },
    listingImage: {
      type: DataTypes.JSON, // Changed to JSON to store an array of objects
      allowNull: false,
      defaultValue: [], // Default to an empty array
    },
    landlordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Landlords',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Listing', // We need to choose the model name
    tableName: 'Listings'
  },
);



module.exports = Listing
