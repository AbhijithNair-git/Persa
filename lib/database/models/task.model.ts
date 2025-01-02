import { Document, Schema, model, models } from "mongoose";

export interface ITask {
  title: string;
  completed: boolean;
  reminder?: {
    date: Date; // Reminder date
    note: string; // Optional note for the reminder
  };
  subtasks?: ITask[]; // Nested subtasks
}

export interface ITodo extends Document {
  userId: string; // Reference to the user
  tasks: ITask[]; // Array of tasks
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  reminder: {
    date: { type: Date }, // Optional reminder date
    note: { type: String }, // Optional reminder note
  },
  subtasks: [{ type: Schema.Types.Mixed }], // Nested subtasks
});

const TodoSchema = new Schema<ITodo>({
  userId: { type: String, required: true }, // User ID reference
  tasks: [TaskSchema], // Array of tasks using TaskSchema
}, { timestamps: true });

const Todo = models?.Todo || model<ITodo>("Todo", TodoSchema);

export default Todo;
