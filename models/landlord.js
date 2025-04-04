const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Listing = require('./listing');

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
    username: {
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
    isSuperAdmin: {
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

Landlord.hasMany(Listing, {
  foreignKey: 'landlordId', // This should match the foreign key in the Listing model
  as: 'listings', // Alias for the association (changed to lowercase for consistency)
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

Listing.belongsTo(Landlord, {
  foreignKey: 'landlordId', // Correct foreign key referencing the landlordId in the Listing model
  as: 'landlord', // Alias for the association
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

module.exports = Landlord;