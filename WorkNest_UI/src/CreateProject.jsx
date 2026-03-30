import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProject, getTeams } from "../services/api";

function CreateProject() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    team_id: "",
    status: "ACTIVE",
    deadline: ""
  });

  useEffect(() => {
    getTeams().then(res => setTeams(res.data));
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createProject(formData);
      alert("Project created successfully");
      navigate("/projects");
    } catch (err) {
      alert("Failed to create project");
    }
  };

  return (
    <div>
      <h1>Create Project</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Project Name" onChange={handleChange} />
        <select name="team_id" onChange={handleChange}>
          <option value="">Select Team</option>
          {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
        <select name="status" onChange={handleChange} value={formData.status}>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="ON_HOLD">On Hold</option>
        </select>
        <input type="date" name="deadline" onChange={handleChange} />
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;