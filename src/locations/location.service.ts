import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Location } from './schemas/location.schema';
import { CreateLocationDto } from './dtos/requests/create.dto';
import { UpdateLocationDto } from './dtos/requests/update.dto';
import aqp, { AqpResult } from "api-query-params";
import { haversineDistance } from 'src/shared/utils/calculateDistance';
import { removeVietnameseTones } from 'src/shared/utils/removeVNTones';
import { GeocodingService } from 'src/shared/services/geoLocation.service';
import { BaseModel } from 'src/shared/interfaces/soft-delete-model.interface';

@Injectable()
export class LocationService {
  constructor(
    @InjectModel(Location.name)
    private readonly locationModel: BaseModel<Location>,
    private readonly geolocationService: GeocodingService
  ) { }

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const {
      // house_number,
      // road,
      ward,
      district,
      city,
      ...rest
    } = createLocationDto;

    const full_address = [
      // house_number,
      // road,
      ward,
      district,
      city,
    ]
      .filter(Boolean)
      .join(', ');
    const query_address = removeVietnameseTones(full_address);
    const { lat, lng } = await this.geolocationService.getLatLng(query_address);
    const created = new this.locationModel({
      ...createLocationDto,
      full_address: full_address,
      position: {
        type: 'Point',
        coordinates: [lng, lat],
      },
    });
    const saved = await created.save();
    return saved;
  }

  async findNearbyUsersWithDistance(
    userLat: number,
    userLng: number,
    radiusInKm: number
  ): Promise<(Location & { distance: number })[]> {
    const locations = await this.locationModel.find({
      position: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [userLng, userLat],
          },
          $maxDistance: radiusInKm * 1000,
        },
      },
    });

    return locations.map((loc) => {
      const [lng, lat] = loc.position.coordinates;

      const isSameCoords =
        Math.abs(lat - userLat) < 0.00001 &&
        Math.abs(lng - userLng) < 0.00001;

      const dist = haversineDistance(userLat, userLng, lat, lng);

      return {
        ...loc.toObject(),
        distance: isSameCoords || dist < 1 ? 1 : Math.round(dist),
      };
    });
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
      throw new NotFoundException('Không tìm thấy địa điểm');
    }
    return location;
  }

  async update(location_id: string, updateDto: UpdateLocationDto): Promise<Location> {
    const current = await this.locationModel.findOne({ location_id });

    if (!current) {
      throw new NotFoundException('Không tìm thấy địa điểm');
    }

    // Xác định xem có cần update position không
    const shouldUpdatePosition =
      // updateDto.house_number !== undefined ||
      // updateDto.road !== undefined ||
      updateDto.ward !== undefined ||
      updateDto.district !== undefined ||
      updateDto.city !== undefined;

    // Giữ vị trí hiện tại mặc định
    let position = current.position;

    // Lấy dữ liệu mới (hoặc giữ cũ nếu không update)
    // const house_number = updateDto.house_number ?? current.house_number;
    // const road = updateDto.road ?? current.road;
    const ward = updateDto.ward ?? current.ward;
    const district = updateDto.district ?? current.district;
    const city = updateDto.city ?? current.city;

    // Build lại địa chỉ đầy đủ
    const addressParts = [
      // house_number,
      // road,
      ward,
      district,
      city
    ];
    const full_address = addressParts.filter(Boolean).join(', ');
    // Nếu có thay đổi địa chỉ thì cập nhật position
    if (shouldUpdatePosition) {
      const query_address = removeVietnameseTones(full_address);
      const { lat, lng } = await this.geolocationService.getLatLng(query_address);
      position = {
        type: 'Point',
        coordinates: [lng, lat],
      };
    }

    const updated = await this.locationModel.findOneAndUpdate(
      { location_id },
      {
        ...updateDto,
        position,
        full_address,
      },
      { new: true },
    );

    return updated;
  }

  async softRemove(id: string) {
  const deleted = await this.locationModel.softDelete(id);
  if (!deleted) {
    throw new NotFoundException("Không tìm thấy địa điểm");
  }
  return { deleted: deleted.modifiedCount };
}
}
