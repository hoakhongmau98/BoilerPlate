import { Model, FindOptions, CreateOptions, UpdateOptions, DestroyOptions, Transaction, ModelStatic, WhereOptions } from 'sequelize';

export interface IBaseRepository<T extends Model> {
  findAll(options?: FindOptions): Promise<T[]>;
  findById(id: number | string, options?: FindOptions): Promise<T | null>;
  findOne(options: FindOptions): Promise<T | null>;
  create(data: any, options?: CreateOptions): Promise<T>;
  update(id: number | string, data: any, options?: UpdateOptions): Promise<[number, T[]]>;
  delete(id: number | string, options?: DestroyOptions): Promise<number>;
  count(options?: FindOptions): Promise<number>;
  exists(id: number | string): Promise<boolean>;
}

export abstract class BaseRepository<T extends Model> implements IBaseRepository<T> {
  protected model: ModelStatic<T>;

  constructor (model: ModelStatic<T>) {
    this.model = model;
  }

  async findAll (options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findById (id: number | string, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options);
  }

  async findOne (options: FindOptions): Promise<T | null> {
    return this.model.findOne(options);
  }

  async create (data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }

  async update (id: number | string, data: any, options?: UpdateOptions): Promise<[number, T[]]> {
    const whereClause: WhereOptions = { id: id as any };
    const [affectedCount, updatedRecords] = await this.model.update(data, {
      ...options,
      where: whereClause,
      returning: true,
    });
    return [affectedCount, updatedRecords as T[]];
  }

  async delete (id: number | string, options?: DestroyOptions): Promise<number> {
    const whereClause: WhereOptions = { id: id as any };
    return this.model.destroy({
      ...options,
      where: whereClause,
    });
  }

  async count (options?: FindOptions): Promise<number> {
    const result = await this.model.count(options);
    return typeof result === 'number' ? result : 0;
  }

  async exists (id: number | string): Promise<boolean> {
    const whereClause: WhereOptions = { id: id as any };
    const count = await this.model.count({ where: whereClause });
    return typeof count === 'number' ? count > 0 : false;
  }

  async transaction<T> (callback: (transaction: Transaction) => Promise<T>): Promise<T> {
    const transaction = await this.model.sequelize!.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
