'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LandlordProfiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      locality: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: false
      
      },
      isVerified: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LandlordProfiles');
  }
};
