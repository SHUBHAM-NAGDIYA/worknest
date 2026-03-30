import { useNavigate } from "react-router-dom";
import API from "../services/api";

const handleSubmit = async () => {
  try {
    const response = await API.post("/login", formData);

    localStorage.setItem("token", response.data.token);

  } catch (error) {
    console.log(error.response.data);
  }
};

function Navbar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">

      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        WorkNest
      </h1>

      <div className="space-x-4">

        <button
          onClick={() => navigate("/create-project")}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Create Project
        </button>

        <button
          onClick={() => navigate("/create-task")}
          className="bg-white text-blue-600 px-3 py-1 rounded"
        >
          Create Task
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;