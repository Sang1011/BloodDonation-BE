import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop({unique: true})
  location_id: string;
  
  @Prop()
  ipAddress: string;

  @Prop({required: true})
  country: string;

  @Prop({required: true})
  district: string;

  @Prop({required: true})
  road: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// middleware
applySmartIdField(LocationSchema, Location.name,'location_id');