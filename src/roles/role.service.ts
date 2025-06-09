import { BadRequestException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role} from './schemas/role.schema';
import { CreateRoleDto } from './dtos/requests/create.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';
import aqp, { AqpResult } from "api-query-params";

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private roleModel: Model<Role>) {}

  async create(dto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleModel.findOne({ role_name: dto.role_name });
    if (existingRole) {
      throw new BadRequestException(MESSAGES.ROLE.ROLE_EXIST);
    }
    const role = new this.roleModel(dto);
    const saved = await role.save();
    return {
      role_name: saved.role_name,
      role_id: saved.role_id
    } 
  }

  async findByName(role_name: string) {
    const roleFound = await this.roleModel.findOne({ role_name: role_name }).exec();
    if (!roleFound) throw new NotFoundException(`Role with name ${role_name} not found`);
    return roleFound;
  }

   async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort }: AqpResult = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    const defaultCurrent = currentPage ? currentPage : 1;
    const offset = (+defaultCurrent - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.roleModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.roleModel.find(filter)
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
  async findById(role_id: string): Promise<Role> {
    const role = await this.roleModel.findOne({ role_id }).exec();
    if (!role) throw new NotFoundException(`Role with id ${role_id} not found`);
    return role;
  }
}
