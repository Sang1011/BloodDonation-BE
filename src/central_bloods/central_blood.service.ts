import { forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CentralBlood } from "./schemas/central_blood.schema";
import { CreateCentralBloodDto } from "./dtos/requests/create.dto";
import { UpdateCentralBloodDto } from "./dtos/requests/update.dto";
import aqp, { AqpResult } from "api-query-params";
import { WorkingHoursService } from "src/working_hours/working_hours.service";
import { removeVietnameseTones } from "src/shared/utils/removeVNTones";
import { GeocodingService } from "src/shared/services/geoLocation.service";

@Injectable()
export class CentralBloodService {
  constructor(
    @InjectModel(CentralBlood.name)
    private readonly centralBloodModel: Model<CentralBlood>,
    @Inject(forwardRef(() => WorkingHoursService))
    private readonly workingService: WorkingHoursService,
    private readonly geoLocationService: GeocodingService
  ) {}

  async create(dto: CreateCentralBloodDto) {
  const latest = await this.centralBloodModel
    .findOne()
    .sort({ centralBlood_id: -1 })
    .select('centralBlood_id')
    .lean();

  const counter = latest?.centralBlood_id ? latest.centralBlood_id + 1 : 1;
const query_address = removeVietnameseTones(dto.centralBlood_address);
    const { lat, lng } = await this.geoLocationService.getLatLng(query_address);
  const created = new this.centralBloodModel({
    ...dto,
    centralBlood_id: counter,
    position: {
        type: 'Point',
        coordinates: [lng, lat],
    },
  });

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
      .populate({
        path: 'working_id',
        model: 'WorkingHours',
        localField: 'working_id',
        foreignField: 'working_id',
        justOne: true,
      })
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
    const cb = await this.centralBloodModel.findOne({ centralBlood_id: num })
      .populate({
      path: 'working_id',
      model: 'WorkingHours',
      localField: 'working_id',
      foreignField: 'working_id',
      justOne: true,
    })
      .exec();
    if (!cb) throw new NotFoundException("Central blood not found");
    return cb;
  }

  async update(id: string, updateDto: UpdateCentralBloodDto) {
  const numId = Number.parseInt(id);
  const current = await this.centralBloodModel.findOne({ centralBlood_id: numId });

  if (!current) {
    throw new NotFoundException('Central not found');
  }

  let position = current.position;
  let fullAddress = current.centralBlood_address;

  // Nếu địa chỉ mới khác địa chỉ cũ thì cập nhật lại tọa độ
  if (updateDto.centralBlood_address && updateDto.centralBlood_address !== current.centralBlood_address) {
    const queryAddress = removeVietnameseTones(updateDto.centralBlood_address);
    const { lat, lng } = await this.geoLocationService.getLatLng(queryAddress);
    position = {
      type: 'Point',
      coordinates: [lng, lat],
    };
    fullAddress = updateDto.centralBlood_address;
  }

  const updated = await this.centralBloodModel.findOneAndUpdate(
    { centralBlood_id: numId },
    {
      ...updateDto,
      centralBlood_address: fullAddress,
      position,
    },
    { new: true },
  );

  if (!updated) {
    throw new NotFoundException('Central not found after update');
  }

  return updated;
}

  async remove(id: string) {
    const num = Number.parseInt(id);
    const deleted = await this.centralBloodModel.deleteOne({centralBlood_id: num});
    if (!deleted) throw new NotFoundException("Central blood not found");
    return { deleted: deleted.deletedCount || 0 };
  }
}
