import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DonateBlood, DonateBloodDocument } from './schemas/donate_blood.schema';
import { CreateDonateBloodDto } from './dto/request/create_donate_bloods.dto';
import { UpdateDonateBloodDto } from './dto/request/update_donate_bloods.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from 'api-query-params';
import { BloodsService } from 'src/bloods/bloods.service';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';
import { IUser } from 'src/shared/interfaces/user.interface';
import { Status } from 'src/shared/enums/status.enum';
import { UsersService } from 'src/users/users.service';
import { StorageService } from 'src/storages/storage.service';
import { CreateStorageDto } from 'src/storages/dtos/requests/create.dto';
import e from 'express';
import { getDateRangeFor, getTomorrow } from 'src/shared/utils/getTime';
import moment from 'moment';
import { NotificationService } from 'src/notifications/notification.service';
import { NotificationTemplates } from 'src/shared/enums/notification.enum';
import { checkDonateInterval } from 'src/shared/helpers/calculateDateIntervals.helper';

@Injectable()
export class DonateBloodService {
  constructor(
    @InjectModel(DonateBlood.name)
    private donateBloodModel: Model<DonateBlood>,
    private inforHealthsService: InforHealthService,
    @Inject(forwardRef(() => NotificationService))
    private notifyService: NotificationService,
    private centralBloodService: CentralBloodService,
    private usersService: UsersService,
    private storageService: StorageService,
  ) { }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const defaultCurrent = currentPage || 1;
    const defaultLimit = limit || 10;
    const offset = (defaultCurrent - 1) * defaultLimit;

