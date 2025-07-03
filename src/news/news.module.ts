import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { News, NewsSchema } from "./schemas/news.schema";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.services";

@Module({
  imports: [MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }])],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService]
})
export class NewsModule {}
