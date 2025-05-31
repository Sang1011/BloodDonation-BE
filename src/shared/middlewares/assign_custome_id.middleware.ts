// src/common/hooks/assign-custom-id.middleware.ts
import mongoose, { Schema } from 'mongoose';
import { Counter } from '../schemas/counter.schema';

export async function applySmartIdField(
  schema: Schema,
  modelName: string,
  idField: string = 'id'
) {
  const pathType = schema.path(idField);
  const isStringField = pathType instanceof mongoose.SchemaTypes.String;
  const isNumberField = pathType instanceof mongoose.SchemaTypes.Number;

  if (!isStringField && !isNumberField) {
    return;
  }

  schema.pre('save', async function (next) {
    if (this[idField] != null) return next();

    if (isStringField) {
      this[idField] = this._id.toString();
    } else if (isNumberField) {
       const counterModel = mongoose.model<Counter>('Counter');
      const counter = await counterModel.findOneAndUpdate(
        { id: modelName },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this[idField] = counter.seq;
    }

    next();
  });

  schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret[idField];
    delete ret._id;
    delete ret.id;
    return ret;
  },
});

schema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret[idField];
    delete ret._id;
    delete ret.id;
    return ret;
  },
});

}

