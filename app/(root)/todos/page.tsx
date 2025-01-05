"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit2, Trash } from "lucide-react";

const TodosPage = () => {
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Main Project work",
      subtasks: ["Design", "Implementation", "Testing", "chummathirikal"],
      expanded: true,
    },
    { id: 2, title: "Mathematics Homework", subtasks: [], expanded: false },
    { id: 3, title: "Read Science text book", subtasks: [], expanded: false },
  ]);

  const [status, setStatus] = useState("all");

  const toggleExpand = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, expanded: !todo.expanded } : todo
      )
    );
  };

  const handleSelectChange = (value: string) => {
    setStatus(value);
  };

  const renderTodos = () =>
    todos
      .filter(
        (todo) =>
          status === "all" ||
          (status === "completed" && todo.subtasks.length === 0) ||
          (status === "pending" && todo.subtasks.length > 0)
      )
      .map((todo) => (
        <div
          key={todo.id}
          className="p-4 rounded-md border bg-orange-100 mb-4 shadow-sm"
        >
          <div className="flex justify-between items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => toggleExpand(todo.id)}
            >
              <input
                type="radio"
                checked={todo.expanded}
                onChange={() => toggleExpand(todo.id)}
                className="mr-2"
              />
              <span className="font-medium text-black">{todo.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Edit2 size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Trash size={16} />
              </Button>
              <Button variant="ghost" size="icon">
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {todo.expanded && todo.subtasks.length > 0 && (
            <div className="mt-3 pl-8">
              {todo.subtasks.map((subtask, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center mb-2 bg-orange-100 p-2 rounded-md"
                >
                  <div>
                    <input type="radio" className="mr-2" />
                    <span className="text-sm text-black">{subtask}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 size={16} />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ));

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
          {/* <h2 className="text-lg font-semibold text-black">Add New Todo</h2> */}
          <Input placeholder="Enter task title" className="mt-4 mb-2" />
          <Button className="w-full">Add Task</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodosPage;
