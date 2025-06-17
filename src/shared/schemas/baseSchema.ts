import { Prop } from '@nestjs/mongoose';

export abstract class BaseSchema {
    @Prop({ default: Date.now })
    created_at?: Date;

    @Prop({ default: Date.now })
    updated_at?: Date;

    @Prop({ default: null })
    deleted_at?: Date;

    @Prop({ default: false })
    is_deleted?: boolean;
}
