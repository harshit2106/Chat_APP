import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie";
import { useParams } from "react-router";
import io from "socket.io-client";
import Loader from "../Utils/Loader";
import animationData from "../animations/typing.json";
import { toast } from "react-toastify";

const ENDPOINT = "https://random-chhaatt.herokuapp.com/"; // "https://talk-a-tive.herokuapp.com"; -> After deployment
let socket;
const Chat = () => {
  const [messagee, setMessage] = useState("");
  const [getchat, setgetChat] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [chatMessage, setChatMessage] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  const [error, setError] = useState("");
  const [hide, setHide] = useState(false);
  const params = useParams();
  const { userid, senderid } = params;
  const data = JSON.parse(localStorage.getItem("user"));

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendChat = async (e) => {
    e.preventDefault();
    try {
      socket.emit("stop typing", getchat._id);
      scrollToBottom();

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
    } catch (err) {
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
      setIsButtonLoading(false);
    }
  };

  const updateChat = async (e) => {
    e.preventDefault();
    try {
      scrollToBottom();
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
    } catch (err) {
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
      setIsButtonLoading(false);
    }
  };

  const fetchChat = async () => {
    try {
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
    } catch (err) {
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", data.user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchChat(userid, senderid);
    // selectedChatCompare = selectedCha;
    // eslint-disable-next-line
  }, [senderid, hide]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setChatMessage([...chatMessage, newMessageRecieved]);
    });
  });

  const typingHandler = (e) => {
    setMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);

      socket.emit("typing", getchat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 4000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", getchat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div className="col-md-12 pl-2 pr-2 h">
      <div className="d-flex flex-column chat m-1  overflow-auto">
        {isLoading && <Loader />}
        {error.length > 2 && (
          <div className="welcome d-flex justify-content-around align-items-center ">
            <div>
              <h3>{error}</h3>
            </div>
          </div>
        )}
        {!isLoading &&
          error.length === 0 &&
          Object.keys(getchat).length > 0 &&
          chatMessage.map((item, i) => (
            <div
              className={
                String(item.senderid) === String(userid)
                  ? "    ml-5   my-1"
                  : "   mr-5  my-1"
              }
              key={i}
            >
              <div
                className={
                  String(item.senderid) === String(userid)
                    ? " text-right  ml-auto capsule blue "
                    : " text-left  mr-auto capsule grey "
                }
              >
                {item.content}
                <sub className="time-txt ml-2 mt-2">{item.time}</sub>
              </div>
            </div>
          ))}
        {istyping && (
          <div className="text-left mt-auto align-self-start">
            <Lottie
              options={defaultOptions}
              // height={50}
              width={70}
              style={{ marginBottom: "-1rem" }}
            />
          </div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="input d-flex  justify-content-center flex-column">
        <div>
          <form className=" row row-margin p-2">
            <div className="form-group col-md-10 pl-2  pr-2 mt-3">
              <input
                type="text"
                className="form-control"
                id="message"
                placeholder="Send Message..."
                value={messagee}
                onChange={typingHandler}
              />
            </div>
            <div className="col-md-2 pl-2 pr-2 mt-3 text-center ">
              {getchat && getchat._id && !isButtonLoading && (
                <button
                  onClick={updateChat}
                  type="submit"
                  className="btn btn-primary btn-md "
                >
                  update
                </button>
              )}

              {getchat && !getchat._id && !isButtonLoading && (
                <button
                  onClick={sendChat}
                  type="submit"
                  className="btn btn-primary btn-md "
                >
                  first
                </button>
              )}
              {isButtonLoading && (
                <button type="submit" className="btn btn-primary btn-md ">
                  <div className="spinner-border text-light" role="status">
                    <span className="sr-only"></span>
                  </div>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
