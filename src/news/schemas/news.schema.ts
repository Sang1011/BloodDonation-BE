import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type NewsDocument = HydratedDocument<News>;

@Schema()
export class News {
  @Prop({unique: true})
  news_id: number;

  @Prop({required: true})
  title: string;

  @Prop({required: true})
  description: string;

  @Prop({required: true})
  date: string;

  @Prop()
  image: string;

  @Prop()
  link: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);

// middleware
applySmartIdField(NewsSchema, News.name ,'news_id');