    const totalItems = await this.donateBloodModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const results = await this.donateBloodModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .populate([
        {
          path: "infor_health",
          model: 'InforHealth',
          localField: 'infor_health',
          foreignField: 'infor_health',
          justOne: true,
          select: '-deleted_at -is_deleted',
          populate: {
            path: 'user_id',
            model: 'User',
            localField: 'user_id',
            foreignField: 'user_id',
            justOne: true,
            select: 'fullname gender email ',
          }
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',
          foreignField: 'blood_id',
          justOne: true,
          select: 'blood_id',
        },
        {
          path: 'centralBlood_id',
          model: 'CentralBlood',
          localField: 'centralBlood_id',
          foreignField: 'centralBlood_id',
          justOne: true,
          select: '-deleted_at -is_deleted',
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
    const donateBlood = await (await this.donateBloodModel.findById(id)).populate([
      {
        path: "infor_health",
        model: 'InforHealth',
        localField: 'infor_health',
        foreignField: 'infor_health',
        justOne: true,
        select: '-deleted_at -is_deleted',
        populate: {
          path: 'user_id',
          model: 'User',
          localField: 'user_id',
          foreignField: 'user_id',
          justOne: true,
          select: 'fullname gender email ',
        }
      },
      {
        path: 'blood_id',
        model: 'Blood',
        localField: 'blood_id',
        foreignField: 'blood_id',
        justOne: true,
        select: 'blood_id',
      },
      {
        path: 'centralBlood_id',
        model: 'CentralBlood',
        localField: 'centralBlood_id',
        foreignField: 'centralBlood_id',
        justOne: true,
        select: '-deleted_at -is_deleted',
      },
    ])
    if (!donateBlood) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    return donateBlood;
  }

  async create(user: IUser, dto: CreateDonateBloodDto) {
    const inforHealth = await this.inforHealthsService.findByUserId(user.user_id);

    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }

    if (new Date(dto.date_donate) <= new Date()) {
      throw new BadRequestException("Ngày hiến máu phải ở tương lai");
    }

    // Chỉ được đăng kí 1 lần 
    const existingDonateBlood = await this.donateBloodModel.findOne({ infor_health: inforHealth.infor_health, date_donate: dto.date_donate });
    if (existingDonateBlood) {
      throw new BadRequestException("Bạn đã đăng ký hiến máu vào ngày này");
    }

    // check thời gian nghỉ là 3 tháng (12 tuần) 
    dto.date_donate = new Date(dto.date_donate);
    const isRestCompleted = checkDonateInterval(inforHealth.latest_donate, dto.date_donate);
    if (!isRestCompleted) {
      throw new BadRequestException(`Bạn phải chờ ít nhất 3 tháng giữa các lần hiến máu`);
    }

    // nếu đang có đơn hiến máu thì không được đăng ký hiến
    if (inforHealth.is_regist_donate) {
      throw new BadRequestException("Bạn không thể đăng ký hiến máu khi đang có đơn hiến máu hoạt động");
    }

    // nếu đang có đơn nhận máu thì không được đăng ký hiến
    if (inforHealth.is_regist_receive) {
      throw new BadRequestException("Bạn không thể đăng ký hiến máu khi đang có đơn nhận máu hoạt động");
    }

    const checked = await this.checkDuplicate(dto);
    if (!checked) {
      throw new BadRequestException("Dữ liệu không hợp lệ");
    }

    const created = await new this.donateBloodModel({
      ...dto,
      infor_health: inforHealth.infor_health,
      blood_id: inforHealth.blood_id,
      date_register: new Date(),
    }).populate([
      {
        path: 'infor_health',
        model: 'InforHealth',
        localField: 'infor_health',
        foreignField: 'infor_health',
        justOne: true,
        populate: {
          path: 'user_id',
          model: 'User',
          localField: 'user_id',
          foreignField: 'user_id',
          justOne: true,
        }
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
        title: NotificationTemplates.BOOKING_DONATE_SUCCESS.title,
        message: NotificationTemplates.BOOKING_DONATE_SUCCESS.message,
        type: NotificationTemplates.BOOKING_DONATE_SUCCESS.type,
      });
    }
    await this.inforHealthsService.updateForDonate(user.user_id, true);
    return created.save();
  }

  async checkDuplicate(dto: CreateDonateBloodDto) {
    // const inforHealth = await this.inforHealthsService.findById(dto.infor_health);
    // if (!inforHealth) {
    //   throw new NotFoundException("InforHealth not found");
    // }
    // const blood = await this.bloodsService.findOne(+dto.blood_id);
    // if (!blood) {
    //   throw new NotFoundException("Blood not found");
    // }
    const centralBlood = await this.centralBloodService.findOne(dto.centralBlood_id.toString());
    if (!centralBlood) {
      throw new NotFoundException("Không tìm thấy trung tâm máu");
    }
    return true;
  }

  /**
   * Khi staff cập nhập thông tin hiến máu 
   * Máu, số lượng, ngày hiến máu
   * Donate Status là COMPLETED
   * Đã hiến máu và cập nhập dữ liệu thành công
   * Thì tạo hoặc cập nhật storage record
   */
  async updateForStaff(id: string, dto: UpdateDonateBloodDto) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new BadRequestException("Không tìm thấy thông tin hiến máu");
    }
    const updated = await this.donateBloodModel.findOneAndUpdate({ donate_id: id }, dto, { new: true });
    if (!updated) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    const inforHealth = await this.inforHealthsService.findById(updated.infor_health);
    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }
    if (dto.status_donate === Status.COMPLETED) {
      const storage: CreateStorageDto = {
        donate_id: id,
        blood_id: updated.blood_id,
        centralBlood_id: updated.centralBlood_id,
        date: updated.date_donate,
        ml: updated.ml,
        unit: updated.unit,
        expired_date: new Date(updated.date_donate.getTime() + 1000 * 60 * 60 * 24 * 30),
        current_status: Status.STORAGE,
      }
      const existStorage = await this.storageService.existStorage(id);
      if (existStorage.exist) {
        await this.storageService.update(existStorage.storage_id, storage);
      } else {
        await this.storageService.create(storage);
      }
      await this.inforHealthsService.updateForDonate(inforHealth.user_id, false);
    } else if (dto.status_donate === Status.CANCELLED) {
      await this.inforHealthsService.updateForDonate(inforHealth.user_id, false);
    }
    return updated;
  }

  async update(id: string, dto: UpdateDonateBloodDto) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new BadRequestException("Không tìm thấy thông tin hiến máu");
    }
    const updated = await this.donateBloodModel.findOneAndUpdate({ donate_id: id }, dto, { new: true });
    if (!updated) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    const inforHealth = await this.inforHealthsService.findById(updated.infor_health);
    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }
    if (dto.status_donate === Status.COMPLETED) {
      const storage: CreateStorageDto = {
        donate_id: id,
        blood_id: updated.blood_id,
        centralBlood_id: updated.centralBlood_id,
        date: updated.date_donate,
        ml: updated.ml,
        unit: updated.unit,
        expired_date: new Date(updated.date_donate.getTime() + 1000 * 60 * 60 * 24 * 30),
        current_status: updated.status_donate,
      }
      const existStorage = await this.storageService.existStorage(id);
      if (existStorage.exist) {
        await this.storageService.update(existStorage.storage_id, storage);
      } else {
        await this.storageService.create(storage);
      }
      await this.inforHealthsService.updateForDonate(inforHealth.user_id, false);
    } else if (dto.status_donate === Status.CANCELLED) {
      await this.inforHealthsService.updateForDonate(inforHealth.user_id, false);
    }
    return updated;
  }

  async cancelSchedule(user: IUser, id: string) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new BadRequestException("Không tìm thấy thông tin hiến máu");
    }
    const dto: Partial<UpdateDonateBloodDto> = {
      status_donate: Status.CANCELLED
    }
    const updated = await this.donateBloodModel.findOneAndUpdate({ donate_id: id }, dto, { new: true });
    if (!updated) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    await this.inforHealthsService.updateForDonate(user.user_id, false);
    if (user.role = "MEMBER") {
      await this.notifyService.create({
        user_id: user.user_id,
        title: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.title,
        message: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.message,
        type: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.type,
      });
    }
    return updated;
  }

  async remove(user: IUser, id: string) {
    const existingDonateBlood = await this.donateBloodModel.findOne({ donate_id: id });
    if (!existingDonateBlood) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    const deleted = await this.donateBloodModel.deleteOne({ donate_id: id });
    if (!deleted) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    await this.inforHealthsService.updateForDonate(user.user_id, false);
    if (user.role = "MEMBER") {
      await this.notifyService.create({
        user_id: user.user_id,
        title: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.title,
        message: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.message,
        type: NotificationTemplates.CANCELLED_DONATE_SCHEDULE.type,
      });
    }
    return { deleted: deleted.deletedCount || 0 };
  }

  async getDonateBlood(user: IUser) {
    const inforHealth = await this.inforHealthsService.findByUserId(user.user_id);
    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }
    const donateBlood = await this.donateBloodModel.find({ infor_health: inforHealth.infor_health }).select('-deleted_at -is_deleted')
      .populate([
        {
          path: "infor_health",
          model: 'InforHealth',
          localField: 'infor_health',
          foreignField: 'infor_health',
          justOne: true,
          select: '-deleted_at -is_deleted',
          populate: {
            path: 'user_id',
            model: 'User',
            localField: 'user_id',
            foreignField: 'user_id',
            justOne: true,
            select: 'fullname gender email ',
          }
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',
          foreignField: 'blood_id',
          justOne: true,
          select: 'blood_id',
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
    if (!donateBlood) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    return donateBlood;
  }

  async getDonateBloodByEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException("Không tìm thấy người dùng");
    }
    const inforHealth = await this.inforHealthsService.findByUserId(user.user_id);
    if (!inforHealth) {
      throw new NotFoundException("Không tìm thấy thông tin sức khỏe");
    }
    const donateBlood = await this.donateBloodModel.find({ infor_health: inforHealth.infor_health }).select('-deleted_at -is_deleted')
      .populate([
        {
          path: "infor_health",
          model: 'InforHealth',
          localField: 'infor_health',
          foreignField: 'infor_health',
          justOne: true,
          select: '-deleted_at -is_deleted',
          populate: {
            path: 'user_id',
            model: 'User',
            localField: 'user_id',
            foreignField: 'user_id',
            justOne: true,
            select: 'fullname gender email ',
          }
        },
        {
          path: 'blood_id',
          model: 'Blood',
          localField: 'blood_id',
          foreignField: 'blood_id',
          justOne: true,
          select: 'blood_id',
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
    if (!donateBlood) {
      throw new NotFoundException("Không tìm thấy thông tin hiến máu");
    }
    return donateBlood;
  }

  async getListScheduleTomorrow() {
    const { from, to } = getDateRangeFor(1);
    const tomorrowList = await this.donateBloodModel.find({
      date_donate: { $gte: from, $lt: to },
    });
    return tomorrowList;
  }

  async getListScheduleToday() {
    const { from, to } = getDateRangeFor(0);
    const todayList = await this.donateBloodModel.find({
      date_donate: { $gte: from, $lt: to },
    });
    return todayList;
  }

  async findListDonateActive() {
    const getList = await this.donateBloodModel.find({
      status_donate: Status.PENDING,
    });

    const inforHealthIds = getList.map(d => d.infor_health?.toString());
    const inforHealths = await this.inforHealthsService.findByListId(inforHealthIds);

    const result = [];

    for (const rv of getList) {
      const matchedInfor = inforHealths.find(
        infor => infor.infor_health.toString() === rv.infor_health?.toString()
      );

      if (matchedInfor) {
        result.push({
          user_id: matchedInfor.user_id
        });
      }
    }

    return result;
  }

  async findListDonateComplete() {
    const getList = await this.donateBloodModel.find({
      status_donate: Status.COMPLETED
    })
    const inforHealthIds = getList.map(d => d.infor_health?.toString());
    const inforHealths = await this.inforHealthsService.findByListId(inforHealthIds);

    const result = [];

    for (const rv of getList) {
      const matchedInfor = inforHealths.find(
        infor => infor.infor_health.toString() === rv.infor_health?.toString()
      );

      if (matchedInfor) {
        result.push({
          user_id: matchedInfor.user_id
        });
      }
    }

    return result;
  }
}

