import { useEffect, useState } from "react";
import { assignMembersToTeam, getTeamsAndMembers } from "../services/api";

function AddMemberToTeam() {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    getTeamsAndMembers().then(res => {
      setTeams(res.data.teams);
      setMembers(res.data.members);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignMembersToTeam(selectedTeam, selectedMembers);
      alert("Members added to team successfully");
    } catch (err) {
      alert("Failed to add members");
    }
  };

  return (
    <div>
      <h1>Add Members to Team</h1>
      <form onSubmit={handleSubmit}>
        <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
          <option value="">Select Team</option>
          {teams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>

        <select multiple value={selectedMembers} onChange={e => setSelectedMembers([...e.target.selectedOptions].map(o => o.value))}>
          {members.map(member => <option key={member.id} value={member.id}>{member.username}</option>)}
        </select>

        <button type="submit">Add Members</button>
      </form>
    </div>
  );
}

export default AddMemberToTeam;