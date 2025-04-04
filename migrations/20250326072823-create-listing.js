'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Listings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4 // Added default value for UUID
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM('Houses', 'Apartments'),
        allowNull: false
      },
      bedrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'),
        allowNull: false
      },
      bathrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'),
        allowNull: false
      },
      minrent: {
        type: Sequelize.ENUM('500000','600000','700000','800000','900000','1000000'),
        allowNull: false
      },
      maxrent: {
        type: Sequelize.ENUM('1000000','2000000','3000000','4000000','5000000'),
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      size: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      locality: {
        type: Sequelize.ENUM(
          'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo Odofin',
          'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju Lekki', 'Ikeja', 'Ikorodu',
          'Lagos Island', 'Mushin', 'Ojo', 'Shomolu', 'Surulere'
        ),
        allowNull: false
      },
      area: {
        type: Sequelize.STRING,
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
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isAvailable: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      listingImage: {
        type: Sequelize.TEXT('long'), // JSON to store an array of objects
        allowNull: false
      },
      landlordId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Landlords', // Corrected to match the actual table name in the database
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
