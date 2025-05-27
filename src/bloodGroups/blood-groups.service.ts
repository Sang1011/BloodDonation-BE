import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BloodGroup, BloodGroupDocument } from './schemas/blood-group.schema';
import { Model } from 'mongoose';
import aqp, { AqpResult } from "api-query-params";
import { isValidId } from 'src/shared/utils/isValidId';
import { MESSAGES } from 'src/shared/constants/messages.constants';

@Injectable()
export class BloodGroupsService {
  constructor(@InjectModel(BloodGroup.name) private bloodGroupModel: Model<BloodGroupDocument>) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.bloodGroupModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.bloodGroupModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .select("-password")
      .populate(population)
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

  async findOne(id: string) {
    if (!isValidId(id)) return MESSAGES.BLOOD_GROUPS.BLOOD_GROUP_NOT_FOUND;

    const bloodGroup = await this.bloodGroupModel
      .findOne({ _id: id })

    if (!bloodGroup) return MESSAGES.BLOOD_GROUPS.BLOOD_GROUP_NOT_FOUND;

    return bloodGroup;
  }
}
