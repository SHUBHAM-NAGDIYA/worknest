import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTask, getProjects } from "../services/api";

function CreateTask() {

  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    project_id: "",
    deadline: ""
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const response = await getProjects();

      setProjects(response.data.data);

    } catch (error) {

      console.error("Failed to fetch projects");

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createTask(formData);

      alert("Task created successfully");

      navigate("/dashboard");

    } catch (error) {

      console.error("Failed to create task");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Task
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="title"
            placeholder="Task Title"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <select
            name="project_id"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          >

            <option value="">Select Project</option>

            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}

          </select>

          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Create Task
          </button>

        </form>

      </div>

    </div>

  );
}

export default CreateTask;