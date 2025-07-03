import { Prop } from '@nestjs/mongoose';

export abstract class BaseSchema {
    @Prop({ default: null })
    readonly deleted_at?: Date;

    @Prop({ default: false })
    is_deleted?: boolean;
}
