import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp, { AqpResult } from "api-query-params";
import { Model } from "mongoose";
import { MESSAGES } from "src/shared/constants/messages.constants";
import { InforHealth } from "./schemas/inforhealth.schema";
import { BloodsService } from "src/bloods/bloods.service";
import { CreateInforHealthDto } from "./dtos/requests/create.request";
import { UpdateInforHealthDto } from "./dtos/requests/update.request";
import { UsersService } from "src/users/users.service";
import { UploadService } from "src/upload/upload.service";
import { IUser } from "src/shared/interfaces/user.interface";

@Injectable()
export class InforHealthService {
    constructor(
        @InjectModel(InforHealth.name) private inforHealthModel: Model<InforHealth>,
        private readonly userServices: UsersService,
        private readonly bloodServices: BloodsService,
        private readonly uploadService: UploadService
    ) { }
    async create(infoHealth: CreateInforHealthDto, file?: Express.Multer.File) {
        const { user_id, blood_id } = infoHealth;
        const user = await this.userServices.findOne(user_id);
        if (!user) {
            throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);
        }
        const blood = await this.bloodServices.findOne(+blood_id);
        if (!blood) {
            throw new BadRequestException("Blood not found");
        }
        const health = await this.inforHealthModel.findOne({ user_id: user_id });
        if(health){
            throw new BadRequestException("Health information already exists for this user");
        }
        let imgUrl = null;
        if (file) {
            const result = await this.uploadService.uploadToCloudinary(user.user_id, file);
            imgUrl = result.secure_url;
            infoHealth.img_health = imgUrl;
        }
        const createdHealth = await this.inforHealthModel.create({
            ...infoHealth,
            user_id: user_id,
            blood_id: blood_id
        });
        return createdHealth;
    }


    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort }: AqpResult = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        const defaultCurrent = currentPage ? currentPage : 1;
        const offset = (+defaultCurrent - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.inforHealthModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.inforHealthModel.find(filter)
            .skip(offset)
            .limit(defaultLimit)
            .sort(sort || {})
            .populate([
                { path: 'user_id' },
                {
                    path: 'blood_id',
                    model: 'Blood',
                    localField: 'blood_id',      
                    foreignField: 'blood_id',  
                    justOne: true,
                },
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

    async findOne(id: string) {
        const health = await this.inforHealthModel
            .findOne({ infor_health: id })
            .populate([
                { path: 'user_id' },
                {
                    path: 'blood_id',
                    model: 'Blood',
                    localField: 'blood_id',      
                    foreignField: 'blood_id',  
                    justOne: true,
                },
            ]);

        if (!health) throw new BadRequestException("Health information not found");

        return health;
    }

    async findById(id: string) {
        const health = await this.inforHealthModel
            .findOne({ infor_health: id })
        if (!health) throw new BadRequestException("Health information not found");

        return health;
    }

    async update(id: string, updateHealthDTO: UpdateInforHealthDto, file?: Express.Multer.File) {
        const health = await this.inforHealthModel.findOne({ infor_health: id });
        if (!health) {
          throw new BadRequestException("Health information not found");
        }
      
        const { user_id, blood_id } = updateHealthDTO;
      
        const user = await this.userServices.findOne(user_id);
        if (!user) {
          throw new BadRequestException(MESSAGES.USERS.USER_NOT_FOUND);
        }
      
        const blood = await this.bloodServices.findOne(+blood_id);
        if (!blood) {
          throw new BadRequestException("Blood not found");
        }
      
        let imgUrl = null;
        if (file) {
            const result = await this.uploadService.uploadToCloudinary(user.user_id, file);
            imgUrl = result.secure_url;
            updateHealthDTO.img_health = imgUrl;
        }
        const updatedHealth = await this.inforHealthModel.findOneAndUpdate(
          { infor_health: id },
          { $set: updateHealthDTO },
          { new: true }
        ).populate([
            { path: 'user_id' },
            {
                path: 'blood_id',
                model: 'Blood',
                localField: 'blood_id',      
                foreignField: 'blood_id',  
                justOne: true,
            },
        ]);
      
        return updatedHealth;
      }
      

    async remove(id: string) {
        const deleted = await this.inforHealthModel.deleteOne({ infor_health: id });
        if (!deleted) throw new BadRequestException("Health information not found");
        return { deleted: deleted.deletedCount || 0 };
    }

    async findByUserId(user_id: string) {
        const health = await this.inforHealthModel.findOne({ user_id: user_id });
        if (!health) throw new BadRequestException("Health information not found");
        const { infor_health } = health;
        return infor_health;
    }

    async findByListId(ids: string[]): Promise<InforHealth[]> {
    return this.inforHealthModel.find({
        infor_health: { $in: ids }
    });
}
}