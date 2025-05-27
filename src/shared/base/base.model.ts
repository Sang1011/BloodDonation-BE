import { FilterQuery, Model } from 'mongoose';

export interface BaseModel<T> extends Model<T> {
  delete(filter?: FilterQuery<T>): Promise<any>;
  restore(filter?: FilterQuery<T>): Promise<any>;
  findAllDeleted(filter?: FilterQuery<T>): Promise<T[]>;
  findAllWithoutDeleted(filter?: FilterQuery<T>): Promise<T[]>;
}