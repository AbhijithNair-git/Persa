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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash } from "lucide-react";

// Define interface for health data entry
interface HealthEntry {
  type: "Sugar" | "Pressure" | "Cholesterol";
  value: number;
  date: string;
}

const HealthPage: React.FC = () => {
  const [type, setType] = useState<"Sugar" | "Pressure" | "Cholesterol" | "">("");
  const [value, setValue] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<HealthEntry[]>([]);
  const [viewType, setViewType] = useState<"graph" | "table">("graph");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [filterType, setFilterType] = useState<"All" | "Sugar" | "Pressure" | "Cholesterol">("All");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("healthData") || "[]") as HealthEntry[];
    setData(storedData);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem("healthData", JSON.stringify(data));
    }
  }, [data]);

  const handleAdd = (): void => {
    if (!type || !value) return;

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return;

    if (editIndex !== null) {
      const updatedData = [...data];
      updatedData[editIndex] = { type, value: parsedValue, date };
      setData(updatedData);
      setEditIndex(null);
    } else {
      setData([...data, { type, value: parsedValue, date }]);
    }
    resetForm();
  };

  const handleEdit = (index: number): void => {
    const entry = data[index];
    setType(entry.type);
    setValue(entry.value.toString());
    setDate(entry.date);
    setEditIndex(index);
    setIsDialogOpen(true);
  };

  const handleDelete = (index: number): void => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const resetForm = (): void => {
    setType("");
    setValue("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsDialogOpen(false);
    setEditIndex(null);
  };

  // Type-safe handlers for Select onValueChange
  const handleViewTypeChange = (value: string): void => {
    if (["graph", "table"].includes(value)) {
      setViewType(value as "graph" | "table");
    }
  };

  const handleFilterTypeChange = (value: string): void => {
    if (["All", "Sugar", "Pressure", "Cholesterol"].includes(value)) {
      setFilterType(value as "All" | "Sugar" | "Pressure" | "Cholesterol");
    }
  };

  const handleTypeChange = (value: string): void => {
    if (["Sugar", "Pressure", "Cholesterol"].includes(value)) {
      setType(value as "Sugar" | "Pressure" | "Cholesterol");
    }
  };

  const filteredData: HealthEntry[] =
    filterType === "All"
      ? data
      : data.filter((entry) => entry.type === filterType);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-black">Your Health</h1>
        <Select onValueChange={handleViewTypeChange} value={viewType}>
          <SelectTrigger className="w-40 mb-4">
            <SelectValue placeholder="Select View" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="graph">Graph View</SelectItem>
            <SelectItem value="table">Table View</SelectItem>
          </SelectContent>
        </Select>
      </header>

      {viewType === "graph" ? (
        (["Sugar", "Pressure", "Cholesterol"] as const).map(
          (category) =>
            data.some((entry) => entry.type === category) && (
              <Card key={category} className="mb-4 p-4">
                <CardHeader>
                  <CardTitle className="text-sm">{category} Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={150}>
                    <LineChart
                      data={[...data]
                        .filter((entry: HealthEntry) => entry.type === category)
                        .sort((a: HealthEntry, b: HealthEntry) => new Date(a.date).getTime() - new Date(b.date).getTime())}
                    >
                      <XAxis
                        dataKey="date"
                        tickFormatter={(date: string) =>
                          new Date(date).toLocaleDateString("en-GB")
                        }
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#f6ad55" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )
        )
      ) : (
        <Card className="p-4">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-lg">Health Data Table</CardTitle>
            <Select onValueChange={handleFilterTypeChange} value={filterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Sugar">Sugar</SelectItem>
                <SelectItem value="Pressure">Pressure</SelectItem>
                <SelectItem value="Cholesterol">Cholesterol</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sl. No</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((entry: HealthEntry, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.type}</TableCell>
                      <TableCell>{entry.value}</TableCell>
                      <TableCell>
                        {new Date(entry.date).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit className="w-5 h-5 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(index)}
                        >
                          <Trash className="w-5 h-5 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-red-500 text-white shadow-lg flex items-center justify-center"
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={resetForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Health Data" : "Add Health Data"}
            </DialogTitle>
          </DialogHeader>
          <Select onValueChange={handleTypeChange} value={type}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sugar">Sugar (mg/dL)</SelectItem>
              <SelectItem value="Pressure">Pressure (mmHg)</SelectItem>
              <SelectItem value="Cholesterol">Cholesterol (mg/dL)</SelectItem>
            </SelectContent>
          </Select>
          <input
            type="number"
            className="w-full p-2 border rounded mt-3 text-black"
            placeholder="Enter Value"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
          />
          <input
            type="date"
            className="w-full p-2 border rounded mt-3 text-black"
            value={date}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDate(e.target.value)
            }
          />
          <Button className="w-full mt-3" onClick={handleAdd}>
            {editIndex !== null ? "Update" : "Add"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthPage;