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
        references: {
          model: 'Landlords', // Correct table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tenants', // Correct table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      listingId: {
        type: Sequelize.UUID,
        references: {
          model: 'Listings', // Correct table name
          key: 'id',
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
    await queryInterface.dropTable('Inspections');
  }
};