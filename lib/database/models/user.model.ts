
//clerkid, email, username, photo, firstname, lastname,plainid, creditbalance

import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  subscription: {
    type: "monthly" | "yearly";
    startDate: Date;
    endDate: Date;
  };
}

const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  subscription: {
    type: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
}, { timestamps: true });

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
