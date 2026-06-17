import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  MdDashboard,
  MdFolder,
  MdTask,
  MdPerson,
  MdLogout,
} from "react-icons/md";

import "./Sidebar.css";

function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate("/");

    };

  return (

    <>

      <div className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            📦
          </div>

          <h2>
            ProjectHub
          </h2>

        </div>

        <div className="menu">

          <Link
            to="/dashboard"
            className={
              location.pathname ===
              "/dashboard"
                ? "active"
                : ""
            }
          >
            <MdDashboard />
            Dashboard
          </Link>

          <Link
            to="/projects"
            className={
              location.pathname ===
              "/projects"
                ? "active"
                : ""
            }
          >
            <MdFolder />
            All Projects
          </Link>

          <Link
            to="/tasks"
            className={
              location.pathname ===
              "/tasks"
                ? "active"
                : ""
            }
          >
            <MdTask />
            All Tasks
          </Link>

          <Link
            to="/mytasks"
            className={
              location.pathname ===
              "/mytasks"
                ? "active"
                : ""
            }
          >
            <MdTask />
            My Tasks
          </Link>

          <Link
            to="/profile"
            className={
              location.pathname ===
              "/profile"
                ? "active"
                : ""
            }
          >
            <MdPerson />
            Profile
          </Link>

        </div>

        <button
          className="logout-btn"
          onClick={() =>
            setShowLogoutModal(
              true
            )
          }
        >
          <MdLogout />
          Log out
        </button>

      </div>

      {showLogoutModal && (

        <div
          className="
            position-fixed
            top-0
            start-0
            w-100
            h-100
            d-flex
            justify-content-center
            align-items-center
          "
          style={{
            background:
              "rgba(0,0,0,.45)",
            backdropFilter:
              "blur(5px)",
            zIndex: 999999,
          }}
        >

          <div
            className="
              bg-white
              shadow-lg
              p-4
            "
            style={{
              width: "420px",
              borderRadius:
                "22px",
            }}
          >

            <div className="text-center">

              <div
                style={{
                  fontSize:
                    "60px",
                }}
              >
                🚪
              </div>

              <h3 className="fw-bold mt-3">
                Logout
              </h3>

              <p className="text-muted mb-4">
                Are you sure you want
                to log out?
              </p>

            </div>

            <div className="d-flex gap-2">

              <button
                className="
                  btn
                  btn-light
                  border
                  flex-fill
                "
                onClick={() =>
                  setShowLogoutModal(
                    false
                  )
                }
              >
                Cancel
              </button>

              <button
                className="
                  btn
                  btn-danger
                  flex-fill
                "
                onClick={
                  handleLogout
                }
              >
                Log out
              </button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}

export default Sidebar;