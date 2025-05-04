// components/TimeSheetEntry.jsx
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { format } from "date-fns";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TimeSheetEntry = () => {
  const [entries, setEntries] = useState([
    {
      project: "",
      task: "",
      hours: ["", "", "", "", "", "", ""],
    },
  ]);

  const projects = [
    { id: 1, name: "Project A" },
    { id: 2, name: "Project B" },
    { id: 3, name: "Project C" },
  ];

  const tasks = [
    { id: 1, name: "Task A" },
    { id: 2, name: "Task B" },
    { id: 3, name: "Task C" },
    { id: 4, name: "Task D" },
  ];

  const handleEntryChange = (rowIndex, field, value) => {
    const updated = [...entries];
    updated[rowIndex][field] = value;
    setEntries(updated);
  };

  const handleHourChange = (rowIndex, dayIndex, value) => {
    const updated = [...entries];
    updated[rowIndex].hours[dayIndex] = value;
    setEntries(updated);
  };

  const handleAddRow = () => {
    setEntries([...entries, { project: "", task: "", hours: ["", "", "", "", "", "", ""] }]);
  };

  const calculateTotal = (dayIndex) => {
    return entries.reduce((sum, entry) => {
      const val = parseFloat(entry.hours[dayIndex]) || 0;
      return sum + val;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted entries:", entries);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Card className="max-w-6xl mx-auto">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Timesheet Entry</CardTitle>
              <CardDescription>Enter your project hours for the week</CardDescription>
            </div>
            <Button variant="outline" onClick={handleAddRow}>Add Row</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left border">Project</th>
                      <th className="p-2 text-left border">Task Description</th>
                      {daysOfWeek.map((day, idx) => (
                        <th key={idx} className="p-2 border">{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, rowIndex) => (
                      <tr key={rowIndex}>
                        <td className="p-2 border">
                          <Select
                            value={entry.project}
                            onValueChange={(value) => handleEntryChange(rowIndex, "project", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects.map((proj) => (
                                <SelectItem key={proj.id} value={proj.name}>{proj.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-2 border">
                          <Select
                            value={entry.task}
                            onValueChange={(value) => handleEntryChange(rowIndex, "task", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select task" />
                            </SelectTrigger>
                            <SelectContent>
                              {tasks.map((task) => (
                                <SelectItem key={task.id} value={task.name}>{task.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        {entry.hours.map((val, dayIndex) => (
                          <td key={dayIndex} className="p-2 border">
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              value={val}
                              onChange={(e) => handleHourChange(rowIndex, dayIndex, e.target.value)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-gray-50 font-medium">
                      <td className="p-2 border text-right" colSpan={2}>Total</td>
                      {daysOfWeek.map((_, idx) => (
                        <td key={idx} className="p-2 border">{calculateTotal(idx)}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" type="button">Save Draft</Button>
            <Button type="submit" onClick={handleSubmit}>Submit</Button>
            {/* <Button variant="secondary" type="button">Approve</Button> */}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TimeSheetEntry;