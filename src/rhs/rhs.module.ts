import { Module } from '@nestjs/common';
import { RhsService } from './rhs.service';
import { RhsController } from './rhs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Rh, RhSchema } from './schemas/rh.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Rh.name, schema: RhSchema }]),
    ],
    controllers: [RhsController],   
    providers: [RhsService],
    exports: [RhsService],
})
export class RhsModule {}
