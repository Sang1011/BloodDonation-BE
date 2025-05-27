import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/requests/create-user.dto";
import { UpdateUserDto } from "./dto/requests/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./schemas/user.schema";
import mongoose, { Model } from "mongoose";
import { Role } from "src/shared/enums/user.enum";
import { BaseModel } from "src/shared/base/base.model";
import { MESSAGES } from "src/shared/constants/messages.constants";
import { getHashPassword } from "src/shared/utils/getHashPassword";
import { isValidPassword as comparePassword } from 'src/shared/helpers/auth.helper';
import aqp, { AqpResult } from "api-query-params";
import { isValidId } from "src/shared/utils/isValidId";
import { BloodGroup } from "src/bloodGroups/schemas/blood-group.schema";

@Injectable()
export class UsersService {
  constructor(
  @InjectModel(User.name) private userModel: BaseModel<User>,
  @InjectModel(BloodGroup.name) private bloodGroupModel: Model<BloodGroup>
) {}


  async create(userDTO: CreateUserDto) {
    const existedUser = await this.findOneByEmail(userDTO?.email);
    if (existedUser) {
      throw new BadRequestException(MESSAGES.USERS.EMAIL_EXIST);
    }

    const { bloodType, rhFactor, ...otherData } = userDTO;
    const bloodGroup = await this.bloodGroupModel.findOne({ bloodType, rhFactor });
    if (!bloodGroup) {
      throw new BadRequestException('Invalid blood group or rh factor');
    }

    const hashPassword = getHashPassword(userDTO?.password);
    const user = await this.userModel.create({
      ...otherData,
      bloodId: bloodGroup._id,
      role: Role.MEMBER,
      password: hashPassword,
    });

    return {
      _id: user._id,
      createdAt: user.createdAt,
    };
  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort || {})
      .select("-password")
      .populate(population)
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
    if (!isValidId(id)) return MESSAGES.USERS.USER_NOT_FOUND;

    const user = await this.userModel
      .findOne({ _id: id })
      .select('-password')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });

    if (!user) return MESSAGES.USERS.USER_NOT_FOUND;

    return user;
  }


  async findOneByEmail(email: string) {
    return await this.userModel.findOne({
      email: email
    }).populate({ path: "role", select: { name: 1, permissions: 1 } });
  }

  async update(updateUserDto: UpdateUserDto) {
    if (!isValidId(updateUserDto._id)) return MESSAGES.USERS.USER_NOT_FOUND;

    const { _id, ...updateData } = updateUserDto;

    const result = await this.userModel.updateOne(
      { _id },
      { $set: updateData }
    );

    if (result.matchedCount === 0) return MESSAGES.USERS.USER_NOT_FOUND;

    return {
      updatedFields: Object.keys(updateData)
    };
  }


  async isValidPassword(password: string, hashPassword: string) {
    return await comparePassword(password, hashPassword);
  }

  async findAllWithoutDeleted() {
    return this.userModel.findAllWithoutDeleted();
  }

  async findAllDeleted() {
    return this.userModel.findAllDeleted();
  }

  async remove(id: string) {
    if (!isValidId(id)) return MESSAGES.USERS.USER_NOT_FOUND;
    const isDeleted = await this.userModel.findOne({ _id: id, deletedAt: { $ne: null } });
    if (isDeleted) return { deleted: 0 };

    const foundUser = await this.userModel.findById(id);
    if (!foundUser) return MESSAGES.USERS.USER_NOT_FOUND;

    if (foundUser.email === process.env.ADMIN_EMAIL) {
      throw new BadRequestException(MESSAGES.USERS.CANNOT_DELETE_ADMIN);
    }

    // Soft delete
    const removed = await this.userModel.delete({ _id: id });
    return { deleted: removed.modifiedCount || 0 };
  }

  async restore(id: string) {
    if (!isValidId(id)) return MESSAGES.USERS.USER_NOT_FOUND;

    // Kiểm tra user có tồn tại và đang bị xóa (soft-delete) hay không
    const user = await this.userModel.findOne({ _id: id, deletedAt: { $exists: true } });
    if (!user) {
      return MESSAGES.USERS.USER_NOT_DELETED;
    }

    const restored = await this.userModel.restore({ _id: id });
    return restored;
  }
}
