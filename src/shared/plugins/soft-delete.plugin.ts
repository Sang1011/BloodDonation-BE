import { Schema } from 'mongoose';

export function applySoftDeleteStatics(schema: Schema, idField: string) {
  schema.statics.softDelete = function (id: string | number) {
    return this.updateOne(
      { [idField]: id },
      {
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date(),
      }
    );
  };

  schema.statics.restore = function (id: string | number) {
    return this.updateOne(
      { [idField]: id },
      {
        is_deleted: false,
        $unset: { deleted_at: "" },
        updated_at: new Date(),
      }
    );
  };

  schema.statics.getAllDeleted = function () {
    return this.find({ is_deleted: true });
  };

  schema.statics.getOneDeleted = function (id: string | number) {
    return this.findOne({ [idField]: id, is_deleted: true });
  };

  const autoExcludeDeleted = function (next: Function) {
    if (!this.getQuery().withDeleted) {
      this.where({ is_deleted: false });
    } else {
      delete this.getQuery().withDeleted;
    }
    next();
  };

  schema.pre('find', autoExcludeDeleted);
  schema.pre('findOne', autoExcludeDeleted);
  schema.pre('count', autoExcludeDeleted);
  schema.pre('countDocuments', autoExcludeDeleted);
}