import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NominatimResponseItem } from '../dtos/responses/geoLocation.response';

@Injectable()
export class GeocodingService {
  constructor(private readonly httpService: HttpService) {}

  async getLatLng(address: string): Promise<{ lat: number; lng: number }> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await firstValueFrom(
      this.httpService.get<NominatimResponseItem[]>(url, {
        headers: {
          'User-Agent': 'bdss-app/1.0',
        },
      }),
    );

    const data = response.data;

    if (!data.length) {
      throw new NotFoundException(`Không tìm thấy vị trí cho địa chỉ: ${address}`);
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
}