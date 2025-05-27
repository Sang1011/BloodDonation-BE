import mongoose from "mongoose";

export const isValidId = (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    return true;
  }