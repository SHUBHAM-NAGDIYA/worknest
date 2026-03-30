import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTasks, updateTaskStatus, deleteTask } from "../services/api";

function ProjectTasks() {

  const { id } = useParams();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {

    try {

      const response = await getTasks(id);

      setTasks(response.data.data);

    } catch (error) {

      console.error("Failed to fetch tasks");

    }

  };

  const handleStatusChange = async (taskId, status) => {

    try {

      await updateTaskStatus(taskId, { status });

      fetchTasks();

    } catch (error) {

      console.error("Failed to update task");

    }

  };

  const handleDelete = async (taskId) => {

    try {

      await deleteTask(taskId);

      fetchTasks();

    } catch (error) {

      console.error("Failed to delete task");

    }

  };
return (
  <div>

    <Navbar />

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Project Tasks
      </h1>

    </div>

  </div>
);
}

export default ProjectTasks;