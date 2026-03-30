import { useEffect, useState } from "react";
import { getTasksByProject } from "../services/api";

function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });

  useEffect(() => {
    getTasksByProject(projectId).then(res => {
      const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
      res.data.forEach(task => grouped[task.status].push(task));
      setTasks(grouped);
    });
  }, [projectId]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {["TODO", "IN_PROGRESS", "DONE"].map(status => (
        <div key={status}>
          <h2>{status.replace("_", " ")}</h2>
          {tasks[status].map(task => (
            <div key={task.id} style={{ border: "1px solid #ccc", margin: "5px", padding: "5px" }}>
              <h3>{task.title}</h3>
              <p>{task.assigned_to_username || "Unassigned"}</p>
              <p>Priority: {task.priority}</p>
              <p>Deadline: {task.deadline}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default TaskBoard;