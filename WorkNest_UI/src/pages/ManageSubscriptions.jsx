import { useEffect, useState } from "react";
import { getPlans, updateSubscription } from "../services/api";
import { useNavigate } from "react-router-dom";

function ManageSubscriptions() {

  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlans().then(res => setPlans(res.data)); // ✅ FIX
  }, []);

  const handleUpdate = async (planId) => {
    try {
      await updateSubscription(planId);

      alert("Subscription updated successfully");

      // ✅ Redirect to dashboard (VERY IMPORTANT)
      navigate("/OwnerDashboard");

    } catch (err) {
      alert("Failed to update subscription");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <h1 className="text-4xl font-extrabold text-center mb-10">
        Pricing Plans
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">

        {plans?.map((plan, index) => (
          <div
            key={plan.id || index}
            className="p-6 rounded-2xl shadow-md border transition transform hover:scale-105 hover:shadow-xl"
          >

            {/* Plan Name */}
            <h2 className="text-2xl font-bold text-center mb-4">
              {plan.name}
            </h2>

            {/* Price */}
            <p className="text-4xl font-extrabold text-center mb-6">
              ₹{plan.price}
              <span className="text-lg font-medium"> /month</span>
            </p>

            {/* Features */}
            <ul className="mb-6 space-y-2">
              <li>✔ Basic Access</li>
              <li>✔ Standard Support</li>
              <li>✔ Limited Features</li>
            </ul>

            {/* Button */}
            <button
              className="w-full py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              onClick={() => handleUpdate(plan.id)} // ✅ FIX
            >
              Choose Plan
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default ManageSubscriptions;