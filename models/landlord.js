const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Listing = require('./listing');
const LandlordProfile = require('./landlordprofile');

class Landlord extends Model {}

Landlord.init(
  {
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
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  },
  {
    sequelize,
    modelName: 'Landlord',
    tableName: 'Landlords'
  },
);

// Define associations after all models are initialized
Landlord.hasOne(LandlordProfile, {
  foreignKey: 'landlordId',
  as: 'landlordProfile', // Singular form for one-to-one relationship
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Landlord.hasMany(Listing, {
  foreignKey: 'landlordId',
  as: 'listings', // Plural form for one-to-many relationship
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

LandlordProfile.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord', // Singular form for consistency
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Listing.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord', // Singular form for consistency
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});




module.exports = Landlord;