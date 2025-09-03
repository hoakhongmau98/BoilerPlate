import { Op } from 'sequelize';
import UserModel from '@models/users';
import UserInterface from '@interfaces/users';
import { BaseRepository, IBaseRepository } from './base.repository';

export interface IUserRepository extends IBaseRepository<UserModel> {
  findByEmail(email: string): Promise<UserInterface | null>;
  findByEmployeeCode(employeeCode: string): Promise<UserInterface | null>;
  findByFreeWord(freeWord: string): Promise<UserInterface[]>;
  findByRole(role: string): Promise<UserInterface[]>;
  findByStatus(status: string): Promise<UserInterface[]>;
  findByDepartment(departmentId: number): Promise<UserInterface[]>;
  findByPosition(positionId: number): Promise<UserInterface[]>;
  findActiveUsers(): Promise<UserInterface[]>;
  findInactiveUsers(): Promise<UserInterface[]>;
  searchUsers(query: string, limit?: number, offset?: number): Promise<UserInterface[]>;
  countByDepartment(departmentId: number): Promise<number>;
  countByRole(role: string): Promise<number>;
  countByStatus(status: string): Promise<number>;
  createUser(userData: Partial<UserInterface>): Promise<UserInterface>;
  updateUser(id: number, userData: Partial<UserInterface>): Promise<[number, UserInterface[]]>;
  deleteUser(id: number): Promise<number>;
  getUserWithAssociations(id: number): Promise<UserInterface | null>;
}

export class UserRepository extends BaseRepository<UserModel> implements IUserRepository {
  constructor () {
    super(UserModel);
  }

  async findByEmail (email: string): Promise<UserInterface | null> {
    return this.findOne({
      where: { email },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByEmployeeCode (employeeCode: string): Promise<UserInterface | null> {
    return this.findOne({
      where: { employeeCode },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByFreeWord (freeWord: string): Promise<UserInterface[]> {
    return this.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${freeWord || ''}%` } },
          { email: { [Op.like]: `%${freeWord || ''}%` } },
          { employeeCode: freeWord },
        ],
      },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByRole (role: string): Promise<UserInterface[]> {
    return this.findAll({
      where: { role },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByStatus (status: string): Promise<UserInterface[]> {
    return this.findAll({
      where: { status },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByDepartment (departmentId: number): Promise<UserInterface[]> {
    return this.findAll({
      where: { departmentId },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findByPosition (positionId: number): Promise<UserInterface[]> {
    return this.findAll({
      where: { positionId },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findActiveUsers (): Promise<UserInterface[]> {
    return this.findAll({
      where: { status: 'active' },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async findInactiveUsers (): Promise<UserInterface[]> {
    return this.findAll({
      where: { status: 'inactive' },
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async searchUsers (query: string, limit: number = 10, offset: number = 0): Promise<UserInterface[]> {
    return this.findAll({
      where: {
        [Op.or]: [
          { fullName: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { employeeCode: { [Op.like]: `%${query}%` } },
        ],
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }

  async countByDepartment (departmentId: number): Promise<number> {
    return this.count({ where: { departmentId } });
  }

  async countByRole (role: string): Promise<number> {
    return this.count({ where: { role } });
  }

  async countByStatus (status: string): Promise<number> {
    return this.count({ where: { status } });
  }

  async createUser (userData: Partial<UserInterface>): Promise<UserInterface> {
    return this.create(userData);
  }

  async updateUser (id: number, userData: Partial<UserInterface>): Promise<[number, UserInterface[]]> {
    return this.update(id, userData);
  }

  async deleteUser (id: number): Promise<number> {
    return this.delete(id);
  }

  async getUserWithAssociations (id: number): Promise<UserInterface | null> {
    return this.findById(id, {
      include: [
        // Add associations here when available
        // { model: DepartmentModel, as: 'department' },
        // { model: PositionModel, as: 'position' }
      ],
    });
  }
}
