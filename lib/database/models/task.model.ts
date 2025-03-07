import { Document, Schema, model, models, Types } from "mongoose";

export interface ISubTodo {
  _id: Types.ObjectId; // Unique ID for each subtask
  content: string;
  status: "completed" | "pending" | "incomplete";
}

export interface ITodo extends Document {
  userId: string;
  remainderType: "daily" | "weekly" | "monthly";
  status: "completed" | "pending" | "incomplete";
  mainContent: string;
  hasSubTodo: boolean;
  subTodos?: ISubTodo[]; // Array of one-level subtasks
  lastDate: Date;
  timeToRemind: string;
}

const SubTodoSchema = new Schema<ISubTodo>(
  {
    _id: { type: Schema.Types.ObjectId, auto: true }, // Ensure _id is generated automatically
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "incomplete"],
      required: true,
    },
  },
  { timestamps: true }
);

const TodoSchema = new Schema<ITodo>(
  {
    userId: { type: String, required: true },
    remainderType: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "incomplete"],
      required: true,
    },
    mainContent: { type: String, required: true },
    hasSubTodo: { type: Boolean, default: false },
    subTodos: { type: [SubTodoSchema], default: [] }, // Default as an empty array
    lastDate: { type: Date, required: true },
    timeToRemind: { type: String, required: true },
  },
  { timestamps: true }
);

const Todo = models?.Todo || model<ITodo>("Todo", TodoSchema);
export default Todo;
