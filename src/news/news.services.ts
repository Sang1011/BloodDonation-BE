import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import aqp, { AqpResult } from "api-query-params";
import { Model } from "mongoose";
import { News } from "./schemas/news.schema";
import { CreateNewsDto } from "./dtos/requests/create.request";
import { UpdateNewsDto } from "./dtos/requests/update.request";

@Injectable()
export class NewsService {
    constructor(
        @InjectModel(News.name) private newsModel: Model<News>,
    ) { }
    async create(news: CreateNewsDto) {
        const findNews = await this.newsModel.findOne({ title: news.title });
        if (findNews) {
            throw new BadRequestException("Tin tức này đã tồn tại");
        }
        const countDocument = await this.newsModel.countDocuments();

        const newNews = await new this.newsModel({ ...news, news_id: countDocument + 1 });
        return await this.newsModel.create(newNews);
    }


    async findAll(currentPage: number, limit: number, qs: string) {
        const { filter, sort }: AqpResult = aqp(qs);
        delete filter.current;
        delete filter.pageSize;
        const defaultCurrent = currentPage ? currentPage : 1;
        const offset = (+defaultCurrent - 1) * +limit;
        const defaultLimit = +limit ? +limit : 10;
        const totalItems = (await this.newsModel.find(filter)).length;
        const totalPages = Math.ceil(totalItems / defaultLimit);
        const result = await this.newsModel.find(filter)
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
        const findNews = await this.newsModel.findOne({ news_id: id });
        if (!findNews) {
            throw new BadRequestException("Không tìm thấy bản tin");
            throw new BadRequestException("Tin tức không tồn tại");
        }
        return findNews;
    }

    async update(id: string, updateNewsDTO: UpdateNewsDto) {
        const updated = await this.newsModel.findOneAndUpdate(
            { news_id: id },
            updateNewsDTO,
            { new: true },
        );

        if (!updated) {
            throw new BadRequestException("Không tìm thấy bản tin");
            throw new BadRequestException("Tin tức không tồn tại");
        }

        return updated;
    }


    async remove(id: string) {
        const deleted = await this.newsModel.deleteOne({ news_id: id });
        if (!deleted) throw new BadRequestException("Không tìm thấy bản tin");
        if (!deleted) throw new BadRequestException("Tin tức không tồn tại");
        return { deleted: deleted.deletedCount || 0 };
    }
}