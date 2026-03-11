import { useEffect, useState } from "react";
import { getPlans, updateSubscription } from "../services/api";

function ManageSubscription() {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    getPlans().then(res => setPlans(res.data));
  }, []);

  const handleUpdate = async () => {
    try {
      await updateSubscription(selectedPlan);
      alert("Subscription updated successfully");
    } catch (err) {
      alert("Failed to update subscription");
    }
  };

  return (
    <div>
      <h1>Manage Subscription</h1>

      <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}>
        <option value="">Select Plan</option>
        {plans.map(plan => (
          <option key={plan.id} value={plan.id}>
            {plan.name} - ${plan.price}
          </option>
        ))}
      </select>

      <button onClick={handleUpdate}>Update Subscription</button>
    </div>
  );
}

export default ManageSubscription;