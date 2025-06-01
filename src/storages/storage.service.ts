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
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',      
          foreignField: 'blood_id',  
          justOne: true,
        },
      ])
    if (!cb) throw new NotFoundException("Storage not found");
    return cb;
  }

  async update(id: string, updateDto: UpdateStorageDto): Promise<Storage> {
      const updated = await this.storageModel.findOneAndUpdate(
        { storage_id: id },
        updateDto,
        { new: true },
      );
  
      if (!updated) {
        throw new NotFoundException('Storage not found');
      }
  
      return updated;
    }

  async remove(id: string) {
    const deleted = await this.storageModel.deleteOne({storage_id: id});
    if (!deleted) throw new NotFoundException("Storage not found");
    return deleted;
  }
}
