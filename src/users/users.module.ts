import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { LocationsModule } from "src/locations/location.module";
import { RolesModule } from "src/roles/role.module";

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), LocationsModule, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
