import axios from "axios";
import React, { useState } from "react";

import { toast } from "react-toastify";

const GetUserContext = React.createContext();

export const GetUserProvider = (prop) => {
  const [allUser, setAllUser] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const fetchAllUser = async () => {
    try {
      setisLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.get("/api/v1/alluser", config);
      setAllUser(data.user);
      console.log("call all user");
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
    <GetUserContext.Provider value={{ isLoading, allUser, fetchAllUser }}>
      {prop.children}
    </GetUserContext.Provider>
  );
};

export default GetUserContext;
