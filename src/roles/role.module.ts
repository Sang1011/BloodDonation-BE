import { Module } from "@nestjs/common";
import { Role, RoleSchema } from "./schemas/role.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { RoleController } from "./role.controller";
import { RoleService } from "./role.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService]
})
export class RolesModule {}
