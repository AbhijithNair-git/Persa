// "use server";

// import { connectToDatabase } from "../database/mongoose";
// import Todo from "../database/models/task.model";
// import { handleError } from "../utils";
// import mongoose, { Types } from "mongoose";
// import { ITodo, ISubTodo } from "../database/models/task.model";

// /**
//  * Create a new Todo
//  */


// // the below TaskInput is the same as the one in the app/api/tasks/route.ts
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


// export async function createTask(todo: TaskInput) {
//   try {
//     await connectToDatabase();

//     if (!todo.userId || !todo.mainContent || !todo.lastDate || !todo.timeToRemind) {
//       throw new Error("Missing required fields: userId, mainContent, lastDate, or timeToRemind.");
//     }

//     const lastDate = new Date(todo.lastDate);
//     if (isNaN(lastDate.getTime())) {
//       throw new Error("Invalid lastDate. Must be a valid ISO string.");
//     }

//     // Create a new Mongoose document
//     const newTodo = new Todo({
//       userId: todo.userId,
//       remainderType: todo.remainderType,
//       mainContent: todo.mainContent,
//       lastDate,
//       timeToRemind: todo.timeToRemind,
//       status: todo.status || "incomplete",
//       hasSubTodo: todo.hasSubTodo || false,
//       subTodos: todo.subTodos || [],
//     });

//     await newTodo.save();
//     return JSON.parse(JSON.stringify(newTodo)); // Convert to plain object for response
//   } catch (error) {
//     console.error("Error creating task:", error);
//     throw error; // Rethrow for proper error handling
//   }
// }

// /**
//  * Fetch all Todos by userId and optional status
//  */
// export async function getTasks(userId: string, status?: "completed" | "pending" | "incomplete") {
//   try {
//     await connectToDatabase();

//     const query: { userId: string; status?: "completed" | "pending" | "incomplete" } = { userId };
//     if (status) query.status = status;

//     const todos = await Todo.find(query);
//     return JSON.parse(JSON.stringify(todos));
//   } catch (error) {
//     console.error("Error fetching todos:", error);
//     return [];
//   }
// }

// /**
//  * Fetch a single Todo by ID
//  */
// export async function getTaskById(todoId: Types.ObjectId) {
//   try {
//     await connectToDatabase();

//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       throw new Error("Invalid todo ID");
//     }

//     const todo = await Todo.findById(todoId);
//     if (!todo) throw new Error("Todo not found");

//     return JSON.parse(JSON.stringify(todo));
//   } catch (error) {
//     handleError(error);
//   }
// }

// /**
//  * Update a Todo
//  */
// export async function updateTask(todoId: Types.ObjectId, updatedData: Partial<ITodo>) {
//   try {
//     await connectToDatabase();

//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       throw new Error("Invalid todo ID");
//     }

//     const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData, { new: true });
//     if (!updatedTodo) throw new Error("Todo not found");

//     return JSON.parse(JSON.stringify(updatedTodo));
//   } catch (error) {
//     handleError(error);
//   }
// }

// /**
//  * Delete a Todo
//  */
// export async function deleteTask(todoId: Types.ObjectId) {
//   try {
//     await connectToDatabase();

//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       throw new Error("Invalid todo ID");
//     }

//     const deletedTodo = await Todo.findByIdAndDelete(todoId);
//     if (!deletedTodo) throw new Error("Todo not found");

//     return JSON.parse(JSON.stringify(deletedTodo));
//   } catch (error) {
//     handleError(error);
//   }
// }

// /**
//  * Add a subTodo to a Todo
//  */
// export async function addSubTodo(todoId: Types.ObjectId, subTodo: Omit<ISubTodo, "_id">) {
//   try {
//     await connectToDatabase();

//     if (!mongoose.Types.ObjectId.isValid(todoId)) {
//       throw new Error("Invalid todo ID");
//     }

//     const todo = await Todo.findById(todoId);
//     if (!todo) throw new Error("Todo not found");

//     const newSubTodo: ISubTodo = {
//       _id: new Types.ObjectId(),
//       ...subTodo,
//     };

//     todo.subTodos.push(newSubTodo);
//     todo.hasSubTodo = true;
//     await todo.save();

//     return JSON.parse(JSON.stringify(todo));
//   } catch (error) {
//     handleError(error);
//   }
// }

// /**
//  * Update a subTodo
//  */
// export async function updateSubTodo(todoId: Types.ObjectId, subTodoId: Types.ObjectId, updatedSubTodo: Partial<ISubTodo>) {
//   try {
//     await connectToDatabase();

//     const todo = await Todo.findById(todoId);
//     if (!todo) throw new Error("Todo not found");

//     const subTodo = todo.subTodos.id(subTodoId);
//     if (!subTodo) throw new Error("SubTodo not found");

//     Object.assign(subTodo, updatedSubTodo);
//     await todo.save();

//     return JSON.parse(JSON.stringify(todo));
//   } catch (error) {
//     handleError(error);
//   }
// }

// /**
//  * Delete a subTodo
//  */

// export async function deleteSubTodo(todoId: Types.ObjectId, subTodoId: Types.ObjectId) {
//   try {
//     await connectToDatabase();

//     const todo = await Todo.findById(todoId);
//     if (!todo) throw new Error("Todo not found");

//     todo.subTodos = todo.subTodos.filter((sub: ISubTodo) => !sub._id.equals(subTodoId));
//     todo.hasSubTodo = todo.subTodos.length > 0;
//     await todo.save();

//     return JSON.parse(JSON.stringify(todo));
//   } catch (error) {
//     handleError(error);
//   }
// }

