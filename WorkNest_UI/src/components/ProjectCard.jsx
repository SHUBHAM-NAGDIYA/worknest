import API from "../services/api";

const handleSubmit = async () => {
  try {
    const response = await API.post("/login", formData);

    localStorage.setItem("token", response.data.token);

  } catch (error) {
    console.log(error.response.data);
  }
};