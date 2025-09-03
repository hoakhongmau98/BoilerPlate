import { UserRepository, IUserRepository } from '@repositories/user.repository';
import UserModel from '@models/users';
import UserInterface from '@interfaces/users';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '@configs/settings';
import { BaseService, IBaseService } from './base.service';

export interface IUserService extends IBaseService<UserModel> {
  createUser(userData: Partial<UserInterface>): Promise<UserInterface>;
  updateUser(id: number, userData: Partial<UserInterface>): Promise<UserInterface>;
  deleteUser(id: number): Promise<boolean>;
  getUserById(id: number): Promise<UserInterface | null>;
  getUserByEmail(email: string): Promise<UserInterface | null>;
  getUserByEmployeeCode(employeeCode: string): Promise<UserInterface | null>;
  searchUsers(query: string, limit?: number, offset?: number): Promise<UserInterface[]>;
  getUsersByRole(role: string): Promise<UserInterface[]>;
  getUsersByStatus(status: string): Promise<UserInterface[]>;
  getUsersByDepartment(departmentId: number): Promise<UserInterface[]>;
  getActiveUsers(): Promise<UserInterface[]>;
  getInactiveUsers(): Promise<UserInterface[]>;
  authenticateUser(email: string, password: string): Promise<{ user: UserInterface; token: string } | null>;
  changePassword(userId: number, oldPassword: string, newPassword: string): Promise<boolean>;
  resetPassword(userId: number, newPassword: string): Promise<boolean>;
  countUsersByDepartment(departmentId: number): Promise<number>;
  countUsersByRole(role: string): Promise<number>;
  countUsersByStatus(status: string): Promise<number>;
  bulkCreateUsers(usersData: Partial<UserInterface>[]): Promise<UserInterface[]>;
  bulkUpdateUsers(usersData: { id: number; data: Partial<UserInterface> }[]): Promise<UserInterface[]>;
  bulkDeleteUsers(userIds: number[]): Promise<boolean>;
}

export class UserService extends BaseService<UserModel> implements IUserService {
  private userRepository: IUserRepository;

  constructor () {
    const repository = new UserRepository();
    super(repository);
    this.userRepository = repository;
  }

