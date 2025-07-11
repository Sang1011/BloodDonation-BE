import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { ChatbotAgent } from './agent/chatbot.agent';
import { ConfigModule } from '@nestjs/config';
import { ChatbotGateway } from './chatbot.gateway';
import { JwtModule } from '@nestjs/jwt';
import { SearchModule } from 'src/search/search.module';
import { UsersModule } from 'src/users/users.module';
import { InforHealthsModule } from 'src/InforHealths/infor-healths.module';
import { CentralBloodModule } from 'src/central_bloods/central_blood.module';
import { LocationsModule } from 'src/locations/location.module';

@Module({
  imports: [ConfigModule, JwtModule, SearchModule, InforHealthsModule, UsersModule, CentralBloodModule, LocationsModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotAgent, ChatbotGateway],
})
export class ChatbotModule {}
