const Landlord = require('./landlord');
const Listing = require('./listing');
const tenant = require('./tenant')
'use strict';
const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');

class Transaction extends Model {}

Transaction.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'success', 'failed'),
      defaultValue: 'pending'
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    transactionHistory: {
      type: DataTypes.INTEGER, 
      defaultValue: 0
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
    tenantId: {
          type: DataTypes.UUID,
          references: {
            model: tenant,
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
    
        ListingId: {
          type: DataTypes.UUID,
          references: {
            model: Listing,
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
    
  },
  {
    sequelize, 
    modelName: 'Transaction', 
    tableName: 'Transactions' 
  }
  
);



module.exports = Transaction;
