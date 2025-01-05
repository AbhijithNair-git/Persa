"use server";

import { connectToDatabase } from "../database/mongoose";
import Task from "../database/models/task.model"; // Assuming Task model is defined
import { handleError } from "../utils";
import Todo from "../database/models/task.model"; // Ensure proper import

// CREATE Task
export async function createTask(task: {
  userId: string;
  title: string;
  completed: boolean;
  dueDate: Date;
  reminder?: {
    date: Date;
    note: string;
    frequency: "daily" | "weekly" | "hourly";
  };
  subtasks?: { title: string; completed: boolean }[];
}) {
  try {
    await connectToDatabase();

    // Find or create a Todo document for the user
    const todo = await Todo.findOneAndUpdate(
      { userId: task.userId },
      { $setOnInsert: { userId: task.userId, tasks: [] } },
      { new: true, upsert: true }
    );

    // Push the new task to the tasks array
    todo.tasks.push({
      title: task.title,
      completed: task.completed,
      dueDate: task.dueDate,
      reminder: task.reminder,
      subtasks: task.subtasks, // Ensure it's just one level
    });

    await todo.save();

    // Return the newly added task
    return todo.tasks[todo.tasks.length - 1];
  } catch (error) {
    handleError(error);
  }
}

// UPDATE Task (to mark it completed or update reminder)
export async function updateTask(taskId: string, updates: Partial<{ 
  title: string; 
  completed: boolean; 
  reminder?: { 
    date: Date; 
    note: string; 
    frequency: "daily" | "weekly" | "hourly"; 
  }; 
  subtasks?: { title: string; completed: boolean }[]; 
}>) {
  try {
    await connectToDatabase();

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, { new: true });

    if (!updatedTask) throw new Error("Task not found");

    return JSON.parse(JSON.stringify(updatedTask));
  } catch (error) {
    handleError(error);
  }
}

// DELETE Task
export async function deleteTask(taskId: string) {
  try {
    await connectToDatabase();

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) throw new Error("Task not found");

    return JSON.parse(JSON.stringify(deletedTask));
  } catch (error) {
    handleError(error);
  }
}

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
    const query: any = { userId };

    // Fetch all tasks based on the userId, ignoring status
    const tasks = await Task.find(query);
    console.log("Fetched tasks from DB:", tasks);

    return JSON.parse(JSON.stringify(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return []; // Return an empty array to avoid crashes
  }
}


  