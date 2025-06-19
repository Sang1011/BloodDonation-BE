import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blood } from './schemas/blood.schema';
import aqp, { AqpResult } from "api-query-params";
import { BloodDto } from './dto/request/blood.dto';
import { BloodTypesService } from 'src/blood_types/blood_types.service';
import { RhsService } from 'src/rhs/rhs.service';
import { BaseModel } from 'src/shared/interfaces/soft-delete-model.interface';

@Injectable()
export class BloodsService {
  constructor(
    @InjectModel(Blood.name) private bloodModel: BaseModel<Blood>,
    private readonly bloodTypesService: BloodTypesService,
    private readonly rhsService: RhsService,
  ) { }

  async create(blood: BloodDto) {
    const { blood_type, rh } = blood;
    if (!blood_type || !rh) {
    throw new BadRequestException('Blood type and Rh factor are required');
  }
    const bloodTypeExists = await this.bloodTypesService.findByType(blood_type);
    const rhExists = await this.rhsService.findByType(rh);
    if (!bloodTypeExists || !rhExists) {
      throw new NotFoundException('Invalid blood type or Rh factor');
    }
    const existingBlood = await this.bloodModel.findOne({
      blood_type_id: bloodTypeExists.blood_type_id,
      rh_id: rhExists.rh_id
    });

    if (existingBlood !== null) {
      throw new BadRequestException('This blood already exists');
    }
    let count = 1;
    const countDocuments = await this.bloodModel.countDocuments();
    if (countDocuments > 0) {
      count = countDocuments + 1;
    }
    const newBlood = await new this.bloodModel({
      blood_type_id: bloodTypeExists.blood_type_id,
      rh_id: rhExists.rh_id,
      blood_id: count
    });
    newBlood.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.bloodModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.bloodModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate([
        {
          path: 'blood_type_id',
          model: 'BloodType',
          localField: 'blood_type_id',
          foreignField: 'blood_type_id',
          justOne: true,
        },
        {
          path: 'rh_id',
          model: 'Rh',
          localField: 'rh_id',
          foreignField: 'rh_id',
          justOne: true,
        },
      ])
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
    if (!id) {
      throw new BadRequestException('Blood ID is required');
    }
    return this.bloodModel.findOne({ blood_id: id }).populate([
      {
        path: 'blood_type_id',
        model: 'BloodType',
        localField: 'blood_type_id',
        foreignField: 'blood_type_id',
        justOne: true,
      },
      {
        path: 'rh_id',
        model: 'Rh',
        localField: 'rh_id',
        foreignField: 'rh_id',
        justOne: true,
      },
    ]);

  }

  async softRemove(id: number) {
    const deleted = await this.bloodModel.softDelete(id);
    if (!deleted) {
      throw new NotFoundException("Blood not found");
    }
    return { deleted: deleted.modifiedCount };
  }
}
