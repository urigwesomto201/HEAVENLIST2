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
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('Houses', 'Apartments')
    
      },
      bedrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+')
      
      },
      bathrooms: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+')
        
      },
      toilets: {
        type: Sequelize.ENUM('1', '2', '3', '4', '5+')
        
      },
      minrent: {
        type: Sequelize.ENUM('500000','600000','700000','800000','900000','1000000')
      
      },
      maxrent: {
        type: Sequelize.ENUM('1000000','2000000','3000000','4000000','5000000')
        
      },
      state: {
        type: Sequelize.ENUM('Lagos')
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      area: {
        type: Sequelize.ENUM(
          'Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo Odofin',
          'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju Lekki', 'Ikeja', 'Ikorodu',
          'Lagos Island', 'Mushin', 'Ojo', 'Shomolu', 'Surulere'
        ),
        allowNull: false
      },
      street: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isClicked: {
        type: Sequelize.INTEGER, 
        defaultValue: 0
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
        // type: Sequelize.TEXT('long'), // JSON to store an array of objects
        type: Sequelize.JSON, // JSON to store an array of objects
        allowNull: false
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
