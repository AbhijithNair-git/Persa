"use server";

import { NextResponse } from "next/server";
import { createTask, updateTask, deleteTask, getTaskById } from "@/lib/actions/task.actions";
// import { headers } from "next/headers";

// CREATE Task
export async function POST(req: Request) {
  const body = await req.json();

  try {
    if (!body.dueDate) {
      throw new Error("dueDate is required.");
    }

    const newTask = await createTask({
      userId: body.userId,
      title: body.title,
      completed: body.completed,
      dueDate: new Date(body.dueDate).toISOString(), // Ensure dueDate is always ISO string
      reminder: body.reminder,
      subtasks: body.subtasks,
    });

    return NextResponse.json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse("Error creating task", { status: 500 });
  }
}



// UPDATE Task
export async function PUT(req: Request) {
  const body = await req.json();
  const { taskId, updates } = body;

  try {
    const updatedTask = await updateTask(taskId, updates);
    return NextResponse.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    return new NextResponse("Error updating task", { status: 500 });
  }
}

// DELETE Task
export async function DELETE(req: Request) {
  const { taskId } = await req.json();

  try {
    const deletedTask = await deleteTask(taskId);
    return NextResponse.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse("Error deleting task", { status: 500 });
  }
}

// GET Task by ID
export async function GET(req: Request) {
  const { taskId } = await req.json();

  try {
    const task = await getTaskById(taskId);
    return NextResponse.json({ task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return new NextResponse("Error fetching task", { status: 500 });
  }
}
