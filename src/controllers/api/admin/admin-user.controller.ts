import * as fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { getService, TYPES } from '@configs/container';
import { IUserService } from '@services/user.service';
import { sendError, sendSuccess } from '@libs/response';
import { NoData } from '@libs/errors';

export class AdminUserController {
  private userService: IUserService;

  constructor () {
    this.userService = getService<IUserService>(TYPES.UserService);
  }

  // Get all users with pagination and filtering (index)
  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page = 1,
        limit = 10,
        sortOrder = 'DESC',
        sortBy = 'createdAt',
        freeWord,
        status,
        positionIds,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let users;
      let total;

      if (freeWord) {
        users = await this.userService.searchUsers(String(freeWord), Number(limit), offset);
        total = await this.userService.count();
      } else if (status) {
        users = await this.userService.getUsersByStatus(String(status));
        total = users.length;
      } else {
        users = await this.userService.findAll({
          limit: Number(limit),
          offset,
          order: [[String(sortBy), String(sortOrder) as 'ASC' | 'DESC']],
        });
        total = await this.userService.count();
      }

      // Filter by position IDs if provided
      if (positionIds && Array.isArray(positionIds)) {
        const positionIdArray = positionIds.map(id => String(id));
        users = users.filter(user => positionIdArray.includes(String(user.positionId)));
      }

      sendSuccess(res, {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Download users list
  public download = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await this.userService.findAll({
        order: [['createdAt', 'DESC']],
      });

      // Convert to CSV format
      const csvData = this.convertToCSV(users);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      res.send(csvData);
    } catch (error) {
      next(error);
    }
  };

  // Upload users from file
  public upload = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        sendError(res, 400, 'No file uploaded');
        return;
      }

      const filePath = req.file.path;
      const usersData = await this.parseUploadedFile(filePath);

      if (usersData.length === 0) {
        sendError(res, 400, 'No valid data found in file');
        return;
      }

      const createdUsers = await this.userService.bulkCreateUsers(usersData);

      // Clean up uploaded file
      fs.unlinkSync(filePath);

      sendSuccess(res, {
        message: `${createdUsers.length} users created successfully`,
        totalProcessed: usersData.length,
        createdUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update current user
  public updateCurrent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        sendError(res, 401, 'User not authenticated');
        return;
      }

      const userData = req.body;
      const user = await this.userService.updateUser(userId, userData);

      sendSuccess(res, {
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user by ID
  public update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const userData = req.body;

      const user = await this.userService.updateUser(Number(userId), userData);

      sendSuccess(res, {
        message: 'User updated successfully',
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Upload avatar
  public uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      if (!req.file) {
        sendError(res, 400, 'No avatar file uploaded');
        return;
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      // Update user with avatar path
      const user = await this.userService.updateUser(Number(userId), { avatar: avatarUrl });

      sendSuccess(res, {
        message: 'Avatar uploaded successfully',
        avatar: avatarUrl,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete user
  public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;

      const success = await this.userService.deleteUser(Number(userId));

      if (!success) {
        sendError(res, 404, 'User not found');
        return;
      }

      sendSuccess(res, {
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Create new user
  public create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);

      sendSuccess(res, {
        message: 'User created successfully',
        user,
      }, 201);
    } catch (error) {
      next(error);
    }
  };

  // Show user by ID
  public show = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await this.userService.getUserById(Number(userId));

      if (!user) {
        sendError(res, 404, NoData);
        return;
      }

      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  };

  // Helper methods
  private convertToCSV (users: any[]): string {
    const headers = ['ID', 'Employee Code', 'Full Name', 'Email', 'Phone', 'Role', 'Status', 'Created At'];
    const rows = users.map(user => [
      user.id,
      user.employeeCode,
      user.fullName,
      user.email,
      user.phoneNumber,
      user.role,
      user.status,
      user.createdAt,
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  private async parseUploadedFile (filePath: string): Promise<any[]> {
    // This is a simplified implementation
    // In a real application, you would use a proper CSV/Excel parser
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const users = [];
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const user: any = {};

        headers.forEach((header, index) => {
          user[header.toLowerCase().replace(/\s+/g, '')] = values[index];
        });

        if (user.employeecode && user.fullname && user.email) {
          users.push({
            employeeCode: user.employeecode,
            fullName: user.fullname,
            email: user.email,
            phoneNumber: user.phonenumber || '',
            role: user.role || 'user',
            status: user.status || 'active',
            password: 'defaultPassword123', // In production, generate secure passwords
          });
        }
      }
    }

    return users;
  }
}

// Export singleton instance
export default new AdminUserController();
