import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';
import { CreateLocationDto } from './dtos/requests/create.dto';
import { UpdateLocationDto } from './dtos/requests/update.dto';
import aqp, { AqpResult } from "api-query-params";

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<Location>,
  ) { }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    if(createLocationDto.ipAddress)
    const created = new this.locationModel(createLocationDto);
    const saved = await created.save();
    return saved;
  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.locationModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.locationModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      // .select()
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

  async findById(location_id: string): Promise<Location> {
    const location = await this.locationModel.findOne({ location_id });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  async update(location_id: string, updateDto: UpdateLocationDto): Promise<Location> {
    const updated = await this.locationModel.findOneAndUpdate(
      { location_id },
      updateDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Location not found');
    }

    return updated;
  }

}
