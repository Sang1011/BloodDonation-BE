import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp, { AqpResult } from "api-query-params";
import { Model } from "mongoose";
import { MESSAGES } from "src/shared/constants/messages.constants";
import { isValidPassword as comparePassword } from 'src/shared/helpers/auth.helper';
import { getHashPassword } from "src/shared/utils/getHashPassword";
import { CreateUserDto, RegisterUserDTO } from "./dto/requests/create-user.dto";
import { UpdateUserDto } from "./dto/requests/update-user.dto";
import { User } from "./schemas/user.schema";
import { UserRole } from "src/shared/enums/user.enum";
import { LocationService } from "src/locations/location.service";
import { RoleService } from "src/roles/role.service";
import { BaseModel } from "src/shared/interfaces/soft-delete-model.interface";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: BaseModel<User>,
    private readonly locationService: LocationService,
    private readonly roleService: RoleService
  ) { }

  isCreateUserDto(obj: any): obj is CreateUserDto {
    return 'role_name' in obj && typeof obj.role_name === 'string';
  }

  isRegisterDTO(obj: any): obj is RegisterUserDTO {
    return !('role_name' in obj);
  }


  async create(userDTO: CreateUserDto | RegisterUserDTO) {
    const existedUser = await this.findOneByEmail(userDTO.email);
    if (existedUser) {
      throw new BadRequestException(MESSAGES.USERS.EMAIL_EXIST);
    }

    let roleId = "";
    if (this.isRegisterDTO(userDTO)) {
      const role = UserRole.MEMBER;
      const findRoleId = await this.roleService.findByName(role);
      roleId = findRoleId.role_id;
    } else if (this.isCreateUserDto(userDTO)) {
      const findRoleId = await this.roleService.findByName(userDTO.role_name);
      roleId = findRoleId.role_id;
    }

    const createLoc = await this.locationService.create(userDTO.location);
    const locationId = createLoc.location_id;
    const hashPassword = getHashPassword(userDTO?.password);
    const user = await this.userModel.create({
      ...userDTO,
      location_id: locationId,
      role_id: roleId,
      password: hashPassword,
    });

    return {
      user_id: user.user_id
    };
  }


  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
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
      .select("-password -is_verified -verify_token")
      .populate([
        { path: 'location_id' },
        { path: 'role_id' }
      ])
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

  async findOneWithPass(id: string) {
    const user = await this.userModel
      .findOne({ user_id: id })
      .populate([
        { path: 'location_id' },
        { path: 'role_id' }
      ]);
    if (!user) throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);

    return user;
  }

  async findAllNoFilter(){
    const user = await this.userModel.find()
      .select('-password')
    return user;
  }

  async findOneNoPopulate(id: string){
    const user = await this.userModel.findOne({ user_id: id })
      .select('-password')

      if (!user) throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);

    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel
      .findOne({ user_id: id })
      .select('-password')
      .populate([
        { path: 'location_id' },
        { path: 'role_id' }
      ]);

    if (!user) throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);

    return user;
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email });
  }

  async findOneByVerifyToken(token: string) {
    return await this.userModel.findOne({
      verify_token: token
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const get = await this.findOneByEmail(updateUserDto.email);
    if (!get) {
      throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);
    }
    if (updateUserDto.location) {
      await this.locationService.update(get.location_id, updateUserDto.location);
    }

    if (updateUserDto.role_name) {
      const findRoleId = await this.roleService.findByName(updateUserDto.role_name);
      await this.userModel.updateOne({ user_id: id }, { $set: { role_id: findRoleId.role_id } });
    }

    await this.userModel.updateOne({ user_id: id }, updateUserDto);

    const updatedUser = await this.userModel.findOneAndUpdate(
      { user_id: id },
      { $set: updateUserDto },
      { new: true }
    ).select('-password');

    return updatedUser;
  }

  async isValidPassword(password: string, hashPassword: string) {
    return await comparePassword(password, hashPassword);
  }
  
  async remove(id: string) {
    const foundUser = await this.userModel.findById(id);
    if (!foundUser) return MESSAGES.USERS.USER_NOT_FOUND;

    if (foundUser.email === process.env.ADMIN_EMAIL) {
      throw new BadRequestException(MESSAGES.USERS.CANNOT_DELETE_ADMIN);
    }

    const removed = await this.userModel.softDelete(id);
    await this.locationService.softRemove(foundUser.location_id);
    return { deleted: removed.modifiedCount};
  }

  async updateUserToken(refreshToken: string, user_id: string) {
    return await this.userModel.updateOne(
      { user_id: user_id },
      { $set: { refresh_token: refreshToken } }
    );
  }

  async findUserByToken(refreshToken: string) {
    return await this.userModel.findOne({ refresh_token: refreshToken })
  }

  async updateVerifyToken(user_id: string) {
    return await this.userModel.updateOne(
      { user_id: user_id },
      { $set: { verify_token: null, is_verified: true } }
    );
  }

  async getUserByLocationID(location_id: string){
    return await this.userModel.findOne({location_id: location_id});
  }

  async findByListId(userIds: string[]){
    return await this.userModel.find({user_id: {$in: userIds}});
  }
  async findOneByEmailWithDigitCode(email: string) {
    return this.userModel.findOne({ email: email })
    .select('+digit_code +digit_code_expire');;
  }

  async updateDigitCode(id: string, objectDigit : {digitCodeHashed: string, expired : Date}){
    return await this.userModel.updateOne({
      user_id: id
    }, {
      $set: { digit_code: objectDigit.digitCodeHashed, digit_code_expire: objectDigit.expired }
    })
  }

  async resetDigitCode(id: string){
    return await this.userModel.updateOne({
      user_id: id
    }, {
      $unset: {
        digit_code: "",
        digit_code_expire: ""
      }
    })
  }
}
