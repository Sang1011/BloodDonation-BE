import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';
import { StorageService } from 'src/storages/storage.service';
import { ReceiverBloodService } from 'src/receiver_bloods/receiver.service';
import { BloodExport } from './schemas/blood_export.schema';
import { CreateExportBloodDto } from './dtos/request/create_export.request';
import { UpdateExportBloodDto } from './dtos/request/update_export.request';

@Injectable()
export class BloodExportService {
  constructor(
    @InjectModel(BloodExport.name)
    private bloodExportModel: Model<BloodExport>,
    private storageService: StorageService,
    private receiverBloodsService: ReceiverBloodService,
  ) {}

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort}: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultCurrent = currentPage || 1;
    const defaultLimit = limit || 10;
    const offset = (defaultCurrent - 1) * defaultLimit;

    const totalItems = await this.bloodExportModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.bloodExportModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate([
        {
          path: "storage_id",
          model: 'Storage',
          localField: 'storage_id',
          foreignField: 'storage_id',
          justOne: true,
        },
        {
          path: 'receiver_id',
          model: 'ReceiverBlood',
          localField: 'receiver_id',      
          foreignField: 'receiver_id',  
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
    const exportBlood = await this.bloodExportModel.findOne({ export_id: id }).populate([
      {
          path: "storage_id",
          model: 'Storage',
          localField: 'storage_id',
          foreignField: 'storage_id',
          justOne: true,
        },
        {
          path: 'receiver_id',
          model: 'ReceiverBlood',
          localField: 'receiver_id',      
          foreignField: 'receiver_id',  
          justOne: true,
        },
    ]);
    if (!exportBlood) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return exportBlood;
  }

  async create(dto: CreateExportBloodDto) {
    const storageExists = await this.storageService.findOne(dto.storage_id);
    if (!storageExists) {
      throw new NotFoundException("Storage not found");
    }
    const receiverExists = await this.receiverBloodsService.findOne(dto.receiver_id);
    if (!receiverExists) {
      throw new NotFoundException("Receiver Blood not found");
    }
    const created = new this.bloodExportModel(dto);
    return await created.save();
  }

  async update(id: string, dto: UpdateExportBloodDto) {
    const existingExportBlood = await this.bloodExportModel.findOne({ export_id: id});
    if(!existingExportBlood){
      throw new BadRequestException("Export Blood record not found");
    }
    if(dto.storage_id){
      const storage = await this.storageService.findOne(dto.storage_id);
      if (!storage) {
        throw new NotFoundException("Storage not found");
      }
    }
    if(dto.receiver_id){
      const receiver = await this.receiverBloodsService.findOne(dto.receiver_id);
      if (!receiver) {
        throw new NotFoundException("Receiver not found");
      }
    }
    const updated = await this.bloodExportModel.findOneAndUpdate({export_id: id}, dto, { new: true });
    if (!updated) {
      throw new NotFoundException("Export Blood record not found");
    }
    return updated;
  }

    async remove(id: string){
        const existingDonateBlood = await this.bloodExportModel.findOne({ export_id: id });
        if (!existingDonateBlood) {
            throw new NotFoundException("Export Blood record not found");
        }
        const deleted = await this.bloodExportModel.deleteOne({export_id: id});
        if (!deleted) {
            throw new NotFoundException("Export Blood record not found");
        }
        return {
            data: deleted,
        };
    }
}

