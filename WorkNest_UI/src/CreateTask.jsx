import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectMembers, createTask } from "../services/api";

function CreateTask({ projectId }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: "",
    status: "TODO",
    priority: "MEDIUM",
    deadline: ""
  });

  useEffect(() => {
    getProjectMembers(projectId).then(res => setMembers(res.data));
  }, [projectId]);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createTask(projectId, formData);
      alert("Task created successfully");
      navigate(`/project/${projectId}`);
    } catch (err) {
      alert("Failed to create task");
    }
  };

  return (
    <div>
      <h1>Create Task</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" onChange={handleChange} />
        <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
        <select name="assigned_to" onChange={handleChange}>
          <option value="">Select Member</option>
          {members.map(member => <option key={member.id} value={member.id}>{member.username}</option>)}
        </select>
        <select name="status" onChange={handleChange} value={formData.status}>
          <option value="TODO">Todo</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
        <select name="priority" onChange={handleChange} value={formData.priority}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input type="date" name="deadline" onChange={handleChange} />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;