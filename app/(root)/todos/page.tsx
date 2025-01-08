"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {Dialog,DialogContent,DialogTitle,DialogTrigger,} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import axios from "axios";

const TodosPage = () => {
  const [todos, setTodos] = useState<any[]>([]);
  const [status, setStatus] = useState<"all" | "completed" | "pending">("all");
  const [taskTitle, setTaskTitle] = useState(""); // for the new task form
  const userId = "6778a85fabb13a1d26a7e030"; // You should dynamically fetch/set the user ID here
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // State to manage which tasks are expanded
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  // Fetch tasks when the component mounts or the status changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("/api/tasks", {
          params: { userId, status },
        });
        setTodos(response.data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [status, userId]);

  const handleSelectChange = (value: "all" | "completed" | "pending") => {
    setStatus(value);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (taskTitle.trim() === "" || dueDate.trim() === "") {
      console.error("Task title or dueDate is empty");
      return;
    }

    const formattedSubtasks = subtasks.map((subtask) => ({
      title: subtask,
      completed: false,
    }));

    try {
      await axios.post("/api/tasks", {
        title: taskTitle,
        subtasks: formattedSubtasks,
        userId,
        completed: isCompleted,
        dueDate: new Date(dueDate).toISOString(),
      });

      // Re-fetch tasks after adding a new task
      const response = await axios.get("/api/tasks", {
        params: { userId, status },
      });
      setTodos(response.data.tasks);

      // Reset form fields
      setTaskTitle("");
      setSubtasks([]);
      setDueDate("");
      setIsCompleted(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Toggle task expansion
  const toggleSubtasks = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newExpandedTasks = new Set(prev);
      if (newExpandedTasks.has(taskId)) {
        newExpandedTasks.delete(taskId); // Collapse
      } else {
        newExpandedTasks.add(taskId); // Expand
      }
      return newExpandedTasks;
    });
  };

  const renderTodos = () => {
    return todos.map((taskGroup: any) => (
      <div
        key={taskGroup._id}
        className="bg-white p-4 rounded-lg shadow-lg mb-6"
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Task Group
        </h3>
        {taskGroup.tasks.map((task: any) => (
          <div
            key={task._id}
            className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
          >
            <div
              className="flex justify-between items-center mb-4 cursor-pointer"
              onClick={() => toggleSubtasks(task._id)} // Toggle when clicking
            >
              <h4 className="text-xl font-medium text-gray-900">
                {task.title}
              </h4>
              <span className="text-sm text-gray-600">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <p
              className={`text-sm font-medium ${
                task.completed ? "text-green-500" : "text-red-500"
              }`}
            >
              {task.completed ? "Completed" : "Incomplete"}
            </p>

            {/* Render subtasks if the task is expanded */}
            {expandedTasks.has(task._id) && task.subtasks && (
              <div className="mt-4">
                <h5 className="text-lg font-semibold text-gray-700 mb-2">
                  Subtasks:
                </h5>
                <div className="pl-4">
                  {task.subtasks.map((subtask: any) => (
                    <div
                      key={subtask._id || subtask.title}
                      className="bg-gray-100 p-2 rounded-md mb-2"
                    >
                      <p className="text-gray-800">{subtask.title}</p>
                      <p
                        className={`text-sm font-medium ${
                          subtask.completed ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {subtask.completed ? "Completed" : "Incomplete"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-black">Your Todos</h1>
        <Select value={status} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </header>

      <div>{renderTodos()}</div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 bg-red-600 text-white"
          >
            <Plus size={24} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add New Todo</DialogTitle>
          <form onSubmit={handleAddTask}>
            <Input
              placeholder="Enter task title"
              className="mt-4 mb-2"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Enter subtasks (comma-separated)"
              className="mt-2 mb-2 w-full p-2 border rounded-md"
              rows={3}
              onChange={(e) =>
                setSubtasks(e.target.value.split(",").map((s) => s.trim()))
              }
            ></textarea>
            <Input
              type="date"
              className="mt-2 mb-2"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="completed"
                className="mr-2"
                checked={isCompleted}
                onChange={(e) => setIsCompleted(e.target.checked)}
              />
              <label htmlFor="completed" className="text-sm">
                Mark as completed
              </label>
            </div>
            <Button className="w-full mt-4" type="submit">
              Add Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodosPage;
