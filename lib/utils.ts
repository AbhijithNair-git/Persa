import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// import qs from "qs";


// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export const checkSubscriptionValidity = (subscription: { startDate: Date; endDate: Date }) => {
  const now = new Date();
  const { startDate, endDate } = subscription;

  if (!(startDate instanceof Date && endDate instanceof Date)) {
    throw new Error("Invalid subscription dates");
  }

  return now >= startDate && now <= endDate;
};

