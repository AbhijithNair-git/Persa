import { Document, Schema, model, models } from "mongoose";

export interface ITask {
  title: string;
  completed: boolean;
  dueDate: Date; // Due date and time for the task
  reminder?: {
    type: "specific" | "daily" | "weekly"; // Reminder type
    timeBefore?: number; // Time in minutes before due date for reminder (if 'specific')
    note?: string; // Optional note for the reminder
  };
  subtasks?: { title: string; completed: boolean }[]; // One level of subtasks
}


export interface ITodo extends Document {
  userId: string; // Reference to the user
  tasks: ITask[]; // Array of tasks
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, required: true },
  reminder: {
    type: { type: String, enum: ["specific", "daily", "weekly"], required: false },
    timeBefore: { type: Number, required: function () { return this.reminder?.type === "specific"; } },
    note: { type: String },
  },
  subtasks: [
    {
      title: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
});

const TodoSchema = new Schema<ITodo>({
  userId: { type: String, required: true }, // User ID reference
  tasks: [TaskSchema], // Array of tasks using TaskSchema
}, { timestamps: true });

const Todo = models?.Todo || model<ITodo>("Todo", TodoSchema);

export default Todo;
