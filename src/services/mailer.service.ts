import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';

export interface IMailerService {
  sendMailRegister(user: any, password: string): Promise<void>;
  sendMailUploadUsers(admin: any, totalUsers: number, totalImported: number, totalFailImported: number, failToImported: any[]): Promise<void>;
  sendCustomMail(to: string, subject: string, template: string, templateArgs: any): Promise<void>;
  sendRawMail(mailOptions: Mail.Options): Promise<void>;
}

export class MailerService implements IMailerService {
  private transporter: nodemailer.Transporter;

  constructor () {
    this.transporter = nodemailer.createTransport(configs.mailerTransporter);
  }

  async sendMailRegister (user: any, password: string): Promise<void> {
    const mainOptions = {
      from: 'CTY CP FlexTech',
      to: user.email,
      subject: 'Thông tin tài khoản',
    };
    const templateArgs = {
      name: user.fullName,
      email: user.email,
      password: password,
    };
    const template = 'emailRegister';
    await this.sendMail(mainOptions, template, templateArgs);
  }

  async sendMailUploadUsers (
    admin: any,
    totalUsers: number,
    totalImported: number,
    totalFailImported: number,
    failToImported: any[],
  ): Promise<void> {
    const mainOptions = {
      from: 'CTY CP FlexTech',
      to: admin.email,
      subject: 'Thông tin tải lên',
    };
    const templateArgs = {
      totalUsers: totalUsers,
      totalImported: totalImported,
      totalFailImported: totalFailImported,
      failToImported: failToImported,
    };
    const template = 'emailImportUsers';
    await this.sendMail(mainOptions, template, templateArgs);
  }

  async sendCustomMail (to: string, subject: string, template: string, templateArgs: any): Promise<void> {
    const mainOptions = {
      from: 'CTY CP FlexTech',
      to,
      subject,
    };
    await this.sendMail(mainOptions, template, templateArgs);
  }

  async sendRawMail (mailOptions: Mail.Options): Promise<void> {
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async sendMail (args: Mail.Options, templateName: string, templateArgs: any = {}): Promise<void> {
    try {
      const templateSrc = path.join(__dirname, `../../views/mailer/${templateName}.hbs`);

      if (!fs.existsSync(templateSrc)) {
        throw new Error(`Email template not found: ${templateName}`);
      }

      const templateContent = fs.readFileSync(templateSrc, 'utf-8');
      const template = handlebars.compile(templateContent);
      const html = template(templateArgs);

      const mailOptions = {
        ...args,
        html,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new Error(`Failed to send email with template ${templateName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Method to verify transporter configuration
  async verifyConnection (): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Mailer connection verification failed:', error);
      return false;
    }
  }

  // Method to get transporter configuration
  getTransporterConfig (): any {
    return configs.mailerTransporter;
  }
}
