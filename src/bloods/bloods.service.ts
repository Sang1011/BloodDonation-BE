import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'; 
import { Model } from 'mongoose';
import { Blood } from './schemas/blood.schema';

import { BloodDto } from './dto/request/blood.dto';
import { BloodTypesService } from 'src/blood_types/blood_types.service';
import { RhsService } from 'src/rhs/rhs.service';

@Injectable()
export class BloodsService {
    constructor(
        @InjectModel(Blood.name) private bloodModel: Model<Blood>,
        private readonly bloodTypesService: BloodTypesService,
        private readonly rhsService: RhsService,
    ) {}

    async create(blood: BloodDto) {
        const bloodId = await this.generateBloodId(blood);
        const newBlood = await new this.bloodModel({...blood, blood_id: bloodId});
        newBlood.save();
    }

    async generateBloodId(blood: BloodDto) {
        const bloodType = await this.bloodTypesService.findOne(blood.blood_type_id);
        const rh = await this.rhsService.findOne(blood.rh_id);
        return `${bloodType.blood_name}${rh.blood_Rh}`;
    }

    async findAll() {
        return this.bloodModel.find();
    }

    async findOne(id: string) {
        //return this.bloodModel.findOne({blood_id: id}).populate('blood_type_id').populate('rh_id');
        return this.bloodModel.findOne({blood_id: id});
    }

    

    
}
