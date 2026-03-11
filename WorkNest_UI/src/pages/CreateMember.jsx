import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMember } from "../services/api";

function CreateMember() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: ""
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMember(formData);
      alert("Member created successfully");
      navigate("/admin-dashboard");
    } catch (error) {
      alert("Failed to create member");
    }
  };

  return (
    <div>
      <h1>Create Member</h1>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input name="first_name" placeholder="First Name" onChange={handleChange} />
        <input name="last_name" placeholder="Last Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} />
        <button type="submit">Create Member</button>
      </form>
    </div>
  );
}

export default CreateMember;