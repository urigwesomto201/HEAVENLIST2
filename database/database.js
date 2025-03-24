const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('root', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });

  module.exports = sequelize