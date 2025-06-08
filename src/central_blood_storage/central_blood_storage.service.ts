import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import aqp, { AqpResult } from "api-query-params";
import { UpdateCentralBloodStorageDto } from "./dtos/requests/update.dto";
import { CreateCentralBloodStorageDto } from "./dtos/requests/create.dto";
import { CentralStorage } from "./schemas/central_blood_storage.schema";

@Injectable()
export class CentralStorageService {
  constructor(
    @InjectModel(CentralStorage.name)
    private readonly centralStorageModel: Model<CentralStorage>
  ) {}

  async create(dto: CreateCentralBloodStorageDto) {
    const count = await this.centralStorageModel.countDocuments();
    let counter = 1;
    if (count > 0) counter = count + 1;
    const created = new this.centralStorageModel({ ...dto, centralStorage_id: counter });
    return created.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.centralStorageModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.centralStorageModel.find(filter)
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

  async findOne(id: string) {
    const num = Number.parseInt(id);
    const cb = await this.centralStorageModel.findOne({centralStorage_id: num})
    if (!cb) throw new NotFoundException("Central blood not found");
    return cb;
  }

  async update(id: string, updateDto: UpdateCentralBloodStorageDto): Promise<CentralStorage> {
      const updated = await this.centralStorageModel.findOneAndUpdate(
        { centralStorage_id: id },
        updateDto,
        { new: true },
      );
  
      if (!updated) {
        throw new NotFoundException('Central Storage not found');
      }
  
      return updated;
    }

  async remove(id: string) {
    const num = Number.parseInt(id);
    const deleted = await this.centralStorageModel.deleteOne({centralStorage_id: num});
    if (!deleted) throw new NotFoundException("Central Storage not found");
    return { deleted: deleted.deletedCount || 0 };
  }
}
