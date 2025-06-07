import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonateBlood, DonateBloodDocument } from './schemas/donate_blood.schema';
import { CreateDonateBloodDto } from './dto/request/create_donate_bloods.dto';
import { UpdateDonateBloodDto } from './dto/request/update_donate_bloods.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';
import { BloodsService } from 'src/bloods/bloods.service';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';

@Injectable()
export class DonateBloodService {
  constructor(
    @InjectModel(DonateBlood.name)
    private donateBloodModel: Model<DonateBlood>,
    private inforHealthsService: InforHealthService,
    private bloodsService: BloodsService,
    private centralBloodService: CentralBloodService,
  ) { }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
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
      .populate([
        {
          path: "infor_health",
          model: 'InforHealth',
          localField: 'infor_health',
          foreignField: 'infor_health',
          justOne: true,
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',
          foreignField: 'blood_id',
          justOne: true,
        },
        {
          path: 'centralBlood_id',
          model: 'CentralBlood',
          localField: 'centralBlood_id',
          foreignField: 'centralBlood_id',
          justOne: true,
        },
      ])
      .exec();

    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      results
    };
  }

  async findOne(id: string) {
    const donateBlood = await this.donateBloodModel.findById(id).populate([
      {
        path: "infor_health",
        model: 'InforHealth',
        localField: 'infor_health',
        foreignField: 'infor_health',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
      },
    ]);
    if (!donateBlood) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return donateBlood;
  }

  async create(dto: CreateDonateBloodDto) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ infor_health: dto.infor_health, date_register: dto.date_register });
    if (existingDonateBlood) {
      throw new BadRequestException("This user has already registered for blood donation on this date");
    }
    const checked = await this.checkDuplicate(dto);
    if (!checked) {
      throw new BadRequestException("Invalid data provided");
    }
    const created = new this.donateBloodModel(dto);
    return await created.save();
  }

  async checkDuplicate(dto: CreateDonateBloodDto) {
    const inforHealth = await this.inforHealthsService.findById(dto.infor_health);
    if (!inforHealth) {
      throw new NotFoundException("InforHealth not found");
    }
    const blood = await this.bloodsService.findOne(+dto.blood_id);
    if (!blood) {
      throw new NotFoundException("Blood not found");
    }
    const centralBlood = await this.centralBloodService.findOne(dto.centralBlood_id.toString());
    if (!centralBlood) {
      throw new NotFoundException("CentralBlood not found");
    }
    return true;
  }

  async update(id: string, dto: UpdateDonateBloodDto) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new BadRequestException("Donate Blood record not found");
    }
    const inforHealth = await this.inforHealthsService.findOne(dto.infor_health);
    if (!inforHealth) {
      throw new NotFoundException("InforHealth not found");
    }
    const blood = await this.bloodsService.findOne(+dto.blood_id);
    if (!blood) {
      throw new NotFoundException("Blood not found");
    }
    const centralBlood = await this.centralBloodService.findOne(dto.centralBlood_id.toString());
    if (!centralBlood) {
      throw new NotFoundException("CentralBlood not found");
    }
    const updated = await this.donateBloodModel.findOneAndUpdate({ donate_id: id }, dto, { new: true });
    if (!updated) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return updated;
  }

  async remove(id: string) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    const deleted = await this.donateBloodModel.deleteOne({ donate_id: id });
    if (!deleted) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return {
      data: deleted,
    };
  }
}

