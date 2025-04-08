const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
const Tenant = require('./tenant')
class Inspection extends Model { }
const Listing = require('./listing');
Inspection.init(
    {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        tenantId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        listingId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        scheduledDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        timeRange: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'confirmed', 'cancelled'),
            defaultValue: 'scheduled'
        }
    },
    {
        sequelize,
        modelName: 'Inspection',
        tableName: 'Inspections'
    }
);




module.exports = Inspection;