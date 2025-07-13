"use client";

import { useState, useEffect } from "react";
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

// Define interfaces for goal and subtask objects
interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
}

interface Goal {
  _id: string;
  title: string;
  subgoals: Subtask[];
  dueDate: string;
  dueTime: string;
  completed: boolean;
}

const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [subtaskInput, setSubtaskInput] = useState<string>("");
  const [subgoals, setSubgoals] = useState<Subtask[]>([]);
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<Dayjs | null>(dayjs());
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Goal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isCongratsOpen, setIsCongratsOpen] = useState<boolean>(false);
  const [completedTaskTitle, setCompletedTaskTitle] = useState<string>("");

  useEffect(() => {
    const storedGoals = localStorage.getItem("goals");
    if (storedGoals) {
      try {
        setGoals(JSON.parse(storedGoals) as Goal[]);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        setGoals([]);
      }
    }
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem("goals", JSON.stringify(goals));
    }
  }, [goals]);

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

    let updatedGoals: Goal[];
    if (editingTask) {
      updatedGoals = goals.map((task) =>
        task._id === editingTask._id
          ? {
              ...task,
              title: taskTitle,
              subgoals,
              dueDate,
              dueTime: dueTime.format("hh:mm A"),
            }
          : task
      );
      setEditingTask(null);
    } else {
      const newTask: Goal = {
        _id: Math.random().toString(),
        title: taskTitle,
        subgoals,
        dueDate,
        dueTime: dueTime.format("hh:mm A"),
        completed: false,
      };
      updatedGoals = [...goals, newTask];
    }

    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    setTaskTitle("");
    setSubgoals([]);
    setSubtaskInput("");
    setDueDate("");
    setDueTime(dayjs());
    setIsDialogOpen(false);
  };

  const handleAddSubtask = (): void => {
    if (subtaskInput.trim() !== "") {
      setSubgoals([
        ...subgoals,
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
          <h1 className="text-xl font-semibold text-black">Your Goals</h1>
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

        {goals
          .filter(
            (task: Goal) =>
              filter === "all" ||
              (filter === "completed" && task.completed) ||
              (filter === "pending" && !task.completed)
          )
          .sort((a: Goal, b: Goal) => {
            if (a.completed !== b.completed) return a.completed ? 1 : -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          })
          .map((task: Goal) => (
            <div key={task._id} className="bg-green-200 p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {
                      const updatedGoals = goals.map((t) =>
                        t._id === task._id
                          ? {
                              ...t,
                              completed: !t.completed,
                              subgoals: t.subgoals.map((st) => ({
                                ...st,
                                completed: !t.completed,
                              })),
                            }
                          : t
                      );
                      setGoals(updatedGoals);
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
                    Due:{" "}
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
                      setSubgoals(task.subgoals);
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
                      const updatedGoals = goals.filter(
                        (t) => t._id !== task._id
                      );
                      setGoals(updatedGoals);
                      localStorage.setItem(
                        "goals",
                        JSON.stringify(updatedGoals)
                      );
                    }}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {task.subgoals.length > 0 && expandedTask === task._id && (
                <ul className="p-5">
                  {task.subgoals.map((subtask: Subtask) => (
                    <li
                      key={subtask._id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => {
                            const updatedGoals = goals.map((t) => {
                              if (t._id === task._id) {
                                const updatedSubgoals = t.subgoals.map((st) =>
                                  st._id === subtask._id
                                    ? { ...st, completed: !st.completed }
                                    : st
                                );
                                const allCompleted = updatedSubgoals.every(
                                  (st) => st.completed
                                );
                                return {
                                  ...t,
                                  subgoals: updatedSubgoals,
                                  completed: allCompleted,
                                };
                              }
                              return t;
                            });
                            setGoals(updatedGoals);
                            const updatedTask = updatedGoals.find(
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
                          const updatedGoals = goals.map((t) => {
                            if (t._id === task._id) {
                              return {
                                ...t,
                                subgoals: t.subgoals.filter(
                                  (st) => st._id !== subtask._id
                                ),
                              };
                            }
                            return t;
                          });
                          setGoals(updatedGoals);
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
              setSubgoals([]);
              setSubtaskInput("");
              setDueDate("");
              setDueTime(dayjs());
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 rounded-full h-12 w-12 bg-green-600 text-white"
              onClick={() => {
                setEditingTask(null);
                setTaskTitle("");
                setSubgoals([]);
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
              {editingTask ? "Edit Task" : "Add New Goal"}
            </DialogTitle>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Enter Goal title"
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
                  placeholder="Enter subgoal"
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
              {subgoals.length > 0 && (
                <ul className="mt-2 pl-4 text-black">
                  {subgoals.map((subtask: Subtask) => (
                    <li
                      key={subtask._id}
                      className="flex justify-between items-center p-1 border-b"
                    >
                      <span>{subtask.title}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSubgoals(
                            subgoals.filter((st) => st._id !== subtask._id)
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
                {editingTask ? "Update Task" : "Add Goal"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={isCongratsOpen} onOpenChange={setIsCongratsOpen}>
          <DialogContent className="bg-green-100">
            <DialogTitle className="text-2xl font-bold text-green-800">
              Congratulations!
            </DialogTitle>
            <p className="text-lg text-black">
              You’ve completed the task: <strong>{completedTaskTitle}</strong>!
              Great job!
            </p>
            <Button
              className="mt-4 bg-green-600 text-white"
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

export default GoalsPage;