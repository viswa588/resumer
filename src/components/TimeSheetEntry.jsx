import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const TimeSheetEntry = () => {
  const [entries, setEntries] = useState([
    {
      date: "",
      hours: "",
      task: "",
      description: "",
    },
  ]);

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        hours: "",
        task: "",
        description: "",
      },
    ]);
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your API call here to submit the timesheet
    console.log("Submitted entries:", entries);
  };

  return (
    <div className="timesheet-layout">
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timesheet Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {entries.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      handleEntryChange(index, "date", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hours</label>
                  <Input
                    type="number"
                    min="0"
                    max="24"
                    value={entry.hours}
                    onChange={(e) =>
                      handleEntryChange(index, "hours", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Task</label>
                  <Input
                    type="text"
                    value={entry.task}
                    onChange={(e) =>
                      handleEntryChange(index, "task", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Input
                    type="text"
                    value={entry.description}
                    onChange={(e) =>
                      handleEntryChange(index, "description", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            ))}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddEntry}
                className="mb-4"
              >
                Add Entry
              </Button>
              <Button type="submit" variant="default" className="mb-4">
                Submit Timesheet
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default TimeSheetEntry;
