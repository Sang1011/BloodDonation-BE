import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { applySmartIdField } from 'src/shared/middlewares/assign_custome_id.middleware';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop({ unique: true })
  location_id: string;

  @Prop()
  ipAddress?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string;

  @Prop({ required: true })
  road: string;

  @Prop({ required: true })
  ward: string;

  @Prop()
  house_number?: string;

  @Prop({ index: 'text' })
  full_address: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  position: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export const LocationSchema = SchemaFactory.createForClass(Location);
LocationSchema.index({ position: '2dsphere' })

// middleware
applySmartIdField(LocationSchema, Location.name, 'location_id');
