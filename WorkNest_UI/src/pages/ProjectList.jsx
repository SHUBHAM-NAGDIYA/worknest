import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/api";

function ProjectList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects().then(res => setProjects(res.data));
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <Link to="/create-project">
        <button>Create New Project</button>
      </Link>
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            {project.name} - {project.team_name} - {project.status} - {project.deadline}
            <Link to={`/project/${project.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectList;