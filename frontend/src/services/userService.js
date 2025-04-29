// userService.js

import axios from "axios";

// Base API
const API_URL = "http://localhost:4000/api/users";

// Get user profile
export const fetchUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUserProfile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
};
