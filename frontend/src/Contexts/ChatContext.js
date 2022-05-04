import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useParams } from "react-router";
// import animationData from "../animations/typing.json";

const ChatContext = React.createContext();
let socket;

export const ChatContextProvider = (props) => {
  const [messagee, setMessage] = useState("");
  const [getchat, setgetChat] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState([]);
  //   const [socketConnected, setSocketConnected] = useState(false);
  //   const [typing, setTyping] = useState(false);
  //   const [istyping, setIsTyping] = useState(false);

  const [error, setError] = useState("");
  const [hide, setHide] = useState(false);
  const params = useParams();
  const { userid, senderid } = params;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendChat = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", getchat._id);
    // scrollToBottom();

    let today = new Date();
    let hours = today.getHours();
    let minute = today.getMinutes();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minute < 10) {
      minute = `0${minute}`;
    }

    let timeString = `${hours}:${minute}`;
    setIsButtonLoading(true);
    setError("");

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const message = {
      senderid: userid,
      content: messagee,
      time: timeString,
    };

    const { data } = await axios.post(
      "/api/v1/createchat",
      { message, userid, senderid },
      config
    );
    setChatMessage([...chatMessage, data.message]);
    socket.emit("new message", data.chat);
    setIsButtonLoading(false);
    setMessage("");
    setHide(!hide);
  };

  const updateChat = async (e) => {
    // scrollToBottom();
    setIsButtonLoading(true);
    socket.emit("stop typing", getchat._id);
    let today = new Date();
    let hours = today.getHours();
    let minute = today.getMinutes();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minute < 10) {
      minute = `0${minute}`;
    }

    let timeString = `${hours}:${minute}`;

    e.preventDefault();
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const message = {
      senderid: userid,
      content: messagee,
      time: timeString,
    };

    const { data } = await axios.put(
      `/api/v1/chat/${getchat._id}`,
      { message },
      config
    );
    setChatMessage([...chatMessage, data.message]);
    socket.emit("new message", data.chat);
    setIsButtonLoading(false);
    setMessage("");
  };

  const fetchChat = async () => {
    setIsLoading(true);
    setError("");
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.get(
      `/api/v1/getchat/${userid}/${senderid}`,
      config
    );
    setIsLoading(false);

    if (!data.message) {
      setError("Start Chatting");
      setIsLoading(false);
    }
    setgetChat(data);
    setChatMessage([...data.message]);

    socket.emit("join chat", data._id);
    scrollToBottom();
  };

  return (
    <ChatContext.Provider
      value={{
        messagee,
        error,
        // istyping,
        getchat,
        isLoading,
        chatMessage,
        // typing,
        isButtonLoading,
        sendChat,
        updateChat,
        fetchChat,
        hide,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatContext;
