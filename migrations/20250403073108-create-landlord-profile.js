'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('landlordProfiles', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4 // Changed to UUID
        
      },
      fullName: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      locality: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false // Added to match the model
      },
      profileImage: {
        type: Sequelize.STRING
         // Added to match the model
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