import { Model } from 'mongoose';

export interface BaseModel<T> extends Model<T> {
  softDelete(id: string | number): Promise<any>;
  restore(id: string): Promise<any>;
  getAllDeleted(): Promise<T[]>;
  getOneDeleted(id: string): Promise<T | null>;
}