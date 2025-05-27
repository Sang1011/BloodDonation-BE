import { SchemaFactory } from '@nestjs/mongoose';
import * as mongooseDelete from 'mongoose-delete';

export function createSoftDeleteSchema(cls: any, options = {}) {
  const schema = SchemaFactory.createForClass(cls);

  schema.set('timestamps', true);
  schema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all', ...options });

  return schema;
}
