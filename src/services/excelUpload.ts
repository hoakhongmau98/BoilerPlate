import xlsx from 'node-xlsx';
import lodash from 'lodash';
import UserModel from '@models/users';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import MailerService from './mailer';
dayjs.extend(customParseFormat);

class UploadExcelService {
  public static async importUsers (filePath: any, admin: any = {}) {
    const workSheetsFromFile = xlsx.parse(filePath.buffer);
    const sheet: any = workSheetsFromFile[0].data;
    const attributes: any = [];
    const failToImported: any = [];
    const GENDER_MAPPING: any = { 'nam': 'male', 'nữ': 'female', 'khác': 'other' };
    const ROLE_MAPPING: any = { 'quản trị viên': 'admin', 'người dùng': 'user' };

    const indexCol: any = {
      index: 0,
      fullName: 1,
      dateOfBirth: 2,
      gender: 3,
      address: 4,
      phoneNumber: 5,
      email: 6,
      employeeCode: 7,
      dateIn: 8,
      dateOut: 9,
      role: 10,
      description: 11,
      password: 12,
    };

    const rangeArr: any = lodash.range(1, sheet.length);
    for (const i of rangeArr) {
      if (sheet[i][indexCol.index]) {
        attributes.push(
          {
            fullName: sheet[i][indexCol.fullName],
            dateOfBirth: sheet[i][indexCol.dateOfBirth] ? dayjs(sheet[i][indexCol.dateOfBirth], 'DD/MM/YYYY') : null,
            gender: sheet[i][indexCol.gender] ? GENDER_MAPPING[sheet[i][indexCol.gender].toLowerCase()] : 'other',
            address: sheet[i][indexCol.address],
            phoneNumber: sheet[i][indexCol.phoneNumber],
            email: sheet[i][indexCol.email],
            employeeCode: sheet[i][indexCol.employeeCode],
            dateIn: sheet[i][indexCol.dateIn] ? dayjs(sheet[i][indexCol.dateIn], 'DD/MM/YYYY') : null,
            dateOut: sheet[i][indexCol.dateOut] ? dayjs(sheet[i][indexCol.dateOut], 'DD/MM/YYYY') : null,
            role: sheet[i][indexCol.role] ? ROLE_MAPPING[sheet[i][indexCol.role].toLowerCase()] : 'user',
            description: sheet[i][indexCol.description],
            password: 'Admin001',
          },
        );
      }
    }

    const rangeAtt: any = lodash.range(0, attributes.length);
    for (const i of rangeAtt) {
      try {
        await UserModel.create(attributes[i]);
      } catch {
        failToImported.push({ index: sheet[i + 1][indexCol.index] });
      }
    }

    const totalUsers = attributes.length;
    const totalFailImported = failToImported.length;
    const totalImported = attributes.length - totalFailImported;

    await MailerService.sendMailUploadUsers(admin.email, totalUsers, totalImported, totalFailImported, failToImported);
  }
}

export default UploadExcelService;