  async createUser (userData: Partial<UserInterface>): Promise<UserInterface> {
    try {
      // Validate required fields
      this.validateData(userData, ['email', 'password', 'fullName', 'employeeCode']);

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(userData.email!);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const existingEmployee = await this.userRepository.findByEmployeeCode(userData.employeeCode!);
      if (existingEmployee) {
        throw new Error('User with this employee code already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password!);
      const sanitizedData = this.sanitizeData(
        { ...userData, password: hashedPassword },
        UserModel.CREATABLE_PARAMETERS,
      );

      return await this.userRepository.createUser(sanitizedData);
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUser (id: number, userData: Partial<UserInterface>): Promise<UserInterface> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // If email is being updated, check for uniqueness
      if (userData.email && userData.email !== existingUser.email) {
        const userWithEmail = await this.userRepository.findByEmail(userData.email);
        if (userWithEmail) {
          throw new Error('User with this email already exists');
        }
      }

      // If employee code is being updated, check for uniqueness
      if (userData.employeeCode && userData.employeeCode !== existingUser.employeeCode) {
        const userWithEmployeeCode = await this.userRepository.findByEmployeeCode(userData.employeeCode);
        if (userWithEmployeeCode) {
          throw new Error('User with this employee code already exists');
        }
      }

      // Hash password if it's being updated
      if (userData.password) {
        userData.password = await this.hashPassword(userData.password);
      }

      const sanitizedData = this.sanitizeData(userData, UserModel.UPDATABLE_PARAMETERS);
      const [affectedCount, updatedUsers] = await this.userRepository.updateUser(id, sanitizedData);

      if (affectedCount === 0) {
        throw new Error('Failed to update user');
      }

      return updatedUsers[0] || existingUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUser (id: number): Promise<boolean> {
    try {
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      return await this.userRepository.deleteUser(id) > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getUserById (id: number): Promise<UserInterface | null> {
    return await this.userRepository.getUserWithAssociations(id);
  }

  async getUserByEmail (email: string): Promise<UserInterface | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getUserByEmployeeCode (employeeCode: string): Promise<UserInterface | null> {
    return await this.userRepository.findByEmployeeCode(employeeCode);
  }

  async searchUsers (query: string, limit: number = 10, offset: number = 0): Promise<UserInterface[]> {
    return await this.userRepository.searchUsers(query, limit, offset);
  }

  async getUsersByRole (role: string): Promise<UserInterface[]> {
    return await this.userRepository.findByRole(role);
  }

  async getUsersByStatus (status: string): Promise<UserInterface[]> {
    return await this.userRepository.findByStatus(status);
  }

  async getUsersByDepartment (departmentId: number): Promise<UserInterface[]> {
    return await this.userRepository.findByDepartment(departmentId);
  }

  async getActiveUsers (): Promise<UserInterface[]> {
    return await this.userRepository.findActiveUsers();
  }

  async getInactiveUsers (): Promise<UserInterface[]> {
    return await this.userRepository.findInactiveUsers();
  }

  async authenticateUser (email: string, password: string): Promise<{ user: UserInterface; token: string } | null> {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return null;
      }

      // Check if user has validPassword method (from the model)
      if (typeof (user as any).validPassword === 'function') {
        const isValidPassword = await (user as any).validPassword(password);
        if (!isValidPassword) {
          return null;
        }
      } else {
        // Fallback password validation
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return null;
        }
      }

      // Generate token
      let token: string;
      if (typeof (user as any).generateAccessToken === 'function') {
        token = (user as any).generateAccessToken();
      } else {
        // Fallback token generation
        const payload = { id: user.id };
        token = jwt.sign(payload, settings.jwt?.userSecret || 'fallback-secret', {
          expiresIn: settings.jwt?.expiresIn || '24h',
        });
      }

      return { user, token };
    } catch (error) {
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async changePassword (userId: number, oldPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let isValidPassword = false;
      if (typeof (user as any).validPassword === 'function') {
        isValidPassword = await (user as any).validPassword(oldPassword);
      } else {
        isValidPassword = await bcrypt.compare(oldPassword, user.password);
      }

      if (!isValidPassword) {
        throw new Error('Invalid old password');
      }

      const hashedNewPassword = await this.hashPassword(newPassword);
      await this.userRepository.updateUser(userId, { password: hashedNewPassword });

      return true;
    } catch (error) {
      throw new Error(`Failed to change password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async resetPassword (userId: number, newPassword: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const hashedPassword = await this.hashPassword(newPassword);
      await this.userRepository.updateUser(userId, { password: hashedPassword });

      return true;
    } catch (error) {
      throw new Error(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async countUsersByDepartment (departmentId: number): Promise<number> {
    return await this.userRepository.countByDepartment(departmentId);
  }

  async countUsersByRole (role: string): Promise<number> {
    return await this.userRepository.countByRole(role);
  }

  async countUsersByStatus (status: string): Promise<number> {
    return await this.userRepository.countByStatus(status);
  }

  async bulkCreateUsers (usersData: Partial<UserInterface>[]): Promise<UserInterface[]> {
    try {
      const createdUsers: UserInterface[] = [];

      for (const userData of usersData) {
        try {
          const user = await this.createUser(userData);
          createdUsers.push(user);
        } catch (error) {
          console.error(`Failed to create user ${userData.email}: ${error}`);
          // Continue with other users
        }
      }

      return createdUsers;
    } catch (error) {
      throw new Error(`Bulk create users failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkUpdateUsers (usersData: { id: number; data: Partial<UserInterface> }[]): Promise<UserInterface[]> {
    try {
      const updatedUsers: UserInterface[] = [];

      for (const { id, data } of usersData) {
        try {
          const user = await this.updateUser(id, data);
          updatedUsers.push(user);
        } catch (error) {
          console.error(`Failed to update user ${id}: ${error}`);
          // Continue with other users
        }
      }

      return updatedUsers;
    } catch (error) {
      throw new Error(`Bulk update users failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async bulkDeleteUsers (userIds: number[]): Promise<boolean> {
    try {
      let successCount = 0;

      for (const userId of userIds) {
        try {
          const success = await this.deleteUser(userId);
          if (success) {
            successCount++;
          }
        } catch (error) {
          console.error(`Failed to delete user ${userId}: ${error}`);
          // Continue with other users
        }
      }

      return successCount === userIds.length;
    } catch (error) {
      throw new Error(`Bulk delete users failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async hashPassword (password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }
}
