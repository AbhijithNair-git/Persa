
//clerkid, email, username, photo, firstname, lastname,plainid, creditbalance

import { Document, Schema, model, models } from "mongoose";

// TypeScript Interface for IUser
export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  subscription: {
    type: "monthly" | "yearly"; // Enum for subscription type
    startDate: Date;
    endDate: Date;
  };
}

// User Schema
const UserSchema = new Schema<IUser>({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  photo: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  subscription: {
    type: { 
      type: String,
      enum: ["monthly", "yearly"], // Explicitly limit this to "monthly" or "yearly"
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
}, { timestamps: true });

// Model for User
const User = models?.User || model<IUser>("User", UserSchema);
export default User;