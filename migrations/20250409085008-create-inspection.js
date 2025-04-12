'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inspections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      scheduledDate: {
        type: Sequelize.DATEONLY,

      },
      timeRange: {
        type: Sequelize.ENUM('10am-4pm'),
        allowNull: false
      },
      days: {
        type: Sequelize.ENUM('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'confirmed', 'cancelled'),
        defaultValue: 'scheduled'
      },
      landlordId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      tenantId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false,
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
    await queryInterface.dropTable('Inspections');
  }
};