import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getTeams } from "../services/api";

function CreateProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    deadline: "",
    team_id: ""
  });

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch teams
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await getTeams();
        setTeams(res.data || []);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
        alert("Unable to load teams");
      }
    };

    fetchTeams();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "team_id" ? Number(value) : value
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Project name is required");
      return;
    }

    if (!formData.team_id) {
      alert("Please select a team");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        team_id: formData.team_id,
        deadline: formData.deadline || null
      };

      console.log("Sending:", payload); // Debug

      const res = await createProject(payload);

      alert(res?.data?.message || "Project created successfully");

      navigate("/AdminDashboard");

    } catch (error) {
      console.error("Error:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Project
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Project Name */}
          <input
            type="text"
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Deadline */}
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          />

          {/* Team Dropdown */}
          <select
            name="team_id"
            value={formData.team_id}
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Create Project"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateProject;

