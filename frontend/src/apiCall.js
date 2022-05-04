import axios from "axios";
import { Navigate } from "react-router";
import { toast } from "react-toastify";

export const fetchChat = async (userid, senderid) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { data } = await axios.get(
    `/api/v1/getchat/${userid}/${senderid}`,
    config
  );
  return data;
};

export const sendChat = async (e, senderid, messagee, userid) => {
  e.preventDefault();
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const message = {
    senderid,
    content: messagee,
  };

  const { data } = await axios.post(
    "/api/v1/createchat",
    { message, userid, senderid },
    config
  );
  return data;
};

export const updateChat = async (e, senderid, chatid, messagee) => {
  e.preventDefault();
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const message = {
    senderid,
    content: messagee,
  };

  const { data } = await axios.put(
    `/api/v1/chat/${chatid}`,
    { message },
    config
  );

  return data;
};

export const register = async (name, email, password) => {
  try {
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
    localStorage.setItem("user", JSON.stringify(data));
    Navigate("/main");
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
  }
};

export const logout = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  await axios.get("/api/v1/signout", config);
  localStorage.removeItem("user");
  Navigate("/");
};
