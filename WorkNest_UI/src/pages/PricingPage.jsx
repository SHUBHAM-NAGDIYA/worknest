import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPlans } from "../services/api";

function PricingPage() {

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    getPlans().then(res => {
      setPlans(res.data);
    });
  }, []);

  return (
    <div>

      <h1>Pricing Plans</h1>

      <div>

        {plans.map(plan => (
          <div key={plan.id}>

            <h2>{plan.name}</h2>

            <p>Price: ${plan.price}</p>

            <p>Max Users: {plan.max_users}</p>

            <p>Max Projects: {plan.max_projects}</p>

            <p>Max Teams: {plan.max_teams}</p>

            <p>{plan.features}</p>

            <Link to={`/register?plan=${plan.id}`}>
              <button>Select Plan</button>
            </Link>

          </div>
        ))}

      </div>

    </div>
  );
}

export default PricingPage;