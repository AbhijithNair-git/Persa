"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, Pencil } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import confetti from "canvas-confetti";

// Define interfaces for subtask and task
interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
}

interface Task {
  _id: string;
  title: string;
  subtasks: Subtask[];
  dueDate: string;
  dueTime: string;
  completed: boolean;
}

const TasksPage: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [subtaskInput, setSubtaskInput] = useState<string>("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<Dayjs | null>(dayjs());
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCongratsOpen, setIsCongratsOpen] = useState<boolean>(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState<string>("");
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState<boolean>(false);
  const [userPlan, setUserPlan] = useState<"free" | "pro">("free");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks) as Task[]);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        setTasks([]);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  const triggerConfetti = (): void => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#ff4500", "#00ff00", "#1e90ff", "#ff69b4"],
    });
  };

  const handleAddTask = (e: React.FormEvent): void => {
    e.preventDefault();
    if (taskTitle.trim() === "" || dueDate.trim() === "" || !dueTime) return;

    if (userPlan === "free" && !editingTask && tasks.length >= 5) {
      setIsUpgradeDialogOpen(true);
      return;
    }

    let updatedTasks: Task[];
    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task._id === editingTask._id
          ? {
              ...task,
              title: taskTitle,
              subtasks,
              dueDate,
              dueTime: dueTime.format("hh:mm A"),
            }
          : task
      );
      setEditingTask(null);
    } else {
      const newTask: Task = {
        _id: Math.random().toString(),
        title: taskTitle,
        subtasks,
        dueDate,
        dueTime: dueTime.format("hh:mm A"),
        completed: false,
      };
      updatedTasks = [...tasks, newTask];
    }

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    setTaskTitle("");
    setSubtasks([]);
    setSubtaskInput("");
    setDueDate("");
    setDueTime(dayjs());
    setIsDialogOpen(false);
  };

  const handleAddSubtask = (): void => {
    if (subtaskInput.trim() !== "") {
      setSubtasks([
        ...subtasks,
        {
          _id: Math.random().toString(),
          title: subtaskInput.trim(),
          completed: false,
        },
      ]);
      setSubtaskInput("");
    }
  };

  // Type-safe handler for Select onValueChange
  const handleFilterChange = (value: string): void => {
    if (["all", "completed", "pending"].includes(value)) {
      setFilter(value as "all" | "completed" | "pending");
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="p-6 max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-5">
          <h1 className="text-xl font-semibold text-black">Your Tasks</h1>
          <Select onValueChange={handleFilterChange} value={filter}>
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

        {tasks
          .filter(
            (task: Task) =>
              filter === "all" ||
              (filter === "completed" && task.completed) ||
              (filter === "pending" && !task.completed)
          )
          .sort((a: Task, b: Task) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          })
          .map((task: Task) => (
            <div key={task._id} className="bg-orange-100 p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      const updatedTasks = tasks.map((t) =>
                        t._id === task._id
                          ? {
                              ...t,
                              completed: !t.completed,
                              subtasks: t.subtasks.map((st) => ({
                                ...st,
                                completed: !t.completed,
                              })),
                            }
                          : t
                      );
                      setTasks(updatedTasks);
                      if (!task.completed) {
                        triggerConfetti();
                        setCompletedTaskTitle(task.title);
                        setIsCongratsOpen(true);
                      }
                    }}
                    className="accent-[#023467]"
                  />
                  <h4
                    onClick={() =>
                      setExpandedTask(
                        expandedTask === task._id ? null : task._id
                      )
                    }
                    className={`text-lg font-semibold inline ml-2 cursor-pointer outline-none select-none focus:ring-0 focus:outline-none ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-black"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <p className="text-sm text-black">
                    Due{" "}
                    {new Date(task.dueDate)
                      .toLocaleDateString("en-GB")
                      .replace(/\//g, "-")}{" "}
                    at {task.dueTime}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingTask(task);
                      setTaskTitle(task.title);
                      setSubtasks(task.subtasks);
                      setDueDate(task.dueDate);
                      setDueTime(dayjs(task.dueTime, "hh:mm A"));
                      setIsDialogOpen(true);
                    }}
                    className="text-gray-500"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => {
                      const updatedTasks = tasks.filter(
                        (t) => t._id !== task._id
                      );
                      setTasks(updatedTasks);
                      localStorage.setItem(
                        "tasks",
                        JSON.stringify(updatedTasks)
                      );
                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {task.subtasks.length > 0 && expandedTask === task._id && (
                <ul className="p-5">
                  {task.subtasks.map((subtask: Subtask) => (
                    <li
                      key={subtask._id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => {
                            const updatedTasks = tasks.map((t) => {
                              if (t._id === task._id) {
                                const updatedSubtasks = t.subtasks.map((st) =>
                                  st._id === subtask._id
                                    ? { ...st, completed: !st.completed }
                                    : st
                                );
                                const allCompleted = updatedSubtasks.every(
                                  (st) => st.completed
                                );
                                return {
                                  ...t,
                                  subtasks: updatedSubtasks,
                                  completed: allCompleted,
                                };
                              }
                              return t;
                            });
                            setTasks(updatedTasks);
                            const updatedTask = updatedTasks.find(
                              (t) => t._id === task._id
                            );
                            if (
                              updatedTask?.completed &&
                              !task.completed
                            ) {
                              triggerConfetti();
                              setCompletedTaskTitle(task.title);
                              setIsCongratsOpen(true);
                            }
                          }}
                          className="accent-[#023467]"
                        />
                        <span
                          className={`ml-2 select-none ${
                            subtask.completed
                              ? "line-through text-gray-500"
                              : "text-black"
                          }`}
                        >
                          {subtask.title}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const updatedTasks = tasks.map((t) => {
                            if (t._id === task._id) {
                              return {
                                ...t,
                                subtasks: t.subtasks.filter(
                                  (st) => st._id !== subtask._id
                                ),
                              };
                            }
                            return t;
                          });
                          setTasks(updatedTasks);
                        }}
                        className="text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingTask(null);
              setTaskTitle("");
              setSubtasks([]);
              setSubtaskInput("");
              setDueDate("");
              setDueTime(dayjs());
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 rounded-full h-12 w-12 bg-red-600 text-white"
              onClick={() => {
                setEditingTask(null);
                setTaskTitle("");
                setSubtasks([]);
                setSubtaskInput("");
                setDueDate("");
                setDueTime(dayjs());
              }}
            >
              <Plus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="text-black">
              {editingTask ? "Edit Task" : "Add New Task"}
            </DialogTitle>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Enter task title"
                className="w-full p-2 border rounded-md text-black"
                value={taskTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTaskTitle(e.target.value)
                }
                required
              />
              <div className="flex items-center mt-2">
                <input
                  type="text"
                  placeholder="Enter subtask"
                  className="w-full p-2 border rounded-md text-black"
                  value={subtaskInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSubtaskInput(e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="ml-2 p-2 bg-gray-200 rounded-md"
                >
                  <Plus size={18} className="text-black" />
                </button>
              </div>
              {subtasks.length > 0 && (
                <ul className="mt-2 pl-4 text-black">
                  {subtasks.map((subtask: Subtask) => (
                    <li
                      key={subtask._id}
                      className="flex justify-between items-center p-1 border-b"
                    >
                      <span>{subtask.title}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSubtasks(
                            subtasks.filter((st) => st._id !== subtask._id)
                          )
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <input
                type="date"
                className="w-full p-2 border rounded-md mt-2 mb-2 text-black"
                value={dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDueDate(e.target.value)
                }
                required
              />
              <TimePicker
                value={dueTime}
                onChange={(newValue: Dayjs | null) => setDueTime(newValue)}
                ampm={true}
                views={["hours", "minutes"]}
                className="w-full text-black"
              />
              <Button className="w-full mt-4" type="submit">
                {editingTask ? "Update Task" : "Add Task"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isUpgradeDialogOpen}
          onOpenChange={setIsUpgradeDialogOpen}
        >
          <DialogContent className="bg-orange-100">
            <DialogTitle className="text-2xl font-bold text-orange-800">
              Task Limit Reached
            </DialogTitle>
            <p className="text-lg text-black">
              You’ve reached the maximum of 5 tasks on the free plan. Upgrade to
              the Pro plan to add unlimited tasks!
            </p>
            <Button
              className="mt-4 bg-red-600 text-white"
              onClick={() => router.push("/purchase")}
            >
              View Pricing
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={isCongratsOpen} onOpenChange={setIsCongratsOpen}>
          <DialogContent className="bg-orange-100">
            <DialogTitle className="text-2xl font-bold text-orange-800">
              Congratulations!
            </DialogTitle>
            <p className="text-lg text-black">
              You’ve completed the task: <strong>{completedTaskTitle}</strong>!
              Great job!
            </p>
            <Button
              className="mt-4 bg-red-600 text-white"
              onClick={() => setIsCongratsOpen(false)}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default TasksPage;