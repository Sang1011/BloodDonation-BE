import { Injectable, BadRequestException } from '@nestjs/common';
import { Rh } from './schemas/rh.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RhsDto } from './dto/rhs.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from "api-query-params";
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

    async findByType(type: string) {
        const findRh = await this.rhModel.findOne({blood_Rh: type});
        if (!findRh) {
            throw new BadRequestException(MESSAGES.RH.RH_NOT_FOUND);
        }
        return findRh;
    }

    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort }: AqpResult = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        const defaultCurrent = currentPage ? currentPage : 1;
        const offset = (+defaultCurrent - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.rhModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.rhModel.find(filter)
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
}