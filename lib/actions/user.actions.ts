"use server";

import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError, checkSubscriptionValidity } from "../utils";

// CREATE
export async function createUser(user: {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName: string;
  lastName: string;
  subscriptionStatus: "free" | "pro" | "advanced";
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
}) {
  try {
    await connectToDatabase();

    const newUser = await User.create({
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      photo: user.photo,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      subscriptionStatus: user.subscriptionStatus || "free",
      subscriptionStartDate: user.subscriptionStartDate,
      subscriptionEndDate: user.subscriptionEndDate,
    });

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(
  clerkId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    username?: string;
    photo?: string;
    subscriptionStatus?: "free" | "pro" | "advanced";
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    profileUpdates?: Record<string, unknown>;
  }
) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      updates,
      { new: true }
    );

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    const deletedUser = await User.findOneAndDelete({ clerkId });
    revalidatePath("/");

    if (!deletedUser) throw new Error("User not found");

    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    handleError(error);
  }
}

// VALIDATE SUBSCRIPTION
export async function validateSubscription(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");

    return checkSubscriptionValidity(user);
  } catch (error) {
    handleError(error);
  }
}
