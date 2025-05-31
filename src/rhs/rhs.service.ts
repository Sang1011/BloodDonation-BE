import { Injectable, BadRequestException } from '@nestjs/common';
import { Rh } from './schemas/rh.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RhsDto } from './dto/rhs.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
@Injectable()
export class RhsService {
    constructor(
        @InjectModel(Rh.name) private rhModel: Model<Rh>,
    ) {}

    async create(createRhDto: RhsDto) {
        const findRh = await this.rhModel.findOne({blood_Rh: createRhDto.blood_Rh});
        if (findRh) {
            throw new BadRequestException(MESSAGES.RH.RH_EXIST);
        }

        const countDocument = await this.rhModel.countDocuments();

        const rh = await new this.rhModel({...createRhDto, rh_id: countDocument + 1});
        return await this.rhModel.create(rh);
    }

    async update(id: number, updateRhDto: RhsDto) {
        const findRh = await this.rhModel.findOne({rh_id: id});
        if (!findRh) {
            throw new BadRequestException(MESSAGES.RH.RH_NOT_FOUND);
        }

        await this.rhModel.updateOne({rh_id: id}, updateRhDto);
    }

    async findOne(id: number) {
        const findRh = await this.rhModel.findOne({rh_id: id});
        if (!findRh) {
            throw new BadRequestException(MESSAGES.RH.RH_NOT_FOUND);
        }
        return findRh;
    }

    
}