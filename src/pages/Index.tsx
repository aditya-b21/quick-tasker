import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Task {
  id: number;
  text: string;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, { id: Date.now(), text: trimmed }]);
    setInput("");
  };

  const deleteTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-background pt-[18vh]">
      <div className="w-full max-w-md px-4">
        <h1 className="mb-6 text-2xl font-semibold tracking-tight text-foreground">
          Tasks
        </h1>

        {/* Input */}
        <div className="mb-6 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Add a task…"
            className="flex-1 rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <button
            onClick={addTask}
            className="flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Task list */}
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="group flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-card-foreground animate-in fade-in slide-in-from-top-1 duration-200"
            >
              <span className="truncate pr-2">{task.text}</span>
              <button
                onClick={() => deleteTask(task.id)}
                className="shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-8">
            No tasks yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
};

export default Index;
