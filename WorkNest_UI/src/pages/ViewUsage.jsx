import { useEffect, useState } from "react";
import { getUsage } from "../services/api";

function ViewUsage() {
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    getUsage().then(res => setUsage(res.data));
  }, []);

  if (!usage) return <p>Loading...</p>;

  return (
    <div>
      <h1>Usage Overview</h1>
      <p>Active Users: {usage.active_users}</p>
      <p>Total Teams: {usage.total_teams}</p>
      <p>Total Projects: {usage.total_projects}</p>
      <p>Last Updated: {new Date(usage.last_updated).toLocaleString()}</p>
    </div>
  );
}

export default ViewUsage;