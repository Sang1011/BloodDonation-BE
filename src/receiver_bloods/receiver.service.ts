import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

@Injectable()
export class ReceiverBloodService {
  constructor(
    @InjectModel(ReceiverBlood.name)
    private receiverBloodModel: Model<ReceiverBlood>,
    private inforHealthsService: InforHealthService,
    private bloodsService: BloodsService,
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
    if (!receiverBlood) {
      throw new NotFoundException("Receiver Blood record not found");
    }
    return receiverBlood;
  }

  // async create(dto: CreateReceiveBloodDto) {
  //   const existingReceiverBlood = await this.receiverBloodModel.findOne({ infor_health: dto.infor_health });
  //   if (existingReceiverBlood) {
  //     throw new BadRequestException("Receiver Blood record already exists for this InforHealth");
  //   }
  //   const checked = await this.checkDuplicate(dto);
  //   if (!checked) {
  //     throw new BadRequestException("Invalid data provided");
  //   }
  //   const created = new this.receiverBloodModel(dto);
  //   return await created.save();
  // }

  async create(user_id: string, dto: CreateReceiveBloodDto) {
    const user = await this.usersService.findOne(user_id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    const checked = await this.checkDuplicate(dto);
    if (!checked) {
      throw new BadRequestException("Invalid data provided");
    }
    if (new Date(dto.date_receiver) < new Date()) {
      throw new BadRequestException("Date must be in the future");
    }
    const created = await new this.receiverBloodModel({...dto, user_id: user.user_id}).populate([
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
    return await created.save();
  }

  async checkDuplicate(dto: CreateReceiveBloodDto) {
    
    const blood = await this.bloodsService.findOne(+dto.blood_id);
    if (!blood) {
      throw new NotFoundException("Blood not found");
    }
    const centralBlood = await this.centralBloodService.findOne(dto.centralBlood_id);
    if (!centralBlood) {
      throw new NotFoundException("Central Blood not found");
    }
    return true;
  }

  async update(id: string, dto: UpdateReceiveBloodDto) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
    if (!existingReceiverBlood) {
      throw new BadRequestException("Receiver Blood record not found");
    }
    if (dto.blood_id) {
      const blood = await this.bloodsService.findOne(+dto.blood_id);
      if (!blood) {
        throw new NotFoundException("Blood not found");
      }
    }
    if (new Date(dto.date_receiver) < new Date()) {
      throw new BadRequestException("Date must be in the future");
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
    return updated.save();
  }

  async remove(id: string) {
    const existingReceiverBlood = await this.receiverBloodModel.findOne({ receiver_id: id });
    if (!existingReceiverBlood) {
      throw new NotFoundException("Receiver Blood record not found");
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

   return null;
}

  // async findListReceiveComplete() {
  //   const getList = await this.receiverBloodModel.find({
  //     status_receiver: Status.COMPLETED
  //   })
  //   const inforHealthIds = getList.map(d => d.infor_health?.toString());
  // const inforHealths = await this.inforHealthsService.findByListId(inforHealthIds);

  // const result = [];

  // // for (const rv of getList) {
  // //   const matchedInfor = inforHealths.find(
  // //     infor => infor.infor_health.toString() === rv.infor_health?.toString()
  // //   );

  //   if (matchedInfor) {
  //     result.push({
  //       user_id: matchedInfor.user_id,
  //       requestType: rv.type || 'DEFAULT',
  //     });
  //   }
  // }

  //  return null;
  // }

  async findListReceiveComplete() {
      const getList = await this.receiverBloodModel.find({
        status_receiver: Status.COMPLETED
      })
      const userIds = getList.map(d => d.user_id?.toString());
    const users = await this.usersService.findByListId(userIds);
  
    const result = [];
  
    // for (const rv of getList) {
    //   const matchedInfor = inforHealths.find(
    //     infor => infor.infor_health.toString() === rv.infor_health?.toString()
    //   );
  
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

