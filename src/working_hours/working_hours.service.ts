import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WorkingHours } from "./schemas/working_hours.schema";
import aqp, { AqpResult } from "api-query-params";
import { CreateWorkingHoursDto } from "./dto/request/create_working_hours.dto";
import { UpdateWorkingHoursDto } from "./dto/request/update_working_hours.dto";
import { CentralBlood } from "src/central_bloods/schemas/central_blood.schema";
import { CentralBloodService } from "src/central_bloods/central_blood.service";
import { BaseModel } from "src/shared/interfaces/soft-delete-model.interface";

@Injectable()
export class WorkingHoursService {
  constructor(
    @InjectModel(WorkingHours.name)
    private readonly workingHoursModel: BaseModel<WorkingHours>,
    @InjectModel(CentralBlood.name)
    private readonly centralBloodModel: Model<CentralBlood>,
    @Inject(forwardRef(() => CentralBloodService)) private centralBloodService: CentralBloodService,

  ) {}

  async create(createDto: CreateWorkingHoursDto): Promise<WorkingHours> {
      const created = new this.workingHoursModel(createDto);
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
    const totalItems = (await this.workingHoursModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.workingHoursModel.find(filter)
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
    const workingHours = await this.workingHoursModel.findOne({working_id: id})
    if (!workingHours) throw new NotFoundException("Giờ làm việc không tồn tại");
    return workingHours;
  }

  async update(id: string, updateDto: UpdateWorkingHoursDto): Promise<WorkingHours> {
    const updated = await this.workingHoursModel.findOneAndUpdate(
      { working_id: id },
      updateDto,
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException('Giờ làm việc không tồn tại');
    }

    return updated;
  }

  async remove(id: string) {
  const relatedCount = await this.centralBloodModel.countDocuments({ working_id: id });
  if (relatedCount > 0) {
    throw new ConflictException('Không thể xóa giờ làm việc vì nó đang được tham chiếu trong các bản ghi trung tâm máu.');
  }

  const deleted = await this.workingHoursModel.deleteOne({ working_id: id });
  if (deleted.deletedCount === 0) {
    throw new NotFoundException("Giờ làm việc không tồn tại");
  }

  return { deleted: deleted.deletedCount };
}

async softRemove(id: string) {
  const deleted = await this.workingHoursModel.softDelete(id);
  await this.workingHoursModel.findOneAndUpdate({ working_id: id }, { is_open: false });
  if (!deleted) {
    throw new NotFoundException("Giờ làm việc không tồn tại");
  }
  return { deleted: deleted };
}

async restore(id: string) {
  const restored = await this.workingHoursModel.restore(id);
  await this.workingHoursModel.findOneAndUpdate({ working_id: id }, { is_open: true });
  if (!restored) {
    throw new NotFoundException("Giờ làm việc không tồn tại");
  }
  return { restored: restored };
}

async findCentralByWorkingDay(date: Date) {
  if (date < new Date() ) {
    throw new BadRequestException("Ngày phải ở tương lai");
  }
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dateOfWeek = date.getUTCDay() - 1;  // 0 is Sunday, 1 is Monday, etc.
  const dayOfWeek = days[dateOfWeek];

  const workingHours = await this.workingHoursModel
    .findOne({ day_of_week: dayOfWeek })
    .populate({
      path: 'centralBlood_id',
      model: 'CentralBlood',
      localField: 'centralBlood_id',
      foreignField: 'centralBlood_id',
    });

  if (!workingHours || !workingHours.centralBlood_id) {
    throw new NotFoundException("Không tìm thấy giờ làm việc cho " + dayOfWeek);
  }

  return {
    day_of_week: workingHours.day_of_week,
    open_time: workingHours.open_time,
    close_time: workingHours.close_time,
    centralBlood: workingHours.centralBlood_id,
  };
}


}