import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/api";

function CreateProject() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    deadline: ""
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createProject(formData);

      alert("Project created successfully");

      navigate("/dashboard");

    } catch (error) {

      console.error("Failed to create project");

    }

  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Project
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Project Name"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <input
            type="date"
            name="deadline"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Create Project
          </button>

        </form>

      </div>

    </div>

  );
}

export default CreateProject;