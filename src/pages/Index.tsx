import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Task {
  id: string;
  text: string;
}

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text: trimmed }]);
    setInput("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task…"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addTask}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Add
          </button>
        </div>

        <ul className="space-y-1">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="group flex items-center justify-between rounded-md px-3 py-2 hover:bg-muted transition-colors"
            >
              <span className="text-sm text-foreground">{task.text}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No tasks yet
          </p>
        )}
      </div>
    </div>
  );
}
