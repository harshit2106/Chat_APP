import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../Contexts/AuthContext";

const Login = () => {
  const ctx = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggle, setToggle] = useState(true);
  const [check, setCheck] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (ctx.isLoggedIn) navigate("/main");
  }, [ctx.isLoggedIn, navigate]);

  const registerHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password did not match: Please try again...", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!check) {
      toast.error("Agree Terms and Conditions to Continue", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      ctx.register(name, email, password);
    }
  };

  const loginHandler = (e) => {
    e.preventDefault();
    if (!check) {
      alert.error("Agree Terms and Conditions to Continue");
    } else {
      ctx.login(email, password);
    }
  };

  return (
    <>
      <div className="container-fluid hi  d-flex justify-content-center align-items-center  ">
        <div className="form-card p-3">
          {!toggle && (
            <h4 className="color heading text-center mb-3">Register</h4>
          )}
          {toggle && (
            <h4 className="color heading text-center mb-3">Sign In</h4>
          )}

          <form className=" color">
            {!toggle && (
              <div className="form-group">
                <input
                  className="form-control bg-transparent"
                  id="name"
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <input
                className="form-control bg-transparent"
                id="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <input
                className="form-control bg-transparent"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {toggle && <p className="text-right color">Forgot Password?</p>}

            {!toggle && (
              <>
                <div className="form-group">
                  <input
                    className="form-control bg-transparent"
                    id="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3">
                  <div className=" d-flex">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        id="formBasicCheckbo"
                        checked={check}
                        type="checkbox"
                        onChange={() => setCheck(!check)}
                        required
                      />
                    </div>
                    <div>I agree to the Terms and Conditions</div>
                  </div>
                </div>
                {ctx.isLoading && (
                  <button
                    className="button text-center"
                    type="submit"
                    //   onClick={registerHandler}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </button>
                )}
                {!ctx.isLoading && (
                  <button
                    className="button text-center"
                    type="submit"
                    onClick={registerHandler}
                  >
                    Register
                  </button>
                )}
              </>
            )}
            {toggle && (
              <>
                <div className=" form-group mb-3">
                  <div className="d-flex">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        id="formBasicChecko"
                        type="checkbox"
                        checked={check}
                        onChange={() => setCheck(!check)}
                      />{" "}
                    </div>
                    <div>I agree to the Terms and Conditions</div>
                  </div>
                </div>
                {ctx.isLoading && (
                  <button
                    className="button text-center"
                    type="submit"
                    // onClick={loginHandler}
                  >
                    <div className="spinner-border text-light" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </button>
                )}
                {!ctx.isLoading && (
                  <button
                    className="button text-center"
                    type="submit"
                    onClick={loginHandler}
                  >
                    Sign In
                  </button>
                )}
              </>
            )}
          </form>
          {!toggle && (
            <div className="row mt-2">
              <div className="col">
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => setToggle(!toggle)}
                    className="remove-btn-style color"
                  >
                    Sign In Here
                  </button>
                </p>
              </div>
            </div>
          )}
          {toggle && (
            <div className="row mt-2">
              <div className="col">
                <p>
                  Don't have an account?{" "}
                  <button
                    onClick={() => setToggle(!toggle)}
                    className=" remove-btn-style color"
                  >
                    Register Here
                  </button>
                </p>
              </div>
            </div>
          )}
          <ToastContainer
            position="bottom-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    </>
  );
};

export default Login;
