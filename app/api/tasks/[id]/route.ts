import {  updateTask, deleteTask } from "@/lib/actions/task.actions";
// import { getTaskById, updateTask, deleteTask } from "@/lib/actions/task.actions";

import { NextResponse } from "next/server";
import { Types } from "mongoose";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     if (!Types.ObjectId.isValid(params.id)) {
//       return new NextResponse("Invalid task ID", { status: 400 });
//     }

//     const task = await getTaskById(new Types.ObjectId(params.id));
//     if (!task) {
//       return new NextResponse("Task not found", { status: 404 });
//     }

//     return NextResponse.json(task);
//   } catch (error) {
//     console.error(`Error fetching task with ID ${params.id}:`, error);
//     return new NextResponse("Error fetching task", { status: 500 });
//   }
// }

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return new NextResponse("Invalid task ID", { status: 400 });
    }

    const updatedData = await req.json();
    const updatedTask = await updateTask(new Types.ObjectId(params.id), updatedData);

    if (!updatedTask) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error(`Error updating task with ID ${params.id}:`, error);
    return new NextResponse("Error updating task", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!Types.ObjectId.isValid(params.id)) {
      return new NextResponse("Invalid task ID", { status: 400 });
    }

    const deletedTask = await deleteTask(new Types.ObjectId(params.id));
    if (!deletedTask) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully", task: deletedTask });
  } catch (error) {
    console.error(`Error deleting task with ID ${params.id}:`, error);
    return new NextResponse("Error deleting task", { status: 500 });
  }
}
