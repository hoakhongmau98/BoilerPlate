import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import configs from '@configs/configs';
import Mail from 'nodemailer/lib/mailer';
import handlebars from 'handlebars';

class MailerService {
  public static async sendMailRegister (user: any = {}, password: any) {
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
    MailerService.sendMail(mainOptions, template, templateArgs);
  }

  public static async sendMailUploadUsers (admin: any = {}, totalUsers: any, totalImported: any, totalFailImported: any, failToImported: any) {
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
    MailerService.sendMail(mainOptions, template, templateArgs);
  }

  private static async sendMail (args: Mail.Options, templateName: string, templateArgs: any = {}) {
    const transporter = nodemailer.createTransport(configs.mailerTransporter);
    const templateSrc = path.join(__dirname, `../../views/mailer/${templateName}.hbs`);
    const template = handlebars.compile(fs.readFileSync(templateSrc, 'utf-8'));
    const html = template(templateArgs);
    args.html = html;
    await transporter.sendMail(args);
  }
}

export default MailerService;
