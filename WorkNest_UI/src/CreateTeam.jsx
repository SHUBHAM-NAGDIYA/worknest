import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTeam } from "../services/api";

function CreateTeam() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam({ name });
      alert("Team created successfully");
      navigate("/admin-dashboard");
    } catch (err) {
      alert("Failed to create team");
    }
  };

  return (
    <div>
      <h1>Create Team</h1>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Team Name" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Create Team</button>
      </form>
    </div>
  );
}

export default CreateTeam;