import dotenv from 'dotenv';

dotenv.config();

export default {
  esmsConfig: {
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    Brandname: 'FNOTIFY',
    SmsType: '2',
    campaignid: 'giapha',
  },
  mailerTransporter: {
    host: 'mail.flextech.vn',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  },
  redis: {
    host: process.env.REDIS_HOST_NAME || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
};
