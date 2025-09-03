import settings from '@configs/settings';
import { DataTypes } from 'sequelize';

const UserEntity = {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false,
  },
  employeeCode: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  departmentId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  positionId: {
    type: DataTypes.INTEGER, allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255), allowNull: true,
  },
  fullName: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255), allowNull: false,
  },
  dateIn: {
    type: DataTypes.DATE, allowNull: true,
  },
  dateOut: {
    type: DataTypes.DATE, allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE, allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM({ values: ['male', 'female', 'other'] }),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM({ values: ['active', 'inactive'] }),
    allowNull: true,
    defaultValue: 'active',
  },
  role: {
    type: DataTypes.ENUM({ values: ['admin', 'user'] }),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT, allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    source: {
      type: DataTypes.STRING(255),
      allowNull: false,
      get (): string {
        const source = this.getDataValue('type') === 'image'
          ? `${settings.imageStorageHost}/${this.getDataValue('source')}`
          : null;
        return source;
      },
    },
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
};

export default UserEntity;
