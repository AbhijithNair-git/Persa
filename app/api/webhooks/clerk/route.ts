/* eslint-disable camelcase */
// import { clerkClient } from "@clerk/nextjs";
import { clerkClient } from '@clerk/clerk-sdk-node'; //this is added instead for the above commented one clerkClient
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = await headers();  //await is added
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  const { id } = evt.data;
  const eventType = evt.type;

  // CREATE
  if (eventType === "user.created") {
    const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;
    
    // Ensure firstName and lastName are strings (fallback to empty string if null)
    const user = {
        clerkId: id,
        email: email_addresses[0].email_address,
        username: username!,
        photo: image_url,
        firstName: first_name || "",  // Fallback to empty string
        lastName: last_name || "",    // Fallback to empty string
        subscription: {
          type: "monthly" as "monthly" | "yearly",  // Ensure type is either "monthly" or "yearly"
          startDate: new Date(),
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      };
    // Create the user in the database
    const newUser = await createUser(user);
  
    // Set public metadata
    if (newUser) {
      await clerkClient.users.updateUserMetadata(id, {
        publicMetadata: {
          userId: newUser._id,
        },
      });
    }
  
    return NextResponse.json({ message: "OK", user: newUser });
  }


  // UPDATE
  if (eventType === "user.updated") {
    const { id, image_url, first_name, last_name, username } = evt.data;
  
    // Ensure that firstName and lastName are either string or undefined (not null)
    const user = {
      firstName: first_name ?? undefined, // Convert null to undefined
      lastName: last_name ?? undefined,   // Convert null to undefined
      username: username!,
      photo: image_url,
      // Optional fields like subscriptionType or profileUpdates can be added if needed
    };
  
    // Call the updateUser function to update the user in the database
    const updatedUser = await updateUser(id, user);
  
    // Return a response with a success message and the updated user data
    return NextResponse.json({ message: "OK", user: updatedUser });
  }
  

  
  // DELETE
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    const deletedUser = await deleteUser(id!);

    return NextResponse.json({ message: "OK", user: deletedUser });
  }

  console.log(`Webhook with and ID of ${id} and type of ${eventType}`);
  console.log("Webhook body:", body);

  return new Response("", { status: 200 });
}