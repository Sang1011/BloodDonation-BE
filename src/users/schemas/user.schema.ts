import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { BloodGroup } from 'src/bloodGroups/schemas/blood-group.schema';
import { BaseDocument } from 'src/shared/base/base.document';
import { Gender, Role } from 'src/shared/enums/user.enum';
import { createSoftDeleteSchema } from 'src/shared/helpers/create-soft-delete-schema.helper';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends BaseDocument {
  @Prop({ enum: Role, default: Role.MEMBER })
  role: Role;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  dob: Date;

  @Prop({ enum: Gender, required: false })
  gender: Gender;

  @Prop()
  address: string;

  @Prop({
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: BloodGroup.name })
  bloodId: mongoose.Types.ObjectId;

  @Prop({ default: false })
  availableToDonate: boolean;

  @Prop()
  lastDonationDate: Date;

  @Prop()
  nextEligibleDate: Date;

  // deletedAt, createdAt, updatedAt đã setup ở BaseDocument
  // nếu collection ko có deletedAt thì không extends BaseDocument
  // created và updatedAt thì phải thêm prop vào schema dồng thời sửa lại thành @Schema({timestamp: true})
}

export const UserSchema = createSoftDeleteSchema(User);
// User có SoftDelete
