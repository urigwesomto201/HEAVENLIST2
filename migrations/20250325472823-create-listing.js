'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('Bungalow', 'Flat', 'Duplex', 'Mini-flat'),
      },
      bedrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+'),
      },
      bathrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+'),
      },
      toilets: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+'),
      },
      state: {
        type: Sequelize.ENUM('Lagos'),
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      area: {
        type: Sequelize.ENUM(
          'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo Odofin',
          'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju Lekki', 'Ikeja', 'Ikorodu',
          'Lagos Island', 'Mushin', 'Ojo', 'Shomolu', 'Surulere'
        ),
        allowNull: false,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year: {
        type: Sequelize.ENUM('1year', '2years', '3years+'),
        allowNull: false,
      },
      isClicked: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
        defaultValue: 'pending',
      },
      partPayment: {
        type: Sequelize.ENUM('10%', '20%', '30%'),
        allowNull: false,
      },
      partPaymentAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
      },
      listingImage: {
        type: Sequelize.TEXT,
        allowNull: false, // No default value, can be null
        get() {
          const raw = this.getDataValue('listingImage');
          try {
            return raw ? JSON.parse(raw) : [];
          } catch (e) {
            return []; // fallback if somehow stored invalid JSON
          }
        },
        set(value) {
        this.setDataValue('listingImage', JSON.stringify(value));
        }
      },
      landlordId: {
        type: Sequelize.UUID,
        references: {
          model: 'Landlords', // Use the correct table name
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Listings');
  },
};