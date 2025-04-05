const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Listing = require('./listing');
const LandlordProfile = require('./landlordprofile');

class Landlord extends Model {}

Landlord.init(
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
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN, // Changed from STRING to BOOLEAN
      defaultValue: false 
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN, // Changed from STRING to BOOLEAN
      defaultValue: false 
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Landlord', // We need to choose the model name
    tableName: 'Landlords'
  },
);

Landlord.hasOne(LandlordProfile, {
  foreignKey: 'landlordId',
  as: 'landlordProfiles',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Landlord.hasMany(Listing, {
  foreignKey: 'landlordId',
  as: 'listings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
LandlordProfile.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlords',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Listing.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlords',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
// LandlordProfile.hasMany(Listing, {
//   foreignKey: 'landlordProfileId',
//   as: 'listings',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE'
// });
// Listing.belongsTo(LandlordProfile, {
//   foreignKey: 'listingId',
//   as: 'landlordProfiles',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE'
// });

module.exports = Landlord;

