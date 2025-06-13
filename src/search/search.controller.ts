import { Injectable } from "@nestjs/common";
import { LocationService } from "src/locations/location.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SearchService {
  constructor(
    private readonly locationService: LocationService,
    private readonly userService: UsersService,
    // private readonly 
  ) { }

  async findAllDonors(){

  }

  async findAllRecipients(){
    
  }

  async findUserByDistance(){

  }

}