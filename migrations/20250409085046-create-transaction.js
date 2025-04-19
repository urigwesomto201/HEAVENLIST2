'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      reference: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      partPaymentAmount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'success', 'failed'),
        defaultValue: 'pending',
      },
      paymentDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      transactionHistory: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      landlordId: {
        type: Sequelize.UUID,
        references: {
          model: 'Landlords', // Fixed: Use the table name as a string
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tenantId: {
        type: Sequelize.UUID,
        references: {
          model: 'Tenants', // Fixed: Use the table name as a string
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      listingId: {
        type: Sequelize.UUID,
        references: {
          model: 'Listings', // Fixed: Use the table name as a string
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
    await queryInterface.dropTable('Transactions');
  }
};