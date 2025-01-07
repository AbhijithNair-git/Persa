"use server";

import { connectToDatabase } from "../database/mongoose";
import Task from "../database/models/task.model"; // Assuming Task model is defined
import { handleError } from "../utils";
import Todo from "../database/models/task.model"; // Ensure proper import

export async function createTask(task: {
  userId: string;
  title: string;
  completed: boolean;
  dueDate: string; // Always required and in ISO format
  reminder?: {
    date: string; // Required to be ISO string if present
    note: string;
    frequency: "daily" | "weekly" | "hourly";
  };
  subtasks?: { title: string; completed: boolean }[];
}) {
  try {
    await connectToDatabase();

    // Validate required fields
    if (!task.userId || !task.title || !task.dueDate) {
      throw new Error("Missing required fields: userId, title, or dueDate.");
    }

    // Validate date fields
    const dueDate = new Date(task.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new Error("Invalid dueDate. Must be a valid ISO string.");
    }

    if (task.reminder) {
      const reminderDate = new Date(task.reminder.date);
      if (isNaN(reminderDate.getTime())) {
        throw new Error("Invalid reminder.date. Must be a valid ISO string.");
      }
    }

    // Validate subtasks
    if (task.subtasks) {
      task.subtasks.forEach((subtask, index) => {
        if (!subtask.title) {
          throw new Error(`Subtask at index ${index} is missing a title.`);
        }
      });
    }

    const todo = await Todo.findOneAndUpdate(
      { userId: task.userId },
      { $setOnInsert: { userId: task.userId, tasks: [] } },
      { new: true, upsert: true }
    );

    if (!todo) {
      throw new Error("Failed to retrieve or create Todo document.");
    }

    const newTask = {
      title: task.title,
      completed: task.completed,
      dueDate,
      reminder: task.reminder
        ? {
            ...task.reminder,
            date: new Date(task.reminder.date),
          }
        : undefined,
      subtasks: task.subtasks || [],
    };

    todo.tasks.push(newTask);

    await todo.save();

    return newTask;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error in createTask:", error.message);
      throw new Error(`Failed to create task: ${error.message}`);
    } else {
      console.error("Unknown error occurred:", error);
      throw new Error("Failed to create task: Unknown error");
    }
  }
}




// UPDATE Task (to mark it completed or update reminder)
// export async function updateTask(taskId: string, updates: Partial<{ 
//   title: string; 
//   completed: boolean; 
//   reminder?: { 
//     date: Date; 
//     note: string; 
//     frequency: "daily" | "weekly" | "hourly"; 
//   }; 
//   subtasks?: { title: string; completed: boolean }[]; 
// }>) {
//   try {
//     await connectToDatabase();

//     const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

//     if (!updatedTask) throw new Error("Task not found");

//     return JSON.parse(JSON.stringify(updatedTask));
//   } catch (error) {
//     handleError(error);
//   }
// }

// // DELETE Task
// export async function deleteTask(taskId: string) {
//   try {
//     await connectToDatabase();

//     const deletedTask = await Task.findByIdAndDelete(taskId);

//     if (!deletedTask) throw new Error("Task not found");

//     return JSON.parse(JSON.stringify(deletedTask));
//   } catch (error) {
//     handleError(error);
//   }
// }

// GET Task by ID
export async function getTaskById(taskId: string) {
  try {
    await connectToDatabase();

    const task = await Task.findById(taskId);

    if (!task) throw new Error("Task not found");

    return JSON.parse(JSON.stringify(task));
  } catch (error) {
    handleError(error);
  }
}

export async function getTasks(userId: string, status: string) {
  try {
    await connectToDatabase();
    console.log("Database connected successfully.");

    // Build query to fetch all tasks for the user, no status filter applied
    // const query: any = { userId };
    const query: { userId: string } = { userId };

    // Fetch all tasks based on the userId, ignoring status
    const tasks = await Task.find(query);
    console.log("Fetched tasks from DB:", tasks);

    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array to avoid crashes
  }
}


  