import { BadRequestException, Injectable } from '@nestjs/common';
import { BloodType } from './schemas/blood_type.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BloodTypeDto } from './dto/request/bloodtype.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from "api-query-params";

@Injectable()
export class BloodTypesService {
    constructor(
        @InjectModel(BloodType.name) private bloodTypeModel: Model<BloodType>
    ) { }


    async create(bloodType: BloodTypeDto) {
        const findBloodType = await this.bloodTypeModel.findOne({ blood_name: bloodType.blood_name });
        if (findBloodType) {
            throw new BadRequestException(MESSAGES.BLOOD_TYPE.BLOOD_TYPE_EXIST);
        }
        const countDocument = await this.bloodTypeModel.countDocuments();

        const newBloodType = await new this.bloodTypeModel({ ...bloodType, blood_type_id: countDocument + 1 });
        return await this.bloodTypeModel.create(newBloodType);
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort }: AqpResult = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        const defaultCurrent = currentPage ? currentPage : 1;
        const offset = (+defaultCurrent - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.bloodTypeModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.bloodTypeModel.find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort || {})
            .exec();
        return {
            meta: {
                current: defaultCurrent,
                pageSize: defaultLimit,
                pages: totalPages,
                total: totalItems
            },
            result
        }
    }

    async findOne(id: number) {
        return await this.bloodTypeModel.findOne({ blood_type_id: id });
    }

    async findByType(type: string) {
        return await this.bloodTypeModel.findOne({ blood_name: type });
    }

    async update(id: string, bloodType: BloodTypeDto) {
        return await this.bloodTypeModel.findByIdAndUpdate(id, bloodType, { new: true });
    }

    async delete(id: string) {
        return await this.bloodTypeModel.findByIdAndDelete(id);
    }
}