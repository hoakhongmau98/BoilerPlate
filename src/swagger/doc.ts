import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const swaggerDefinition = {
  info: {
    title: 'API EMS',
    version: '1.0.0',
    description: 'This is the REST API for project EMS',
  },
  host: process.env.API_HOST,
  basePath: '/api',
  tags: [
    {
      name: '[ADMIN] ADMIN REQUESTS',
      description: 'Quản lý yêu cầu',
    },
    {
      name: '[ADMIN] ADMIN ASSET REQUESTS',
      description: 'Quản lý yêu cầu thiết bị',
    },
    {
      name: '[ADMIN] ASSET',
      description: 'Quản lý thiết bị',
    },
    {
      name: '[ADMIN] CATEGORY',
      description: 'Quản lý danh mục',
    },
    {
      name: '[ADMIN] DEPARTMENTS',
      description: 'Quản lý phòng ban',
    },
    {
      name: '[ADMIN] NOTIFICATIONS',
      description: 'Quản lý thông báo',
    },
    {
      name: '[ADMIN] PERSONAL REQUESTS',
      description: 'Quản lý yêu cầu cá nhân',
    },
    {
      name: '[ADMIN] PERSONAL ASSET REQUESTS',
      description: 'Quản lý yêu cầu thiết bị cá nhân',
    },
    {
      name: '[ADMIN] POSITIONS',
      description: 'Quản lý chức vụ',
    },
    {
      name: '[ADMIN] PURCHASES_HISTORIES',
      description: 'Quản lý lịch sử mua hàng',
    },
    {
      name: '[ADMIN] RULES',
      description: 'Quản lý nội quy',
    },
    {
      name: '[ADMIN] UPLOAD',
      description: 'Quản lý Upload',
    },
    {
      name: '[ADMIN] USERS',
      description: 'Quản lý người dùng',
    },
    {
      name: '[ADMIN] SUPPLIERS',
      description: 'Quản lý nhà cung cấp',
    },
    {
      name: '[ADMIN] SELECTIONS',
      description: 'Danh sách nhà cung cấp',
    },
  ],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      schema: 'bearer',
      name: 'Authorization',
      in: 'header',
      prefix: 'Bearer ',
    },
  },
  definitions: {},
};

const options = {
  swaggerDefinition,
  explorer: true,
  apis: ['**/*.ts'],
};
export default swaggerJsDoc(options);
