import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: "free" | "pro" | "advanced";
  subscriptionStartDate?: Date; // Optional - Stores when the subscription starts
  subscriptionEndDate?: Date; // Optional - Stores when the subscription ends
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    subscriptionStatus: {
      type: String,
      enum: ["free", "pro", "advanced"],
      default: "free",
      required: true,
    },
    subscriptionStartDate: { type: Date }, // Nullable (only applies to paid users)
    subscriptionEndDate: { type: Date }, // Nullable (only applies to paid users)
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
