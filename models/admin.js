const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
// const Post = require('./post');
const Landlord = require('./landlord');
const Listing = require('./listing');

class Admin extends Model {}

Admin.init(
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
      type: DataTypes.BOOLEAN, // Changed from STRING to BOOLEAN
      defaultValue: false 
    },
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Admin', // We need to choose the model name
    tableName: 'Admins'
  },
);

// Admin.hasMany(Listing,{
//   foreignKey: "adminId",
//   as: "Listings"
// })

// Listing.belongsTo(Admin, {
//   foreignKey: 'id',
//   as: 'Admin'

// })

// Admin.hasMany(Landlord,{
//   foreignKey: "adminId",
//   as: "Landlords"
// })

// Landlord.belongsTo(Admin, {
//   foreignKey: 'id',
//   as: 'Admin'

// })

module.exports = Admin
