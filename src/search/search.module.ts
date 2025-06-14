import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from 'src/users/users.module';
import { DonateBloodModule } from 'src/donate_bloods/donate_bloods.module';
import { ReceiverBloodModule } from 'src/receiver_bloods/receiver.module';
import { LocationsModule } from 'src/locations/location.module';

@Module({
  imports: [
    UsersModule,
    DonateBloodModule,
    ReceiverBloodModule,
    LocationsModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
