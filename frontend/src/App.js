import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AllUser from "./Components/AllUser";
import Header from "./Components/Header";
import { AuthContextProvider } from "./Contexts/AuthContext";
import { ChatContextProvider } from "./Contexts/ChatContext";
import { GetUserProvider } from "./Contexts/GetUserContext";
import Chat from "./Pages/Chat";
import Login from "./Pages/Login";

const App = () => {
  return (
    <Router>
      <AuthContextProvider>
        <GetUserProvider>
          <ChatContextProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Login />} />

              <Route path="/main" element={<AllUser />}>
                <Route
                  path="/chat/:index/:userid/:senderid"
                  element={<Chat />}
                />
              </Route>
            </Routes>
          </ChatContextProvider>
        </GetUserProvider>
      </AuthContextProvider>
    </Router>
  );
};

export default App;
