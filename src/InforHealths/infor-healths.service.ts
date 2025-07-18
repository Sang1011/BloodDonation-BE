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
import { BaseModel } from "src/shared/interfaces/soft-delete-model.interface";

@Injectable()
export class InforHealthService {
    constructor(
        @InjectModel(InforHealth.name) private inforHealthModel: BaseModel<InforHealth>,
        private readonly userServices: UsersService,
        private readonly bloodServices: BloodsService,
        private readonly uploadService: UploadService
    ) { }

    async create(infoHealth: CreateInforHealthDto, file?: Express.Multer.File) {
        const { user_id, blood_id } = infoHealth;
        const user = await this.userServices.findOne(user_id);
        if (!user) {
            throw new BadRequestException("Không tìm thấy người dùng");
        }
        const blood = await this.bloodServices.findOne(blood_id);
        if (!blood) {
            throw new BadRequestException("Không tìm thấy nhóm máu");
        }
        const health = await this.inforHealthModel.findOne({ user_id: user_id });

        if (health) {
            throw new BadRequestException("Người dùng này đã có thông tin sức khỏe");
        }
        const latest_donate = infoHealth.latest_donate;

        if (new Date(latest_donate) > new Date()) {
            throw new BadRequestException("Không được chọn ngày trong tương lai");
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
        return createdHealth.save();
    }

    async createByUser(user: IUser, infoHealth: CreateInforHealthDto, file?: Express.Multer.File) {

        const health = await this.inforHealthModel.findOne({ user_id: user.user_id });
        if (health) {
            throw new BadRequestException("Người dùng này đã có thông tin sức khỏe");
        }

        const blood = await this.bloodServices.findOne(infoHealth.blood_id);
        if (!blood) {
            throw new BadRequestException("Không tìm thấy nhóm máu");
        }


        const latest_donate = infoHealth.latest_donate;

        if (new Date(latest_donate) > new Date()) {
            throw new BadRequestException("Không được chọn ngày trong tương lai");
        }

        let imgUrl = null;
        if (file) {
            const result = await this.uploadService.uploadToCloudinary(user.user_id, file);
            imgUrl = result.secure_url;
            infoHealth.img_health = imgUrl;
        }

        const createdHealth = await this.inforHealthModel.create({
            ...infoHealth,
            user_id: user.user_id,
            blood_id: infoHealth.blood_id
        });
        return createdHealth.save();
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
                {
                    path: 'user_id',
                    model: 'User',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    justOne: true
                },
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
                {
                    path: 'user_id',
                    model: 'User',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    justOne: true
                },
                {
                    path: 'blood_id',
                    model: 'Blood',
                    localField: 'blood_id',
                    foreignField: 'blood_id',
                    justOne: true,
                },
            ]);

        if (!health) throw new BadRequestException("Không tìm thấy thông tin sức khỏe");

