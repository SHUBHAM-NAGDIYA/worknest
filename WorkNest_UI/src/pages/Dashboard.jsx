import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getProjects } from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {

  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {

    try {

      const response = await getProjects();

      setProjects(response.data.data);

    } catch (error) {

      console.error("Failed to fetch projects");

    }

  };
return (
  <div>

    <Navbar />

    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Project Cards */}

    </div>

  </div>
);
}

export default Dashboard;