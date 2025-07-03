import mongoose from "mongoose";

export interface IUser {
  user_id: string;
  email: string;
  fullname: string;
  role: string;
  // device: {
  //   deviceId: string, 
  //   platform: string, 
  // }
}