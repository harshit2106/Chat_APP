import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const AuthContext = React.createContext();

export const AuthContextProvider = (prop) => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  let isLoggedIn;

  const data = JSON.parse(localStorage.getItem("user"));

  if (data === null) {
    isLoggedIn = false;
  } else {
    isLoggedIn = true;
  }

  const register = async (name, email, password) => {
    try {
      setisLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/signup",
        { name, email, password },
        config
      );
      console.log(data);
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/main");

      setisLoading(false);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setisLoading(false);
    }
  };

  const logout = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await axios.get("/api/v1/signout", config);
    localStorage.removeItem("user");

    navigate("/");
  };

  const login = async (email, password) => {
    try {
      setisLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/signin",
        { email, password },
        config
      );
      localStorage.setItem("user", JSON.stringify(data));

      navigate("/main");

      setisLoading(false);
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      toast.error(message, {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setisLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isLoading, register, login, logout }}
    >
      {prop.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
