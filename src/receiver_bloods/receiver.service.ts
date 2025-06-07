import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceiverBlood, ReceiverBloodDocument } from './schemas/receiver_blood.schema';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';
import { BloodsService } from 'src/bloods/bloods.service';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';
import { CreateReceiveBloodDto } from './dtos/requests/create_receive_bloods.dto';
import { UpdateReceiveBloodDto } from './dtos/requests/update_receive_bloods.dto';

@Injectable()
export class ReceiverBloodService {
  constructor(
    @InjectModel(ReceiverBlood.name)
    private receiverBloodModel: Model<ReceiverBlood>,
    private inforHealthsService: InforHealthService,
    private bloodsService: BloodsService
  ) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort}: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultCurrent = currentPage || 1;
    const defaultLimit = limit || 10;
    const offset = (defaultCurrent - 1) * defaultLimit;

    const totalItems = await this.receiverBloodModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.receiverBloodModel
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
    const receiverBlood = await this.receiverBloodModel.findOne({receiver_id: id}).populate([
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
      }
    ]);
    if (!receiverBlood) {
      throw new NotFoundException("Receiver Blood record not found");
    }
    return receiverBlood;
  }

  async create(dto: CreateReceiveBloodDto) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ infor_health: dto.infor_health});
    if (existingReceiverBlood) {
      throw new BadRequestException("Receiver Blood record already exists for this InforHealth");
    }
    const checked = await this.checkDuplicate(dto);
    if (!checked) {
      throw new BadRequestException("Invalid data provided");
    }
    const created = new this.receiverBloodModel(dto);
    return await created.save();
  }

  async checkDuplicate(dto: CreateReceiveBloodDto) {
    const inforHealth = await this.inforHealthsService.findById(dto.infor_health);
    if (!inforHealth) {
      throw new NotFoundException("InforHealth not found");
    }
    const blood = await this.bloodsService.findOne(+dto.blood_id);
    if (!blood) {
      throw new NotFoundException("Blood not found");
    }
    return true;
  }

  async update(id: string, dto: UpdateReceiveBloodDto) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id});
    if(!existingReceiverBlood){
      throw new BadRequestException("Receiver Blood record not found");
    }
    if(dto.infor_health){
      const inforHealth = await this.inforHealthsService.findOne(dto.infor_health);
      if (!inforHealth) {
        throw new NotFoundException("InforHealth not found");
      }
    }
    if(dto.blood_id){
      const blood = await this.bloodsService.findOne(+dto.blood_id);
      if (!blood) {
        throw new NotFoundException("Blood not found");
      }
    }
    const updated = await this.receiverBloodModel.findOneAndUpdate({receiver_id: id}, dto, { new: true });
    if (!updated) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return updated;
  }

    async remove(id: string){
        const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
        if (!existingReceiverBlood) {
            throw new NotFoundException("Receiver Blood record not found");
        }
        const deleted = await this.receiverBloodModel.deleteOne({receiver_id: id});
        if (!deleted) {
            throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
        }
        return {
            data: deleted,
        };
    }
}

