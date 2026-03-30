import { useEffect, useState } from "react";
import { getTeams, addMemberToTeam, getMembers } from "../services/api";

function TeamList() {

  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");

  const [message, setMessage] = useState("");

  // fetch teams
  const fetchTeams = async () => {
    try {
      const res = await getTeams();
      setTeams(res.data);
    } catch {
      setMessage("Failed to load teams");
    }
  };

  // fetch members
  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch {
      setMessage("Failed to load members");
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchMembers();
  }, []);

  // add member
  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!selectedUser || !selectedTeam) {
      setMessage("All fields required");
      return;
    }

    try {
      await addMemberToTeam(selectedUser, selectedTeam);
      setMessage("✅ Member added successfully");
      setSelectedUser("");
    } catch {
      setMessage("❌ Failed to add member");
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-4">Teams</h2>

      {/* Team List */}
      <div className="mb-6">
        {teams.map(team => (
          <div key={team.id} className="p-2 border mb-2 rounded">
            {team.name}
          </div>
        ))}
      </div>

      {/* Add Member Form */}
      <form onSubmit={handleAddMember} className="space-y-3">

        <h3 className="text-xl font-semibold">Add Member to Team</h3>

        {/* Select Member */}
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Member</option>
          {members.map(user => (
            <option key={user.id} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>

        {/* Select Team */}
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">Select Team</option>
          {teams.map(team => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        <button type="submit">
          Add Member
        </button>

      </form>

      {message && <p className="mt-3">{message}</p>}

    </div>
  );
}

export default TeamList;