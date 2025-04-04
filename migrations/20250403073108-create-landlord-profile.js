'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landlordProfiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID, // Changed to UUID
        defaultValue: Sequelize.UUIDV4 // Added default value for UUID
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      businessName: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      isVerified: {
        type: Sequelize.BOOLEAN, // Changed to BOOLEAN to match the model
        defaultValue: false // Added default value
      },
      landlordId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Landlords', // References the Landlords table
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('landlordProfiles');
  }
};