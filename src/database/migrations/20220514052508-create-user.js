'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
      },
      employeeCode: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      departmentId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      positionId: {
        type: Sequelize.INTEGER, allowNull: true,
      },
      address: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      fullName: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255), allowNull: false,
      },
      dateIn: {
        type: Sequelize.DATE, allowNull: true,
      },
      dateOut: {
        type: Sequelize.DATE, allowNull: true,
      },
      dateOfBirth: {
        type: Sequelize.DATE, allowNull: true,
      },
      gender: {
        type: Sequelize.ENUM({ values: ['male', 'female', 'other'] }),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM({ values: ['active', 'inactive'] }),
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM({ values: ['admin', 'user'] }),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT, allowNull: true,
      },
      avatar: {
        type: Sequelize.STRING(255), allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    }, {
      charset: 'utf8mb4',
    });
  },

  down: async (queryInterface) => {
    return queryInterface.dropTable('users');
  },
};
