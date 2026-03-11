fetch(`${process.env.REACT_APP_API_URL}/api/data`)   //deployment

import axios from "axios";
export const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true
});

export const ownerSignup = async (data) => {
  const response = await API.post("/user/", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("/login/", data);
  return response.data;
};

export const getOwnerDashboard = async (data) => {
  const response = await API.post("/owner/profile/", data);
  return response.data;
};

export const createAdmin = async (data) => {
  const response = await API.post("/user/", data);
  return response.data;
};

export const getAdminDashboard  = async (data) => {
  const response = await API.post("/admin/profile/", data);
  return response.data;
};
// services/api.js
/*

import API from "./api"; // import the axios instance

// Public Pages
export const getPlans = () => API.get("/subscription-plans/").then(res => res.data);
export const createUser = (data) => API.post("/user/", data).then(res => res.data);
export const loginUser = (data) => API.post("/login/", data).then(res => res.data);

// Owner APIs
export const getOwnerDashboard = () => API.get("/owner/dashboard/").then(res => res.data);
export const createAdmin = (data) => API.post("/owner/create-admin/", data).then(res => res.data);
export const updateSubscription = (planId) =>
  API.patch("/owner/manage-subscription/", { plan_id: planId }).then(res => res.data);
export const getUsage = () => API.get("/owner/usage/").then(res => res.data);

// Admin APIs
export const getAdminDashboard = () => API.get("/admin/dashboard/").then(res => res.data);
export const createMember = (data) => API.post("/admin/create-member/", data).then(res => res.data);
export const createTeam = (data) => API.post("/admin/create-team/", data).then(res => res.data);
export const assignMembersToTeam = (teamId, memberIds) =>
  API.post("/admin/add-members-to-team/", { team_id: teamId, members: memberIds }).then(res => res.data);
export const getTeamsAndMembers = () => API.get("/admin/teams-members/").then(res => res.data);

// Project / Work Management APIs
export const createProject = (data) => API.post("/projects/", data).then(res => res.data);
export const getProjects = () => API.get("/projects/").then(res => res.data);
export const getProjectMembers = (projectId) =>
  API.get(`/projects/${projectId}/members/`).then(res => res.data);
export const getTasksByProject = (projectId) =>
  API.get(`/projects/${projectId}/tasks/`).then(res => res.data);
export const createTask = (projectId, data) =>
  API.post(`/projects/${projectId}/tasks/`, data).then(res => res.data);
export const updateTaskStatus = (taskId, status) =>
  API.patch(`/tasks/${taskId}/`, { status }).then(res => res.data);
export const deleteTask = (taskId) => API.delete(`/tasks/${taskId}/`).then(res => res.data);

*/