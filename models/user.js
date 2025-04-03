const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize = require('../database/sequelize');
// const Post = require('./post');

class User extends Model {}

User.init(
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
    modelName: 'User', // We need to choose the model name
    tableName: 'Users'
  },
);

// User.hasMany(Post,{
//   foreignKey: "userId",
//   as: "Posts"
// })

// Post.belongsTo(User, {
//   foreignKey: 'id',
//   as: 'User'
// })

module.exports = User
