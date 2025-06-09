import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { UpdateNotificationDto } from './dtos/requests/update-noti.request';
import { CreateNotificationDto } from './dtos/requests/create-noti.request';
import aqp, { AqpResult } from "api-query-params";
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notifyModel: Model<Notification>,
    private readonly gateway: NotificationGateway
  ) { }

  // @Cron('15 2 * * *') 
  // handleDailyNotification() {
  //   this.gateway.sendToUser('userIdExample', { message: 'Test notify lúc 2:15' });
  // }

  async create(createNotiDTO : CreateNotificationDto) {
    const isExist = this.notifyModel.findOne({user_id: createNotiDTO.user_id, type: createNotiDTO.type, title: createNotiDTO.title});
    if(isExist){
      throw new BadRequestException("Notification already existed")
    }
    const noti = new this.notifyModel(createNotiDTO);
    const saved = await noti.save();
    // this.gateway.sendToUser(createNotiDTO.user_id, createNotiDTO);
    return saved;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort }: AqpResult = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        const defaultCurrent = currentPage ? currentPage : 1;
        const offset = (+defaultCurrent - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.notifyModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.notifyModel.find(filter)
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

    async findLengthNotiByUser(user_id: string) {
      let count = 0;
      const findListByUser = await this.notifyModel.find({user_id: user_id});
      if(findListByUser){
        count = findListByUser.length
      }
      return count;
    }

    async findOne(id: string) {
        const findNews = await this.notifyModel.findOne({ notification_id: id }).populate(
          {
            path: 'user_id',
            model: 'User',
            localField: 'user_id',      
            foreignField: 'User_id',  
            justOne: true,
          },
        );
        if (!findNews) {
            throw new BadRequestException("Notification not found");
        }
        return findNews;
    }

    async update(id: string, updateNotiDTO: UpdateNotificationDto) {
        const updated = await this.notifyModel.findOneAndUpdate(
            { notification_id: id },
            updateNotiDTO,
            { new: true },
        );

        if (!updated) {
            throw new BadRequestException("Notification not found");
        }

        return updated;
    }

  async remove(id: string) {
    const deleted = await this.notifyModel.deleteOne({ notification_id: id });
    if (!deleted) throw new BadRequestException("Notification not found");
    return { deleted: deleted.deletedCount || 0 };
  }
}
