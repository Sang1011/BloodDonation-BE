import { Schema } from 'mongoose';

export function applySoftDeleteStatics(schema: Schema, idField: string) {
  schema.statics.softDelete = function (id: string) {
    return this.updateOne(
      { [idField]: id },
      {
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date(),
      }
    );
  };

  schema.statics.restore = function (id: string) {
    return this.updateOne(
      { [idField]: id },
      {
        is_deleted: false,
        deleted_at: null,
        updated_at: new Date(),
      }
    );
  };

  schema.statics.getAllDeleted = function () {
    return this.find({ is_deleted: true });
  };

  schema.statics.getOneDeleted = function (id: string) {
    return this.findOne({ [idField]: id, is_deleted: true });
  };
}