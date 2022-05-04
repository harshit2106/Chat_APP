import React, { useContext } from "react";

import AuthContext from "../Contexts/AuthContext";

const Header = () => {
  const ctx = useContext(AuthContext);

  const data = JSON.parse(localStorage.getItem("user"));
  return (
    <nav className="navbar  navbar-light text-center m-0 bg-new">
      <span className="navbar-brand mb-0 h1">Messenger</span>
      {data !== null && (
        <button
          onClick={ctx.logout}
          type="button"
          className="btn text-white btn-sm bg-primary"
        >
          Logout
        </button>
      )}
    </nav>
  );
};

export default Header;
