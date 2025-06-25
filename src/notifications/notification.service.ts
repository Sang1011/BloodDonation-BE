import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { UpdateNotificationDto } from './dtos/requests/update-noti.request';
import { CreateNotificationDto } from './dtos/requests/create-noti.request';
import aqp, { AqpResult } from "api-query-params";
import { NotificationGateway } from './notification.gateway';
import { BaseModel } from 'src/shared/interfaces/soft-delete-model.interface';
import * as moment from 'moment';
import { DonateBloodService } from 'src/donate_bloods/donate_bloods.service';
import { ReceiverBloodService } from 'src/receiver_bloods/receiver.service';
import { Cron } from '@nestjs/schedule';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name) private notifyModel: BaseModel<Notification>,
    private readonly gateway: NotificationGateway,
    private readonly donateBloodService: DonateBloodService,
    private readonly receiveBloodService: ReceiverBloodService,
    private readonly inforHealthService: InforHealthService
  ) { }
  private readonly logger = new Logger(Notification.name);

  async sendNotiAllUser(title: string, message: string, type: string) {
    const getAll = await this.findAll(1, 999, "");
    const { result } = getAll;

    const notiList = [];

    for (const user of result) {
      const noti = await this.notifyModel.create({
        user_id: user.user_id,
        title,
        message,
        type,
      });
      notiList.push({
        notification_id: noti.notification_id,
        user_id: noti.user_id,
        title: noti.title,
        message: noti.message,
        type: noti.type,
        is_read: noti.is_read,
        created_at: noti.created_at,
      });
    }

    this.gateway.broadcast({
      event: 'Broadcast Notification',
      data: notiList,
    });
  }


  @Cron('0 0 * * *') // 7h sáng giờ VN
  async handleBloodDonationReminder() {
    const [donateTomorrow, donateToday] = await Promise.all([
      this.donateBloodService.getListScheduleTomorrow(),
      this.donateBloodService.getListScheduleToday()
    ]);

    await this.sendReminderForScheduleDonate(
      donateTomorrow,
      'Ngày mai là ngày bạn đăng ký hiến máu, chuẩn bị kỹ nhé!',
      'Nhắc lịch hiến máu');
    await this.sendReminderForScheduleDonate(
      donateToday,
      'Chúc bạn có một buổi hiến máu thuận lợi',
      'Hôm nay là ngày hiến máu');
    this.logger.log(`Đã gửi thông báo hiến máu cho 
      ${donateTomorrow.length + donateToday.length} người`);
  }

  @Cron('0 0 * * *') // 7h sáng giờ VN
  async handleBloodReceiveReminder() {
    const [receiveToday, receiveTomorrow] = await Promise.all([
      this.receiveBloodService.getListScheduleToday(),
      this.receiveBloodService.getListScheduleTomorrow(),
    ]);

    await this.sendReminderForScheduleReceive(
      receiveTomorrow,
      'Ngày mai bạn sẽ nhận máu, chuẩn bị sức khỏe nhé!',
      'Nhắc lịch nhận máu',
    );

    await this.sendReminderForScheduleReceive(
      receiveToday,
      'Hôm nay bạn sẽ nhận máu, hãy đến đúng giờ!',
      'Hôm nay là ngày nhận máu',
    );

    this.logger.log(`Đã gửi thông báo hiến máu cho 
      ${receiveTomorrow.length + receiveToday.length} người`);
  }

  private async sendReminderForScheduleDonate(
    schedules: { infor_health: string }[],
    message: string,
    title: string,
  ) {
    if (!schedules.length) return;

    for (const item of schedules) {
      const info = await this.inforHealthService.findOne(item.infor_health);
      const noti = await this.notifyModel.create({
        user_id: info.user_id,
        title,
        message,
        type: 'REMINDER',
      });

      this.gateway.sendToUser(info.user_id, {
        notification_id: noti.notification_id,
        user_id: noti.user_id,
        title: noti.title,
        message: noti.message,
        type: noti.type,
        is_read: noti.is_read,
        created_at: noti.created_at,
      });
    }
  }

  private async sendReminderForScheduleReceive(
    schedules: { user_id: string }[],
    message: string,
    title: string,
  ) {
    if (!schedules.length) return;

    for (const item of schedules) {
      const userId = item.user_id;

      const noti = await this.notifyModel.create({
        user_id: userId,
        title,
        message,
        type: 'REMINDER',
      });

      this.gateway.sendToUser(userId, {
        notification_id: noti.notification_id,
        user_id: noti.user_id,
        title: noti.title,
        message: noti.message,
        type: noti.type,
        is_read: noti.is_read,
        created_at: noti.created_at,
      });
    }
  }

  async create(createNotiDTO: CreateNotificationDto) {
    const isExist = await this.notifyModel.findOne({
      user_id: createNotiDTO.user_id,
      title: createNotiDTO.title,
    });
    this.logger.log("Before check");

    if (isExist) {
      throw new BadRequestException("Notification already existed");
    }

    const noti = new this.notifyModel(createNotiDTO);
    const saved = await noti.save();

    this.logger.log("created");

    this.gateway.sendToUser(saved.user_id, {
      notification_id: saved.notification_id,
      user_id: saved.user_id,
      title: saved.title,
      message: saved.message,
      type: saved.type,
      is_read: saved.is_read,
      created_at: saved.created_at,
    });

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
    const findListByUser = await this.notifyModel.find({ user_id: user_id });
    if (findListByUser) {
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
    const deleted = await this.notifyModel.softDelete(id);
    if (!deleted) throw new BadRequestException("Notification not found");
    return { deleted: deleted.modifiedCount };
  }
}
