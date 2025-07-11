import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from 'src/users/users.module';
import { DonateBloodModule } from 'src/donate_bloods/donate_bloods.module';
import { ReceiverBloodModule } from 'src/receiver_bloods/receiver.module';
import { LocationsModule } from 'src/locations/location.module';
import { CentralBloodModule } from 'src/central_bloods/central_blood.module';

@Module({
  imports: [
    UsersModule,
    DonateBloodModule,
    ReceiverBloodModule,
    LocationsModule,
    CentralBloodModule
  ],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
