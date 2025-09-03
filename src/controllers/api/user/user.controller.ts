import { Request, Response, NextFunction } from 'express';
import { getService, TYPES } from '@configs/container';
import { IUserService } from '@services/user.service';

export class UserController {
  private userService: IUserService;

  constructor () {
    this.userService = getService<IUserService>(TYPES.UserService);
  }

  // Get all users with pagination and filtering
  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page = 1, limit = 10, search, role, status, departmentId } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      let users;
      let total;

      if (search) {
        users = await this.userService.searchUsers(String(search), Number(limit), offset);
        total = await this.userService.count();
      } else if (role) {
        users = await this.userService.getUsersByRole(String(role));
        total = users.length;
      } else if (status) {
        users = await this.userService.getUsersByStatus(String(status));
        total = users.length;
      } else if (departmentId) {
        users = await this.userService.getUsersByDepartment(Number(departmentId));
        total = users.length;
      } else {
        users = await this.userService.findAll({
          limit: Number(limit),
          offset,
          order: [['createdAt', 'DESC']],
        });
        total = await this.userService.count();
      }

      res.status(200).json({
        success: true,
        data: users,
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

  // Get user by ID
  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(Number(id));

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Create new user
  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user
  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await this.userService.updateUser(Number(id), userData);

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete user
  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.userService.deleteUser(Number(id));

      if (!success) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Authenticate user
  public authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      const result = await this.userService.authenticateUser(email, password);

      if (!result) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  // Change password
  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        res.status(400).json({
          success: false,
          message: 'Old password and new password are required',
        });
        return;
      }

      const success = await this.userService.changePassword(Number(userId), oldPassword, newPassword);

      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to change password',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  // Get user statistics
  public getUserStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { departmentId, role, status } = req.query;

      const stats: any = {};

      if (departmentId) {
        stats.departmentCount = await this.userService.countUsersByDepartment(Number(departmentId));
      }

      if (role) {
        stats.roleCount = await this.userService.countUsersByRole(String(role));
      }

      if (status) {
        stats.statusCount = await this.userService.countUsersByStatus(String(status));
      }

      // Get overall counts
      stats.totalUsers = await this.userService.count();
      stats.activeUsers = (await this.userService.getActiveUsers()).length;
      stats.inactiveUsers = (await this.userService.getInactiveUsers()).length;

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  };

  // Bulk operations
  public bulkCreateUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { users } = req.body;

      if (!Array.isArray(users) || users.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Users array is required and must not be empty',
        });
        return;
      }

      const createdUsers = await this.userService.bulkCreateUsers(users);

      res.status(201).json({
        success: true,
        message: `${createdUsers.length} users created successfully`,
        data: createdUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  public bulkUpdateUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { users } = req.body;

      if (!Array.isArray(users) || users.length === 0) {
        res.status(400).json({
          success: false,
          message: 'Users array is required and must not be empty',
        });
        return;
      }

      const updatedUsers = await this.userService.bulkUpdateUsers(users);

      res.status(200).json({
        success: true,
        message: `${updatedUsers.length} users updated successfully`,
        data: updatedUsers,
      });
    } catch (error) {
      next(error);
    }
  };

  public bulkDeleteUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userIds } = req.body;

      if (!Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({
          success: false,
          message: 'User IDs array is required and must not be empty',
        });
        return;
      }

      const success = await this.userService.bulkDeleteUsers(userIds);

      if (!success) {
        res.status(400).json({
          success: false,
          message: 'Failed to delete some users',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `${userIds.length} users deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
