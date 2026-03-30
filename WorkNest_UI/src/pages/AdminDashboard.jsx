import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-blue-600">WorkNest Admin</h2>

        <div className="flex gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link to="/LoginPage" className="text-gray-700 hover:text-blue-600">
            Logout
          </Link>
        </div>
      </nav>

      {/* Header */}
      <div className="px-10 py-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage teams, members, and projects from one place.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10 pb-10">

        {/* Team Management */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">Team Management</h3>
          <p className="text-gray-600 mb-4">
            Create and manage teams efficiently.
          </p>

          <div className="flex flex-col gap-2">
            <Link to="/CreateTeam">
              <button className="w-full">Create Team</button>
            </Link>
            <Link to="/TeamProjectManager">
              <button className="w-full bg-gray-700 hover:bg-gray-800">
                Manage Teams
              </button>
            </Link>
          </div>
        </div>

        {/* Member Management */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">Member Management</h3>
          <p className="text-gray-600 mb-4">
            Add and manage organization members.
          </p>

          <Link to="/CreateMember">
            <button className="w-full">Create Member</button>
          </Link>
        </div>

        {/* Project Management */}
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-3">Project Management</h3>
          <p className="text-gray-600 mb-4">
            Create and track project progress.
          </p>

          <div className="flex flex-col gap-2">
            <Link to="/CreateProject">
              <button className="w-full">Create Project</button>
            </Link>
            <Link to="/ProjectList">
              <button className="w-full bg-gray-700 hover:bg-gray-800">
                View Projects
              </button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;