import { BadRequestException, Injectable } from '@nestjs/common';
import { BloodType } from './schemas/blood_type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BloodTypeDto } from './dto/request/bloodtype.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';

@Injectable()
export class BloodTypesService {
    constructor(
        @InjectModel(BloodType.name) private bloodTypeModel: Model<BloodType>
    ) {}


    async create(bloodType: BloodTypeDto) {
        const findBloodType = await this.bloodTypeModel.findOne({blood_name: bloodType.blood_name});
        if (findBloodType) {
            throw new BadRequestException(MESSAGES.BLOOD_TYPE.BLOOD_TYPE_EXIST);
        }
        const countDocument = await this.bloodTypeModel.countDocuments();

        const newBloodType = await new this.bloodTypeModel({...bloodType, blood_type_id: countDocument + 1});
        return await this.bloodTypeModel.create(newBloodType);
    }

    async findAll() {
        return await this.bloodTypeModel.find();
    }

    async findOne(id: number) {
        return await this.bloodTypeModel.findOne({blood_type_id: id}); 
    }

    

    async update(id: string, bloodType: BloodTypeDto) {
        return await this.bloodTypeModel.findByIdAndUpdate(id, bloodType, { new: true });
    }

    async delete(id: string) {
        return await this.bloodTypeModel.findByIdAndDelete(id);
    }
}