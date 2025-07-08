import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import aqp, { AqpResult } from "api-query-params";
import { Storage } from "./schemas/storage.schema";
import { CreateStorageDto } from "./dtos/requests/create.dto";
import { UpdateStorageDto } from "./dtos/requests/update.dto";

@Injectable()
export class StorageService {
  constructor(
    @InjectModel(Storage.name)
    private readonly storageModel: Model<Storage>
  ) {}

  /**
     * Get customer donate blood history by email
     * Pick up donation_id from donate_blood table
     * Update 
  */
  async create(dto: CreateStorageDto) {
    const created = new this.storageModel(dto);
    return created.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.storageModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.storageModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate([
        {
          path: "donate_id",
          model: 'DonateBlood',
          localField: 'donate_id',      
          foreignField: 'donate_id',  
          justOne: true,
          select: 'infor_health status_donate date_donate',
          populate: [
            {
              path: "infor_health",
              model: 'InforHealth',
              localField: 'infor_health',
              foreignField: 'infor_health',
              justOne: true,
              select: 'user_id',
              populate: {
                path: 'user_id',
                model: 'User',
                localField: 'user_id',
                foreignField: 'user_id',
                justOne: true,
                select: 'fullname gender email ',
              }
            }, 
          ]
        },
        {
              path: 'centralBlood_id',
              model: 'CentralBlood',
              localField: 'centralBlood_id',      
              foreignField: 'centralBlood_id',  
              justOne: true,
              select: 'centralBlood_id centralBlood_name centralBlood_address',
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

  async findOne(id: string) {
    const cb = await this.storageModel.findOne({storage_id: id}).populate([
        {
          path: "donate_id",
          model: 'DonateBlood',
          localField: 'donate_id',      
          foreignField: 'donate_id',  
          justOne: true,
          select: 'infor_health status_donate date_donate',
          populate: [
            {
              path: "infor_health",
              model: 'InforHealth',
              localField: 'infor_health',
              foreignField: 'infor_health',
              justOne: true,
              select: 'user_id',
              populate: {
                path: 'user_id',
                model: 'User',
                localField: 'user_id',
                foreignField: 'user_id',
                justOne: true,
                select: 'fullname gender email ',
              }
            },  

          ]
        },
        {
          path: 'centralBlood_id',
          model: 'CentralBlood',
          localField: 'centralBlood_id',      
          foreignField: 'centralBlood_id',  
          justOne: true,
          select: 'centralBlood_id centralBlood_name centralBlood_address',
        },
      ])
    if (!cb) throw new NotFoundException("Không tìm thấy storage");
    return cb;
  }

  async update(id: string, updateDto: UpdateStorageDto): Promise<Storage> {
      const updated = await this.storageModel.findOneAndUpdate(
        { storage_id: id },
        updateDto,
        { new: true },
      );
  
      if (!updated) {
        throw new NotFoundException('Không tìm thấy storage');
      }
  
      return updated;
    }

  async remove(id: string) {
    const deleted = await this.storageModel.deleteOne({storage_id: id});
    if (!deleted) throw new NotFoundException("Không tìm thấy storage");
    return { deleted: deleted.deletedCount || 0 };
  }

  async existStorage(donate_id: string) {
    const storage = await this.storageModel.findOne({donate_id: donate_id});
    if (storage) return {exist: true, storage_id: storage.storage_id};
    return {exist: false};
  }
}
