import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("OWNER");

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    organization_name: "",
    organization: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {

      let payload = { ...formData, role };

      if (role === "OWNER") {
        delete payload.organization;
      } else {
        delete payload.organization_name;
      }

      await createUser(payload);

      alert("Registration successful");
      navigate("/login");

    } catch (error) {
      alert("Registration failed");
    }
  };

  return (

    <div className="min-h-screen bg-gray-100 flex items-center justify-center">

      <div className="bg-white shadow-lg rounded-xl p-10 w-[520px]">

        <h2 className="text-3xl font-bold text-center mb-6">
          Create Your Account
        </h2>

        {/* Role Selection Cards */}

        <div className="grid grid-cols-3 gap-3 mb-6">

          <button
            type="button"
            onClick={() => setRole("OWNER")}
            className={`border p-3 rounded-lg ${
              role === "OWNER"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            Owner
          </button>

          <button
            type="button"
            onClick={() => setRole("ADMIN")}
            className={`border p-3 rounded-lg ${
              role === "ADMIN"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            Admin
          </button>

          <button
            type="button"
            onClick={() => setRole("MEMBER")}
            className={`border p-3 rounded-lg ${
              role === "MEMBER"
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            Member
          </button>

        </div>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />

          <div className="flex gap-3 mb-3">

            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
            />

            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
            />

          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-3"
            required
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="w-full border p-2 rounded mb-4"
            required
          />

          {/* Dynamic Fields */}

          {role === "OWNER" && (

            <input
              type="text"
              name="organization_name"
              placeholder="Organization Name"
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />

          )}

          {(role === "ADMIN" || role === "MEMBER") && (

            <input
              type="text"
              name="organization"
              placeholder="Organization ID"
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
              required
            />

          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          >
            Register
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;