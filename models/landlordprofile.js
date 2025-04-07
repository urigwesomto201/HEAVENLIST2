const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Landlord = require('./landlord'); // Correctly imported Landlord
const Listing = require('./listing');

class LandlordProfile extends Model {}

LandlordProfile.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
      
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    isVerified: {
      type: DataTypes.BOOLEAN, // Changed to BOOLEAN to match the model
      defaultValue: false // Added default value
    },
    landlordId: {
      type: DataTypes.UUID,
      references: {
        model: Landlord,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'LandlordProfile', // We need to choose the model name
    tableName: 'LandlordProfiles'
  },
);

// Define associations after all models are initialized



module.exports = LandlordProfile;