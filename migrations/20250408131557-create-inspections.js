'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Inspections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      tenantId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      listingId: {
        type: Sequelize.UUID,
        allowNull: false
      },
      scheduledDate: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      timeRange: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('scheduled', 'confirmed', 'cancelled'),
        defaultValue: 'scheduled'
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
  async down(queryInterface) {
    await queryInterface.dropTable('Inspections');
  }
};