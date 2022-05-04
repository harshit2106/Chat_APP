import React, { useContext, useEffect } from "react";
import Lottie from "react-lottie";
import { Outlet, useNavigate, useParams } from "react-router";
import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AuthContext from "../Contexts/AuthContext";
import GetUserContext from "../Contexts/GetUserContext";
import Loader from "../Utils/Loader";
import animationData from "../animations/ani.json";

const AllUser = () => {
  const navigate = useNavigate();
  const params = useParams();

  const auth = useContext(AuthContext);
  const ctx = useContext(GetUserContext);

  useEffect(() => {
    if (auth.isLoggedIn) {
      ctx.fetchAllUser();
    } else {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [auth.isLoggedIn]);

  const { userid } = params;

  const data = JSON.parse(localStorage.getItem("user"));
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center main-height ">
      <div className="chat-card ">
        <div className="row p-3 ">
          <div className="col-md-3 pl-2 pr-2 h">
            {ctx.isLoading && <Loader />}
            {!ctx.isLoading && (
              <div className="overflow-auto">
                <div className="m-1 d-flex text-dark  align-items-center  user-card">
                  <div className="ml-3">Available Users</div>
                </div>
                {ctx.allUser.length > 0 &&
                  ctx.allUser.map((item, index) => (
                    <NavLink
                      key={item._id}
                      to={`/main/chat/${index}/${data.user._id}/${item._id}`}
                    >
                      <div
                        className={
                          index === Number(params.index)
                            ? "m-1 d-flex text-dark  align-items-center tab-bg user-card"
                            : "m-1 d-flex text-dark  align-items-center user-card"
                        }
                      >
                        <div>
                          <img className="img" src={`${item.pic}`} alt="pic" />
                        </div>
                        <div className="ml-3">{item.name}</div>
                      </div>
                    </NavLink>
                  ))}
              </div>
            )}
          </div>
          <div className="col-md-9 pl-2 pr-2 h">
            {userid === undefined && (
              <div className="welcome d-flex justify-content-center align-items-center ">
                <div>
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={200}
                      width={200}
                      // style={{ marginTop: "1rem", marginLeft: 0 }}
                    />
                  </div>
                  <h3>Let's Have Some Fun With Strangers</h3>
                  <h6 className="text-center">
                    Select the Available Users and Start Socialising
                  </h6>
                </div>
              </div>
            )}

            <Outlet />
          </div>
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
    </div>
  );
};

export default AllUser;
