import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceiverBlood, ReceiverBloodDocument } from './schemas/receiver_blood.schema';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';
import { BloodsService } from 'src/bloods/bloods.service';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';
import { CreateReceiveBloodDto } from './dtos/requests/create_receive_bloods.dto';
import { UpdateReceiveBloodDto } from './dtos/requests/update_receive_bloods.dto';
import { Status } from 'src/shared/enums/status.enum';
import { UsersService } from 'src/users/users.service';
import { getDateRangeFor } from 'src/shared/utils/getTime';
import { IUser } from 'src/shared/interfaces/user.interface';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationTemplates } from 'src/shared/enums/notification.enum';

@Injectable()
export class ReceiverBloodService {
  constructor(
    @InjectModel(ReceiverBlood.name)
    private receiverBloodModel: Model<ReceiverBlood>,
    private inforHealthsService: InforHealthService,
    private bloodsService: BloodsService,
    @Inject(forwardRef(() => NotificationService))
    private notifyService: NotificationService,
    private usersService: UsersService,
    private centralBloodService: CentralBloodService
  ) { }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultCurrent = currentPage || 1;
    const defaultLimit = limit || 10;
    const offset = (defaultCurrent - 1) * defaultLimit;

    const totalItems = await this.receiverBloodModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.receiverBloodModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate([
        {
          path: 'user_id',
          model: 'User',
          localField: 'user_id',
          foreignField: 'user_id',
          justOne: true,
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',
          foreignField: 'blood_id',
          justOne: true,
        },
        {
          path: 'centralBlood_id',
          model: 'CentralBlood',
          localField: 'centralBlood_id',
          foreignField: 'centralBlood_id',
          justOne: true,
          select: 'centralBlood_id centralBlood_name centralBlood_address ',
        },
      ])
      .exec();

    return {
      meta: {
        current: defaultCurrent,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      results
    };
  }

