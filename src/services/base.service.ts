import { IBaseRepository } from '@repositories/base.repository';
import { Model } from 'sequelize';

export interface IBaseService<T extends Model> {
  findAll(options?: any): Promise<T[]>;
  findById(id: number | string, options?: any): Promise<T | null>;
  findOne(options: any): Promise<T | null>;
  create(data: any, options?: any): Promise<T>;
  update(id: number | string, data: any, options?: any): Promise<T>;
  delete(id: number | string, options?: any): Promise<boolean>;
  count(options?: any): Promise<number>;
  exists(id: number | string): Promise<boolean>;
}

export abstract class BaseService<T extends Model> implements IBaseService<T> {
  protected repository: IBaseRepository<T>;

  constructor (repository: IBaseRepository<T>) {
    this.repository = repository;
  }

  async findAll (options?: any): Promise<T[]> {
    try {
      return await this.repository.findAll(options);
    } catch (error) {
      throw new Error(`Failed to fetch all records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findById (id: number | string, options?: any): Promise<T | null> {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      return await this.repository.findById(id, options);
    } catch (error) {
      throw new Error(`Failed to fetch record by ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async findOne (options: any): Promise<T | null> {
    try {
      return await this.repository.findOne(options);
    } catch (error) {
      throw new Error(`Failed to fetch record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async create (data: any, options?: any): Promise<T> {
    try {
      if (!data) {
        throw new Error('Data is required');
      }
      return await this.repository.create(data, options);
    } catch (error) {
      throw new Error(`Failed to create record: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async update (id: number | string, data: any, options?: any): Promise<T> {
    try {
      if (!id) {
        throw new Error('ID is required');
      }
      if (!data) {
        throw new Error('Data is required');
      }

      const [affectedCount, updatedRecords] = await this.repository.update(id, data, options);

      if (affectedCount === 0) {
        throw new Error(`Record with ID ${id} not found`);
      }

      return updatedRecords[0];
    } catch (error) {
      throw new Error(`Failed to update record with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async delete (id: number | string, options?: any): Promise<boolean> {
    try {
      if (!id) {
        throw new Error('ID is required');
      }

      const affectedCount = await this.repository.delete(id, options);
      return affectedCount > 0;
    } catch (error) {
      throw new Error(`Failed to delete record with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async count (options?: any): Promise<number> {
    try {
      return await this.repository.count(options);
    } catch (error) {
      throw new Error(`Failed to count records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exists (id: number | string): Promise<boolean> {
    try {
      if (!id) {
        return false;
      }
      return await this.repository.exists(id);
    } catch (error) {
      throw new Error(`Failed to check existence of record with ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  protected validateData (data: any, requiredFields: string[]): void {
    if (!data) {
      throw new Error('Data is required');
    }

    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  protected sanitizeData (data: any, allowedFields: string[]): any {
    const sanitized: any = {};
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        sanitized[field] = data[field];
      }
    }
    return sanitized;
  }
}
