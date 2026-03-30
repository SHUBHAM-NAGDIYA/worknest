import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createMember } from "../services/api";

function CreateMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "MEMBER",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await createMember(formData);
      alert("Member created successfully");
      navigate("/AdminDashboard");
    } catch (error) {
      alert("Failed to create member");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-4 bg-white shadow-md">
        <h2 className="text-2xl font-bold text-blue-600">WorkNest</h2>

        <Link
          to="/AdminDashboard"
          className="text-gray-700 hover:text-blue-600"
        >
          Back to Dashboard
        </Link>
      </nav>

      {/* Form Section */}
      <div className="flex items-center justify-center py-16 px-4">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Create Member
          </h1>

          {/* Username */}
          <input
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

          {/* First + Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              required
            />
            <input
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          {/* Role */}
          <select name="role" onChange={handleChange} value={formData.role}>
            <option value="MEMBER">Member</option>
           
          </select>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button type="submit" className="w-full">
            Create Member
          </button>

        </form>
      </div>

    </div>
  );
}

export default CreateMember;