  async findOne(id: string) {
    const receiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id }).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);
    if (!receiverBlood) {
      throw new NotFoundException("Không tìm thấy bản ghi nhận máu với ID đã cung cấp");
    }
    return receiverBlood;
  }

  async getListScheduleTomorrow() {
    const { from, to } = getDateRangeFor(1);
    const tomorrowList = await this.receiverBloodModel.find({
      date_receiver: { $gte: from, $lt: to },
    });
    return tomorrowList;
  }

  async getListScheduleToday() {
    const { from, to } = getDateRangeFor(0);
    const todayList = await this.receiverBloodModel.find({
      date_receiver: { $gte: from, $lt: to },
    });
    return todayList;
  }

  async create(user: IUser, dto: CreateReceiveBloodDto) {
    const userFound = await this.usersService.findOne(user.user_id);
    if (!userFound) {
      throw new NotFoundException("Người dùng không tồn tại");
    }
    const checked = await this.checkDuplicate(dto);
    if (!checked) {
      throw new BadRequestException("Dữ liệu không hợp lệ");
    }
    if (new Date(dto.date_receiver) <= new Date()) {
      throw new BadRequestException("Ngày phải ở tương lai");
    }

    const inforHealth = await this.inforHealthsService.findByUserId(user.user_id);

    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }
    // nếu đang có đơn hiến máu thì không được đăng ký nhận
    if (inforHealth.is_regist_donate) {
      throw new BadRequestException("Bạn không thể đăng ký nhận máu khi đang có đơn hiến máu");
    }

    // nếu đang có đơn nhận máu thì không được đăng ký nhận
    if (inforHealth.is_regist_receive) {
      throw new BadRequestException("Bạn không thể đăng ký nhận máu khi đang có đơn nhận máu");
    }

    const created = await new this.receiverBloodModel({ ...dto, user_id: user.user_id }).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);
    if (user.role = "MEMBER") {
      await this.notifyService.create({
        user_id: user.user_id,
        title: NotificationTemplates.BOOKING_RECEIVE_SUCCESS.title,
        message: NotificationTemplates.BOOKING_RECEIVE_SUCCESS.message,
        type: NotificationTemplates.BOOKING_RECEIVE_SUCCESS.type,
      });
    }
    await this.inforHealthsService.updateForReceive(user.user_id, true);
    return await created.save();
  }

  async checkDuplicate(dto: CreateReceiveBloodDto) {
    const blood = await this.bloodsService.findOne(dto.blood_id);
    if (!blood) {
      throw new NotFoundException("Không tìm thấy máu với ID đã cung cấp");
    }
    const centralBlood = await this.centralBloodService.findOne(dto.centralBlood_id);
    if (!centralBlood) {
      throw new NotFoundException("Không tìm thấy trung tâm máu với ID đã cung cấp");
    }
    return true;
  }

  async update(id: string, dto: UpdateReceiveBloodDto) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
    if (!existingReceiverBlood) {
      throw new BadRequestException("Không tìm thấy bản ghi nhận máu với ID đã cung cấp");
    }
    if (dto.blood_id) {
      const blood = await this.bloodsService.findOne(dto.blood_id);
      if (!blood) {
        throw new NotFoundException("Không tìm thấy máu với ID đã cung cấp");
      }
    }
    if (new Date(dto.date_receiver) <= new Date()) {
      throw new BadRequestException("Ngày phải ở tương lai");
    }
    const updated = await this.receiverBloodModel.findOneAndUpdate({ receiver_id: id }, dto).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);
    if (!updated) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    if (updated.status_receive === Status.COMPLETED || updated.status_receive === Status.CANCELLED) {
      await this.inforHealthsService.updateForReceive(existingReceiverBlood.user_id, false);
      return updated.save();
    }
  }

  async cancelSchedule(user: IUser, id: string) {
    const existingDonateBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
    if (!existingDonateBlood) {
      throw new BadRequestException("Không tìm thấy bản ghi nhận máu với ID đã cung cấp");
    }
    const dto: Partial<UpdateReceiveBloodDto> = {
      status_receive: Status.CANCELLED
    }
    const updated = await this.receiverBloodModel.findOneAndUpdate({ receiver_id: id }, dto, { new: true });
    if (!updated) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    await this.inforHealthsService.updateForDonate(user.user_id, false);
    if (user.role = "MEMBER") {
      await this.notifyService.create({
        user_id: user.user_id,
        title: NotificationTemplates.CANCELLED_RECEIVE_SCHEDULE.title,
        message: NotificationTemplates.CANCELLED_RECEIVE_SCHEDULE.message,
        type: NotificationTemplates.CANCELLED_RECEIVE_SCHEDULE.type,
      });
    }
    return updated;
  }

  async remove(id: string) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
    if (!existingReceiverBlood) {
      throw new NotFoundException("Không tìm thấy bản ghi nhận máu với ID đã cung cấp");
    }
    const deleted = await this.receiverBloodModel.deleteOne({ receiver_id: id });
    if (!deleted) {
      throw new NotFoundException(MESSAGES.DONATE_BLOOD.NOT_FOUND);
    }
    return { deleted: deleted.deletedCount || 0 };
  }


  async findListReceiveActive() {
    const getList = await this.receiverBloodModel.find({
      status_receiver: Status.PENDING,
    });

    const userIds = getList.map(d => d.user_id?.toString());
    const users = await this.usersService.findByListId(userIds);

    const result = [];

    for (const rv of getList) {
      const matchedInfor = users.find(
        user => user.user_id.toString() === rv.user_id?.toString()
      );

      if (matchedInfor) {
        result.push({
          user_id: matchedInfor.user_id,
          requestType: rv.type || 'DEFAULT',
        });
      }
    }
    return result;
  }

  async findListReceiveComplete() {
    const getList = await this.receiverBloodModel.find({
      status_receiver: Status.COMPLETED
    })
    const userIds = getList.map(d => d.user_id?.toString());
    const users = await this.usersService.findByListId(userIds);

    const result = [];

    for (const rv of getList) {
      const matchedInfor = users.find(
        user => user.user_id.toString() === rv.user_id?.toString()
      );

      if (matchedInfor) {
        result.push({
          user_id: matchedInfor.user_id,
          requestType: rv.type || 'DEFAULT',
        });
      }
    }
    return result;
  }

  async getListReceiveByCentralBlood(centralBlood_id: string) {
    const getList = await this.receiverBloodModel.find({
      centralBlood_id: centralBlood_id
    }).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);

    return getList;
  }

  async getListReceiveByUser(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const getList = await this.receiverBloodModel.find({
      user_id: user.user_id
    }).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);

    return getList;
  }

  async getAllReceiveBloodByUser(user_id: string) {
    const getList = await this.receiverBloodModel.find({
      user_id: user_id
    }).populate([
      {
        path: 'user_id',
        model: 'User',
        localField: 'user_id',
        foreignField: 'user_id',
        justOne: true,
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: 'centralBlood_id centralBlood_name centralBlood_address ',
      },
    ]);
    return getList;
  }
}

