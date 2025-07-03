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
import { Status } from 'src/shared/enums/status.enum';
import { UpdateStorageDto } from 'src/storages/dtos/requests/update.dto';
import { UpdateReceiveBloodDto } from 'src/receiver_bloods/dtos/requests/update_receive_bloods.dto';
import { BloodsService } from 'src/bloods/bloods.service';

@Injectable()
export class BloodExportService {
  constructor(
    @InjectModel(BloodExport.name)
    private bloodExportModel: Model<BloodExport>,
    private storageService: StorageService,
    private receiverBloodsService: ReceiverBloodService,
    private bloodService: BloodsService,
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
          populate: [
            {
              path: 'user_id',
              model: 'User',
              localField: 'user_id',
              foreignField: 'user_id',
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
            }
          ]
        }
    ]);
    if (!exportBlood) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return exportBlood;
  }

  async create(dto: CreateExportBloodDto) {

    // check storage_id
    // get storage
    const storageExists = await this.storageService.findOne(dto.storage_id);
    if (!storageExists) {
      console.log(storageExists);
      throw new NotFoundException("Storage not found");
    }

    // check if storage is not available
    if (storageExists.ml === 0) {
      console.log(storageExists.ml);
      throw new BadRequestException("Storage is empty, cannot export");
    }

    // check if storage is already exported
    if (storageExists.current_status === Status.EXPORTED) {
      throw new BadRequestException("Storage is already exported, cannot export");
    }
    
    // get receive_id
    const receiverExists = await this.receiverBloodsService.findOne(dto.receiver_id);
    if (!receiverExists) {
      throw new NotFoundException("Receiver Blood not found");
    }

    const bloodObject = receiverExists.blood_id as unknown as { blood_id: string };
    const blood_id = bloodObject?.blood_id ?? '';

    if(storageExists.blood_id !== blood_id){
      throw new BadRequestException("Blood is not compatible with storage");
    }
    
    // update storage and receiver blood status
    await this.storageService.update(dto.storage_id, { current_status: Status.EXPORTED });
    await this.receiverBloodsService.update(dto.receiver_id, { status_receive: Status.COMPLETED });

    

    // create
    const created = new this.bloodExportModel({
      storage_id: dto.storage_id,
      receiver_id: dto.receiver_id,
      export_date: new Date(),
      status: Status.COMPLETED,
    });
    return created.save();
   
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
        return { deleted: deleted.deletedCount || 0 };
    }
}

