// import { NextResponse } from "next/server";
// import { ISubTodo,  } from "@/lib/database/models/task.model"; // Adjust the path based on your project structure
// // import { ISubTodo, ITodo } from "@/lib/database/models/task.model";
// import { 
//   createTask, 
//   getTasks, 
//   getTaskById, 
//   updateTask, 
//   deleteTask 
// } from "@/lib/actions/task.actions";

// import { Types } from "mongoose";

// type TaskInput = {
//   userId: string;
//   remainderType: "daily" | "weekly" | "monthly";
//   mainContent: string;
//   lastDate: Date;
//   timeToRemind: string;
//   status?: "completed" | "pending" | "incomplete";
//   hasSubTodo?: boolean;
//   subTodos?: ISubTodo[];
// };

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     if (!body.userId || !body.mainContent || !body.lastDate || !body.timeToRemind || !body.remainderType) {
//       return new NextResponse("Missing required fields", { status: 400 });
//     }

//     // Use TaskInput type to avoid Mongoose methods issue
//     const taskData: TaskInput = {
//       userId: body.userId,
//       remainderType: body.remainderType as "daily" | "weekly" | "monthly",
//       mainContent: body.mainContent,
//       lastDate: new Date(body.lastDate),
//       timeToRemind: body.timeToRemind,
//       status: body.status || "incomplete",
//       hasSubTodo: body.hasSubTodo || false,
//       subTodos: body.subTodos || [],
//     };

//     const newTask = await createTask(taskData); // Ensure createTask accepts TaskInput

//     return NextResponse.json({ message: "Task created successfully", task: newTask });
//   } catch (error) {
//     console.error("Error creating task:", error);
//     return new NextResponse("Error creating task", { status: 500 });
//   }
// }



// // Get tasks OR Get task by ID
// export async function GET(req: Request) {
//   try {
//     const url = new URL(req.url);
//     const userId = url.searchParams.get("userId");
//     const taskId = url.searchParams.get("taskId");
//     const status = url.searchParams.get("status");

//     if (taskId) {
//       // Fetch single task by ID
//       if (!Types.ObjectId.isValid(taskId)) {
//         return new NextResponse("Invalid taskId", { status: 400 });
//       }
//       const task = await getTaskById(new Types.ObjectId(taskId));
//       return NextResponse.json({ task });
//     }

//     if (!userId) {
//       return new NextResponse("Missing required query parameter: userId", { status: 400 });
//     }

//     // Fetch all tasks for a user
//     const tasks = await getTasks(userId, status as "completed" | "pending" | "incomplete");
//     return NextResponse.json({ tasks });
//   } catch (error) {
//     console.error("Error getting task(s):", error);
//     return new NextResponse("Error getting task(s)", { status: 500 });
//   }
// }

// // Update task
// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     if (!body.taskId || !body.updatedData || !Types.ObjectId.isValid(body.taskId)) {
//       return new NextResponse("Invalid or missing fields", { status: 400 });
//     }

//     const updatedTask = await updateTask(new Types.ObjectId(body.taskId), body.updatedData);
//     return NextResponse.json({ message: "Task updated successfully", task: updatedTask });
//   } catch (error) {
//     console.error("Error updating task:", error);
//     return new NextResponse("Error updating task", { status: 500 });
//   }
// }

// // Delete task
// export async function DELETE(req: Request) {
//   try {
//     const body = await req.json();
//     if (!body.taskId || !Types.ObjectId.isValid(body.taskId)) {
//       return new NextResponse("Invalid or missing taskId", { status: 400 });
//     }

//     const deletedTask = await deleteTask(new Types.ObjectId(body.taskId));
//     return NextResponse.json({ message: "Task deleted successfully", task: deletedTask });
//   } catch (error) {
//     console.error("Error deleting task:", error);
//     return new NextResponse("Error deleting task", { status: 500 });
//   }
// }
