import UserModel from '@models/users';
import dayjs from 'dayjs';
import XLSX from 'xlsx-js-style';

class ExcelService {
  static readonly DEFAULT_BORDER_OPTIONS = { top: { style: 'thin' }, bottom: { style: 'thin' }, left: { style: 'thin' }, right: { style: 'thin' } };
  static readonly DEFAULT_FONT_OPTIONS = 'Times New Roman';
  public static readonly HORIZONTAL_ENUM = { CENTER: 'center', LEFT: 'left', RIGHT: 'right' };

  public static async exportUsersAsExcelFile (user: UserModel[]) {
    const GENDER_MAPPING: any = { male: 'Nam', female: 'Nữ', other: 'Khác' };
    const ROLE_MAPPING: any = { admin: 'Quản trị viên', user: 'Người dùng' };
    const rows = user.map((record, index) => {
      return [
        { v: index + 1, s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.fullName || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: ExcelService.formatDate(record.dateOfBirth) || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: GENDER_MAPPING[record.gender] || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.address || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.phoneNumber || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.email || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.employeeCode || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: ExcelService.formatDate(record.dateIn) || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: ExcelService.formatDate(record.dateOut) || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: ROLE_MAPPING[record.role] || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
        { v: record.description || '', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.LEFT }, font: { name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '12' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      ];
    });
    const headers = [
      { v: 'STT', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Họ và tên', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày sinh', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Giới tính', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Địa chỉ', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Số điện thoại', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Email', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mã nhân viên', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày bắt đầu làm việc', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Ngày kết thúc làm việc', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Vai trò', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
      { v: 'Mô tả', s: { alignment: { horizontal: ExcelService.HORIZONTAL_ENUM.CENTER }, font: { bold: true, name: ExcelService.DEFAULT_FONT_OPTIONS, sz: '14' }, border: ExcelService.DEFAULT_BORDER_OPTIONS } },
    ];

    rows.unshift(headers);
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(rows);
    const maxWidthCol = [{ wch: 10 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 30 }];
    const maxWidthRow = [{ hpt: 18 }];
    worksheet['!cols'] = maxWidthCol;
    worksheet['!rows'] = maxWidthRow;
    const buffer = await ExcelService.exportToExcel([{ sheetName: 'Sheet1', sheetData: worksheet }]);
    return buffer;
  }

  private static formatDate (date: Date): string | undefined {
    if (date) {
      return dayjs(date).format('DD/MM/YYYY');
    }
    return undefined;
  }

  private static async exportToExcel (workSheets: {sheetName: string, sheetData: XLSX.WorkSheet}[]) {
    const workBook = XLSX.utils.book_new();
    const writeOpts: XLSX.WritingOptions = {
      type: 'buffer',
      cellDates: true,
      bookSST: false,
      bookType: 'xlsx',
      compression: false,
    };
    for (const sheet of workSheets) {
      XLSX.utils.book_append_sheet(workBook, sheet.sheetData, sheet.sheetName);
    }
    const buffer = XLSX.write(workBook, writeOpts);
    return buffer;
  }
}

export default ExcelService;
