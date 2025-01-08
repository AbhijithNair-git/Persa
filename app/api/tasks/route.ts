// app/api/tasks/route.ts

import { NextResponse } from "next/server";
import { createTask, getTasks } from "@/lib/actions/task.actions";

// Create task route
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
      dueDate: new Date(body.dueDate).toISOString(),
      reminder: body.reminder,
      subtasks: body.subtasks,
    });

    return NextResponse.json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    return new NextResponse("Error creating task", { status: 500 });
  }
}

// Get tasks route
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const status = url.searchParams.get("status");

  if (!userId || !status) {
    return new NextResponse("Missing required query parameters", { status: 400 });
  }

  try {
    const tasks = await getTasks(userId, status);
    return NextResponse.json({ tasks });
  } catch (error) {
    return new NextResponse("Error getting tasks", { status: 500 });
  }
}
