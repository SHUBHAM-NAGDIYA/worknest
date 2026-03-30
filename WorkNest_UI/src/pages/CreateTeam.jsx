import { useState } from "react";
import { createTeam } from "../services/api";

function CreateTeam() {

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      setMessage("Team name is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await createTeam(name);

      setMessage("✅ Team created successfully");
      setName("");

    } catch (err) {
      setMessage("❌ Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <form onSubmit={handleSubmit}>

        <h2 className="text-2xl font-bold text-center mb-4">
          Create Team
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter team name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Team"}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center mt-2 text-sm">
            {message}
          </p>
        )}

      </form>

    </div>
  );
}

export default CreateTeam;