        return health;
    }

    async findById(id: string) {
        const health = await this.inforHealthModel
            .findOne({ infor_health: id })
        if (!health) throw new BadRequestException("Không tìm thấy thông tin sức khỏe");

        return health;
    }

    async findOneByUserId(id: string) {
        const health = await this.inforHealthModel
            .findOne({ user_id: id })
        if (!health) throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
        return health;
    }

    async update(id: string, updateHealthDTO: UpdateInforHealthDto, file?: Express.Multer.File) {
        const health = await this.inforHealthModel.findOne({ infor_health: id });
        if (!health) {
            throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
        }

        const { user_id, blood_id } = updateHealthDTO;

        const user = await this.userServices.findOne(user_id);
        if (!user) {
            throw new BadRequestException("Không tìm thấy người dùng");
        }

        const blood = await this.bloodServices.findOne(blood_id);
        if (!blood) {
            throw new BadRequestException("Không tìm thấy nhóm máu");
        }

        const latest_donate = updateHealthDTO.latest_donate;
        if (new Date(latest_donate) > new Date()) {
            throw new BadRequestException("Không được chọn ngày trong tương lai");
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

    async updateByUser(user: IUser, updateHealthDTO: UpdateInforHealthDto, file?: Express.Multer.File) {
        if (!updateHealthDTO.user_id || updateHealthDTO.user_id === null || updateHealthDTO.user_id === '') {
            updateHealthDTO = { ...updateHealthDTO, user_id: user.user_id };
        }
        const health = await this.findByUserId(user.user_id);
        console.log(health);
        if (!health) {
            throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
        }

        const { blood_id } = updateHealthDTO;
        const blood = await this.bloodServices.findOne(blood_id);
        if (!blood) {
            throw new BadRequestException("Không tìm thấy nhóm máu");
        }

        const latest_donate = updateHealthDTO.latest_donate;
        if (new Date(latest_donate) > new Date()) {
            throw new BadRequestException("Không được chọn ngày trong tương lai");
        }
        let imgUrl = null;
        if (file) {
            const result = await this.uploadService.uploadToCloudinary(user.user_id, file);
            imgUrl = result.secure_url;
            updateHealthDTO.img_health = imgUrl;
        }

        const updatedHealth = await this.inforHealthModel.findOneAndUpdate(
            { infor_health: health.infor_health },
            { $set: updateHealthDTO },
            { new: true }
        ).populate([
            {
                path: 'user_id',
                model: 'User',
                localField: 'user_id',
                foreignField: 'user_id',
                justOne: true
            },
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
    const find = await this.inforHealthModel.findOne({ infor_health: id });
    if (!find) {
        throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
    }

    const deleted = await this.inforHealthModel.updateOne(
        { infor_health: id },
        { $set: { is_deleted: true } }
    );

    if (deleted.modifiedCount === 0) {
        throw new BadRequestException("Không thể xóa thông tin sức khỏe");
    }

    return { deleted: true };
}

    async findByUserId(user_id: string) {
        const health = await this.inforHealthModel.findOne({ user_id: user_id });
        if (!health) throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
        const { infor_health, blood_id, latest_donate } = health;
        return { infor_health, blood_id, latest_donate, is_regist_donate: health.is_regist_donate, is_regist_receive: health.is_regist_receive };
    }

    async findInfoHealthByUserId(user_id: string) {
        const health = (await this.inforHealthModel.findOne({ user_id: user_id }))
            .populate([
                {
                    path: 'user_id',
                    model: 'User',
                    localField: 'user_id',
                    foreignField: 'user_id',
                    justOne: true,
                    select: 'fullname gender email ',
                },
                {
                    path: 'blood_id',
                    model: 'Blood',
                    localField: 'blood_id',
                    foreignField: 'blood_id',
                    justOne: true,
                    select: 'blood_id',
                },
            ]);
        if (!health) throw new BadRequestException("Không tìm thấy thông tin sức khỏe");
        return health;
    }

    async findByListId(ids: string[]): Promise<InforHealth[]> {
        return this.inforHealthModel.find({
            infor_health: { $in: ids }
        });
    }

    async updateForDonate(user_id: string, is_regist_donate: boolean) {
        const health = await this.inforHealthModel.findOne({ user_id: user_id });
        if (!health) {
            throw new BadRequestException("Không tìm thấy người dùng");
        }
        health.is_regist_donate = is_regist_donate;
        return health.save();
    }

    async updateForReceive(user_id: string, is_regist_receive: boolean) {
        const health = await this.inforHealthModel.findOne({ user_id: user_id });
        if (!health) {
            throw new BadRequestException("Không tìm thấy người dùng");
        }
        health.is_regist_receive = is_regist_receive;
        return health.save();
    }
    async findByEmail(email: string) {
        const user = await this.userServices.findOneByEmail(email);
        if (!user) {
            throw new BadRequestException("Không tìm thấy người dùng");
        }
        return this.findInfoHealthByUserId(user.user_id);
    }
}