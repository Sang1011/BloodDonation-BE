import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location, LocationDocument } from './schemas/location.schema';
import { CreateLocationDto } from './dtos/requests/create.dto';
import { UpdateLocationDto } from './dtos/requests/update.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: Model<LocationDocument>,
  ) { }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const created = new this.locationModel(createLocationDto);
    const saved = await created.save();
    return saved;
  }


  async findAll(): Promise<Location[]> {
    return this.locationModel.find();
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
