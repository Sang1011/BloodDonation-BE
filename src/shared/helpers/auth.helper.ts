import { compareSync } from "bcryptjs";

export function isValidPassword(password: string, hash: string){
    return compareSync(password, hash);
  }