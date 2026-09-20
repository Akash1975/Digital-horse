import api from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  const data = response.data;

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  if (data.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// Get currently logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// Change password
export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/change-password", passwordData);

  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

// Check whether user is logged in
export const isAuthenticated = () => {
  return Boolean(localStorage.getItem("token"));
};

// Get stored user
export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch (error) {
    return null;
  }
};
