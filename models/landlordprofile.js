const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Landlord = require('./landlord'); // Correctly imported Landlord

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
    firstName: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false // Added to match the model
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    locality: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN, // Changed to BOOLEAN to match the model
      defaultValue: false // Added default value
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'LandlordProfile', // We need to choose the model name
    tableName: 'LandlordProfiles'
  },
);

// Fixed the association between Landlord and LandlordProfile
Landlord.hasOne(LandlordProfile, {
  foreignKey: 'landlordId', // Assuming LandlordProfile has a landlordId column
  as: 'Profile',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

LandlordProfile.belongsTo(Landlord, {
  foreignKey: 'landlordId', // Correct foreign key referencing the landlordId in the LandlordProfile model
  as: 'Landlord',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

module.exports = LandlordProfile;