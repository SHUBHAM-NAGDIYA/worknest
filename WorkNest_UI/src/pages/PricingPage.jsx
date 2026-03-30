import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlans } from "../services/api";

function PricingPage() {

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then(res => {
      console.log(res);
      setPlans(res.data);
    });
  }, []);

  return (
  <div className="min-h-screen bg-gray-50 py-10">
    <h1 className="text-4xl font-extrabold text-center mb-10">
      Pricing Plans
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto">
      
      {plans?.map((plan, index) => (
        <div
          key={plan.id || index}
          className={`p-6 rounded-2xl shadow-md border transition transform hover:scale-105 hover:shadow-xl 
          `}
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

          {/* Features (dummy for now) */}
          <ul className="mb-6 space-y-2">
            <li>✔ All Access</li>
            <li>✔ Standard Support</li>
            <li>✔ Unlimited Features</li>
          </ul>

        </div>
      ))}

    </div>
  </div>
);
}

export default PricingPage;