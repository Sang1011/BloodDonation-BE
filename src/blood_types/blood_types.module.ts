import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BloodType, BloodTypeSchema } from './schemas/blood_type.schema';
import { BloodTypesService } from './blood_types.service';
import { BloodTypesController } from './blood_types.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: BloodType.name, schema: BloodTypeSchema }])],
    providers: [BloodTypesService],
    controllers: [BloodTypesController],
    exports: [BloodTypesService]
})
export class BloodTypesModule {}
