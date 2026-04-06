import axios from "axios";

export const API = axios.create({
  baseURL: "https://worknest-elmw.onrender.com",
  withCredentials: true
});

// Auth
export const ownerSignup = async (data) => {
  const response = await API.post("/user/", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("/login/", data);
  return response.data;
};

// Dashboards
export const getOwnerDashboard = async () => {
  const response = await API.get("/owner/dashboard/");
  return response.data;
};

export const getAdminDashboard = async () => {
  const response = await API.get("/ad/profile/");
  return response.data;
};

// Users
export const createAdmin = async (data) => {
  const response = await API.post("/user/", data);
  return response.data;
};


export const createMember = async (data) => {
  const response = await API.post("/user/", data);
  return response.data;
};


// Plans
export const getPlans = async () => {
  const response = await API.get("/pricing/");
  return response.data;
};


export const updateSubscription = async (planId) => {
  const response = await API.post("/updateSubscription/", {
    plan_id: planId
  });
  return response.data;
};


// Team & Project
export const createTeam = async (name) => {
  return API.post("/create_team/", { name });
};


export const getTeams = async () => {
  const response = await API.get("/teams/");
  return response.data;
};


// add member
export const addMemberToTeam = async (username, team_id) => {
  const res = await API.post("/add_team_member/", {
    username,
    team_id
  });
  return res.data;
};

export const createProject = async (data) => {
  return API.post("/create_project/", data);
};

export const getMembers = async () => {
  const response = await API.get("/list-members-view/");
  return response.data;
};


export const getProjects = async () => {
  const response = await API.get("/projects/");
  return response.data;
};


export const assignProject = (data) =>
  API.post("/assign_project/", data);

export const createTask = async (data) => {
  const res = await API.post("/create_task/", data);
  return res.data;
};
