const {Sequelize}  = require('sequelize');


const sequelize = new Sequelize('havenlist', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = sequelize



