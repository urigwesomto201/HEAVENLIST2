const { Sequelize, DataTypes, Model } = require('sequelize'); // Ensure Sequelize and DataTypes are imported
const sequelize = require('../database/sequelize'); // Import the sequelize instance
const Landlord = require('./landlord'); // Import the Landlord model
const LandlordProfile = require('./landlordprofile'); // Import 
const Inspection = require('./inspection');
const Tenant = require('./tenant');
const Listing = require('./listing');


class Transaction extends Model {}

Transaction.init(
  {
    // Model attributes are defined here
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    partPaymentAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending',
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    transactionHistory: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    landlordId: {
      type: DataTypes.UUID,
      references: {
        model: Landlord, // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    tenantId: {
      type: DataTypes.UUID,
      references: {
        model: Tenant, // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    listingId: {
      type: DataTypes.UUID,
      references: {
        model: Listing, // Fixed: Use the table name as a string
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  },
  {
    // Other model options go here
    sequelize, // Pass the connection instance
    modelName: 'Transaction', // Define the model name
    tableName: 'Transactions' // Define the table name
  },
);

module.exports = Transaction;

