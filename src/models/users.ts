import { Model, ModelScopeOptions, ModelValidateOptions, Op, Sequelize, ValidationErrorItem } from 'sequelize';
import UserInterface from '@interfaces/users';
import UserEntity from '@entities/users';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import * as bcrypt from 'bcryptjs';

class UserModel extends Model<UserInterface> implements UserInterface {
  public id!: number;
  public employeeCode!: string;
  public departmentId!: number;
  public positionId!: number;
  public address!: string;
  public fullName!: string;
  public phoneNumber!: string;
  public password!: string;
  public email!: string;
  public dateIn!: Date;
  public dateOut!: Date;
  public dateOfBirth!: Date;
  public gender!: string;
  public status!: string;
  public role!: string;
  public description!: string;
  public avatar!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date;

  static readonly CREATABLE_PARAMETERS = ['employeeCode', 'departmentId', 'positionId', 'password', 'fullName', 'phoneNumber', 'email', 'role', 'status', 'dateIn', 'dateOut'];
  public static readonly UPDATABLE_PARAMETERS = ['fullName', 'employeeCode', 'dateOfBirth', 'departmentId', 'positionId', 'phoneNumber', 'address', 'dateIn', 'dateOut', 'gender', 'status', 'role', 'description', 'password'];
  public static readonly USER_UPDATABLE_PARAMETERS = ['fullName', 'employeeCode', 'dateOfBirth', 'departmentId', 'positionId', 'phoneNumber', 'address', 'dateIn', 'dateOut', 'gender', 'description'];

  static readonly hooks = {
    beforeSave (record: UserModel) {
      if (record.password && record.password !== record.previous('password')) {
        (record).hashPassword();
      }
    },
    // async afterCreate (record) {
    //   const password = record.previous('password');
    //   await MailerService.sendMailRegister(record, password);
    // },
  };

  static readonly validations: ModelValidateOptions = {
    async uniqueEmail (this: UserModel) {
      if (this.email) {
        const existedRecord = await UserModel.scope([{ method: ['byEmail', this.email] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem(
            'Email đã được sử dụng',
            'validation error',
            'email',
            this.email,
            this,
            'uniqueEmail',
            'uniqueEmail',
            [],
          );
        }
      }
    },
    async uniqueEmployeeCode (this: UserModel) {
      if (this.employeeCode) {
        const existedRecord = await UserModel.scope([{ method: ['byEmployeeCode', this.employeeCode] }]).findOne();
        if (existedRecord && existedRecord.id !== this.id) {
          throw new ValidationErrorItem(
            'Mã nhân viên đã được sử dụng.',
            'validation error',
            'employeeCode',
            this.employeeCode,
            this,
            'uniqueEmployeeCode',
            'uniqueEmployeeCode',
            [],
          );
        }
      }
    },
  };

  static readonly scopes: ModelScopeOptions = {
    byEmail (email: string) {
      return {
        where: { email },
      };
    },
    byFreeWord (freeWord: string) {
      return {
        where: {
          [Op.or]: [
            { fullName: { [Op.like]: `%${freeWord || ''}%` } },
            { email: { [Op.like]: `%${freeWord || ''}%` } },
            { employeeCode: freeWord },
          ],
        },
      };
    },
    bySort (sortBy: string, sortOrder: string) {
      return {
        order: [
          [
            sortBy,
            sortOrder,
          ],
        ],
      };
    },
  };

  private hashPassword (): void {
    const salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
  };

  public generateAccessToken (): string {
    const id = { id: this.id };
    const token = jwt.sign(id, settings.jwt.userSecret, { expiresIn: settings.jwt.expiresIn });
    return token;
  };

  public async validPassword (password: string): Promise<boolean> {
    const userPassword = this.password;
    const isMatching = await bcrypt.compare(password, userPassword);
    return isMatching;
  };

  public static initialize (sequelize: Sequelize): void {
    this.init(UserEntity, {
      hooks: UserModel.hooks,
      scopes: UserModel.scopes,
      validate: UserModel.validations,
      tableName: 'users',
      sequelize,
      paranoid: true,
    });
  }

  public static associate (): void {
    // this.belongsTo(PositionModel, {
    //   foreignKey: 'positionId',
    // });
  }
}

export default UserModel;
