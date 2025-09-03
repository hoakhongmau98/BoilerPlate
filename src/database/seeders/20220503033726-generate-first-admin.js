'use strict';
const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync('Aa@123456', salt);
    const admin = [{
      id: undefined,
      avatar: 'images/normal/cb1s9jiv9or32d7tjuq0/cb1s9jiv9or32d7tjuq0.jpg',
      fullName: 'admin001',
      dateOfBirth: new Date(),
      gender: 'male',
      phoneNumber: '0973492500',
      email: 'admin@flextech.vn',
      address: 'Tòa StarTower, Dương Đình Nghệ',
      password: password,
      status: 'active',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }];
    await queryInterface.bulkInsert('users', admin, {});
  },

  down: async (queryInterface, Sequelize) => {
  },
};
