import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminDashboard } from "../services/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getAdminDashboard().then(res => setDashboard(res.data));
  }, []);

  if (!dashboard) return <p>Loading...</p>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Organization Info</h2>
        <p>Name: {dashboard.organization.name}</p>
        <p>Subscription Plan: {dashboard.organization.subscription_plan}</p>
      </section>

      <section>
        <h2>Teams Overview</h2>
        <p>Total Teams: {dashboard.teams.length}</p>
        <ul>
          {dashboard.teams.map(team => <li key={team.id}>{team.name}</li>)}
        </ul>
      </section>

      <section>
        <h2>Members Overview</h2>
        <p>Total Members: {dashboard.members.length}</p>
        <ul>
          {dashboard.members.map(member => <li key={member.id}>{member.username}</li>)}
        </ul>
      </section>

      <section>
        <h2>Projects Overview</h2>
        <p>Total Projects: {dashboard.projects.length}</p>
        <ul>
          {dashboard.projects.map(project => <li key={project.id}>{project.name}</li>)}
        </ul>
      </section>

      <section>
        <h2>Quick Actions</h2>
        <Link to="/admin/create-member">
          <button>Create Member</button>
        </Link>
        <Link to="/admin/create-team">
          <button>Create Team</button>
        </Link>
        <Link to="/admin/add-member-to-team">
          <button>Add Members to Team</button>
        </Link>
      </section>
    </div>
  );
}

export default AdminDashboard;