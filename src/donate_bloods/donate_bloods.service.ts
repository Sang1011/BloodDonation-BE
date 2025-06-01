import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonateBlood, DonateBloodDocument } from './schemas/donate_blood.schema';
import { CreateDonateBloodDto } from './dto/request/create_donate_bloods.dto';
import { UpdateDonateBloodDto } from './dto/request/update_donate_bloods.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';

@Injectable()
export class DonateBloodService {
  constructor(
    @InjectModel(DonateBlood.name)
    private donateBloodModel: Model<DonateBloodDocument>,
  ) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultCurrent = currentPage || 1;
    const defaultLimit = limit || 10;
    const offset = (defaultCurrent - 1) * defaultLimit;

    const totalItems = await this.donateBloodModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.donateBloodModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate(population)
      .exec();

    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      data: results,
    };
  }

  async findOne(id: string) {
    const donateBlood = await this.donateBloodModel.findById(id);
    if (!donateBlood) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return donateBlood;
  }

  async create(dto: CreateDonateBloodDto) {
    const created = new this.donateBloodModel(dto);
    return await created.save();
  }

  async update(id: string, dto: UpdateDonateBloodDto) {
    const updated = await this.donateBloodModel.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return updated;
  }

    async remove(id: string): Promise<void> {
        const deleted = await this.donateBloodModel.findByIdAndDelete(id);
        if (!deleted) {
            throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
        }
    }
}

