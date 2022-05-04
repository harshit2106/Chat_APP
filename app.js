const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const connectDB = require("./config/database");

//middleware

//my routes

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const globalErrorHandler = require("./middlewares/globalErrorHandler");

connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV !== "production") require("dotenv").config();
//my middleware

// const corsOptions = {
//   origin: "https://www.bloomsandbakers.com",
//   credentials: true,
// };

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
// app.use(cors(corsOptions));

//my routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", chatRoutes);

if (process.env.NODE_ENV === "production") {
  // app.use(express.static("frontend/build"));
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

//error handler

app.use(globalErrorHandler);
const PORT = process.env.PORT || 8000;
const server = app.listen(
  PORT,
  console.log(`server  running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved;

    if (!chat.userid) return console.log("chat.users not defined");

    socket
      .in(chat._id)
      .emit(
        "message recieved",
        newMessageRecieved.message[newMessageRecieved.message.length - 1]
      );
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
