const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Listing = require('./listing');
const LandlordProfile = require('./landlordprofile');
const Transaction = require('./transaction');
const Tenant = require('./tenant');
const Inspection = require('./inspection');

class Landlord extends Model {}

Landlord.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'Landlord',
    tableName: 'Landlords',
  }
);

// Define associations
Landlord.hasOne(LandlordProfile, {
  foreignKey: 'landlordId',
  as: 'landlordProfile',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Landlord.hasMany(Listing, {
  foreignKey: 'landlordId',
  as: 'listings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

LandlordProfile.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Listing.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// LandlordProfile.hasMany(Listing, {
//   foreignKey: 'landlordProfileId',
//   as: 'listings',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

// Listing.belongsTo(LandlordProfile, {
//   foreignKey: 'landlordProfileId',
//   as: 'landlordProfile',
//   onDelete: 'CASCADE',
//   onUpdate: 'CASCADE',
// });

Transaction.belongsTo(Landlord, {
  foreignKey: 'landlordId',
  as: 'landlord',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Transaction.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Removed Transaction.belongsTo(Inspection) because `inspectionId` is not defined in the Transaction model

Transaction.belongsTo(Listing, {
  foreignKey: 'listingId',
  as: 'listing',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Fixed: Corrected the foreign key in Listing.hasOne(Transaction)
Listing.hasOne(Transaction, {
  foreignKey: 'listingId', // Fixed: Use 'listingId' to match the association in Transaction.belongsTo(Listing)
  as: 'transaction', // Singular form for one-to-one relationship
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Inspection.belongsTo(Tenant, {
  foreignKey: 'tenantId',
  as: 'tenant',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Inspection.belongsTo(Listing, {
  foreignKey: 'listingId',
  as: 'listing',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Tenant.hasMany(Transaction, {
  foreignKey: 'tenantId',
  as: 'transactions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Tenant.hasMany(Inspection, {
  foreignKey: 'tenantId',
  as: 'inspections',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = Landlord;





