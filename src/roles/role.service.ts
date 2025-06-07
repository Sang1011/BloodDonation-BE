import { BadRequestException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role} from './schemas/role.schema';
import { CreateRoleDto } from './dtos/requests/create.dto';
import { MESSAGES } from 'src/shared/constants/messages.constants';

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

  async findAll(): Promise<Role[]> {
    return this.roleModel.find().exec();
  }

  async findById(role_id: string): Promise<Role> {
    const role = await this.roleModel.findOne({ role_id }).exec();
    if (!role) throw new NotFoundException(`Role with id ${role_id} not found`);
    return role;
  }
}
