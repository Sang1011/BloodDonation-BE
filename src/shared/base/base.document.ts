import { Types } from "mongoose";

export abstract class BaseDocument {
    readonly _id: Types.ObjectId;  // Mặc định mongoose có
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly deletedAt?: Date;      // dùng soft-delete
}