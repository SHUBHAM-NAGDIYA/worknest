import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwnerDashboard } from "../services/api";
import { useNavigate } from "react-router-dom";



function OwnerDashboard() {

  const navigate = useNavigate();

  const handleUpdate = async (planId) => {
    try {
      await updateSubscription(planId);
        navigate("/OwnerDashboard");
        window.location.reload(); // ✅ redirect
    } catch (err) {
      alert("Failed to update subscription");
    }
  };


  const [orgData, setOrgData] = useState(null);
  useEffect(() => {
    getOwnerDashboard()
      .then(res => setOrgData(res.data)) // ✅ FIXED
      .catch(() => setOrgData(null));
  }, []);

  if (!orgData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const { organization, usage } = orgData;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      {/* Organization Info */}
      <section className="bg-white p-6 rounded-xl shadow mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Organization Info
        </h2>

        <div className="space-y-2 text-gray-700">

          <p>
            <span className="font-semibold">Name:</span>{" "}
            {organization.name}
          </p>

          <p>
            <span className="font-semibold">Subscription Plan:</span>{" "}
            {organization.subscription_plan || "No Plan"}
          </p>

          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={
                organization.is_subscription_active
                  ? "text-green-600 font-semibold"
                  : "text-red-600 font-semibold"
              }
            >
              {organization.is_subscription_active
                ? "Active"
                : "Expired"}
            </span>
          </p>

          <p>
            <span className="font-semibold">Expires At:</span>{" "}
            {organization.expires_at
              ? new Date(organization.expires_at).toLocaleDateString()
              : "N/A"}
          </p>

        </div>

      </section>


      {/* Usage Overview */}
      <section className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            Active Users
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {usage.active_users}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            Total Teams
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {usage.total_teams}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold mb-2">
            Total Projects
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {usage.total_projects}
          </p>
        </div>

      </section>


      {/* Quick Actions */}
      <section className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <Link to="/CreateAdmin">
            <button>
              Create Admin
            </button>
          </Link>

          <Link to="/ManageSubscriptions">
            <button className="bg-green-600 hover:bg-green-700">
              Manage Subscription
            </button>
          </Link>

          <Link to="/owner/view-usage">
            <button className="bg-purple-600 hover:bg-purple-700">
              View Usage
            </button>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default OwnerDashboard;