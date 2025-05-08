import axios from "axios";

export const registerUser = async (name, email, password) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios.post(
    "/api/users",
    { name, email, password },
    config
  );
  return data;
};

export const loginUser = async (email, password) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios.post(
    "/api/users/login",
    { email, password },
    config
  );
  return data;
};




