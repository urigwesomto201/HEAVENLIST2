const { Sequelize, DataTypes, Model } = require('sequelize'); // Ensure Sequelize and DataTypes are imported
const sequelize = require('../database/sequelize'); // Import the sequelize instance
const Landlord = require('./landlord'); // Import the Landlord model
const LandlordProfile = require('./landlordprofile'); // Import 
const Transaction = require('./transaction');

class Inspection extends Model {}

Inspection.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
    },
    timeRange: {
      type: DataTypes.ENUM('10am-4pm'),
      allowNull: false
    },
    days: {
      type: DataTypes.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'confirmed', 'cancelled'),
      defaultValue: 'scheduled'
    },
    landlordId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Landlords', // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tenantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Tenants', // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Listings', // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    // Other model options go here
    sequelize, // Pass the connection instance
    modelName: 'Inspection', // Define the model name
    tableName: 'Inspections' // Define the table name
  },
);




module.exports = Inspection;

