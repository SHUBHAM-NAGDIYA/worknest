import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex">

        {/* Sidebar */}

        <div className="w-64 bg-white shadow-md p-5">

          <h2 className="text-xl font-bold mb-6">
            Admin Panel
          </h2>

          <div className="space-y-3">

            <button
              onClick={() => navigate("/admin/teams")}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Teams
            </button>

            <button
              onClick={() => navigate("/admin/projects")}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Projects
            </button>

            <button
              onClick={() => navigate("/admin/tasks")}
              className="w-full text-left p-2 hover:bg-gray-100 rounded"
            >
              Tasks
            </button>

          </div>

        </div>

        {/* Main Content */}

        <div className="flex-1 p-8">

          <h1 className="text-3xl font-bold mb-6">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-3 gap-6">

            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-gray-500">Teams</h3>
              <p className="text-2xl font-bold">--</p>
            </div>

            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-gray-500">Projects</h3>
              <p className="text-2xl font-bold">--</p>
            </div>

            <div className="bg-white p-6 shadow rounded">
              <h3 className="text-gray-500">Tasks</h3>
              <p className="text-2xl font-bold">--</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;