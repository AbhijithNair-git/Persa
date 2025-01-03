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
  subscription: { 
    type: "monthly" | "yearly";  // Ensuring the type is restricted to monthly or yearly
    startDate: Date;
    endDate: Date;
  };
}) {
  try {
    await connectToDatabase();

    // Creating a new user with Clerk data and MongoDB schema
    const newUser = await User.create({
      clerkId: user.clerkId,
      email: user.email,
      username: user.username,
      photo: user.photo,
      firstName: user.firstName || "",  // Provide a fallback for null/undefined
      lastName: user.lastName || "",    // Provide a fallback for null/undefined
      subscription: user.subscription, // Pass the entire subscription object
    });

    return JSON.parse(JSON.stringify(newUser)); // Returning a clean object
  } catch (error) {
    handleError(error); // Handle any errors
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
    subscriptionType?: "monthly" | "yearly"; // Optional field for subscription
    profileUpdates?: Record<string, unknown>; // Optional field for additional profile updates
  }
) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, 
      updates, 
      { new: true } // Return the updated user document
    );

    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser)); // Clean object to remove Mongoose metadata
  } catch (error) {
    handleError(error); // Handle any errors
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

    return checkSubscriptionValidity(user.subscription);
  } catch (error) {
    handleError(error);
  }
}
