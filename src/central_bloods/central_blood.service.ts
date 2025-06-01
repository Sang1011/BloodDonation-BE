import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CentralBlood } from "./schemas/central_blood.schema";
import { CreateCentralBloodDto } from "./dtos/requests/create.dto";
import { UpdateCentralBloodDto } from "./dtos/requests/update.dto";
import aqp, { AqpResult } from "api-query-params";

@Injectable()
export class CentralBloodService {
  constructor(
    @InjectModel(CentralBlood.name)
    private readonly centralBloodModel: Model<CentralBlood>
  ) {}

  async create(dto: CreateCentralBloodDto) {
    const count = await this.centralBloodModel.countDocuments();
    let counter = 1;
    if (count > 0) counter = count + 1; 
    const created = new this.centralBloodModel({...dto, centralBlood_id: counter});
    return created.save();
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.centralBloodModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.centralBloodModel.find(filter)
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
    const cb = await this.centralBloodModel.findOne({centralBlood_id: num})
    if (!cb) throw new NotFoundException("Central blood not found");
    return cb;
  }

  async update(id: string, updateDto: UpdateCentralBloodDto): Promise<CentralBlood> {
      const updated = await this.centralBloodModel.findOneAndUpdate(
        { centralBlood_id: id },
        updateDto,
        { new: true },
      );
  
      if (!updated) {
        throw new NotFoundException('Central not found');
      }
  
      return updated;
    }

  async remove(id: string) {
    const num = Number.parseInt(id);
    const deleted = await this.centralBloodModel.deleteOne({centralBlood_id: num});
    if (!deleted) throw new NotFoundException("Central blood not found");
    return deleted;
  }
}
