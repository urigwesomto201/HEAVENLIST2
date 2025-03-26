'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID
    },
    location: {
      type: Sequelize.STRING,
      allowNull: false
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isVerifiedConfirmation: {
      type: Sequelize.ENUM('not-verified', 'verified'), // Changed to ENUM
      defaultValue: 'not-verified', // Default value for ENUM
      allowNull: false
    },
    listingImage: {
      type: Sequelize.JSON, // Changed to JSON to store an array of objects
      allowNull: false,
      defaultValue: [], // Default to an empty array
    },
    landlordId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Landlords', // Name of the table being referenced
        key: 'id', // Column in the referenced table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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
    await queryInterface.dropTable('Listings');
  }
};