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
    const user = JSON.parse(
  localStorage.getItem("user")
);

  const [
    showLogoutModal,
    setShowLogoutModal,
  ] = useState(false);
  const [adminOpen, setAdminOpen] =
  useState(false);

const [projectsOpen, setProjectsOpen] =
  useState(false);

const [collabOpen, setCollabOpen] =
  useState(false);

const [systemOpen, setSystemOpen] =
  useState(false);

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

     <div
  className="sidebar"
  style={{
    overflowY: "auto",
    height: "100vh",
  }}
>

        <div className="logo">

          <div className="logo-icon">
            📦
          </div>

          <h2>
            ProjectHub
          </h2>

        </div>

      <div className="menu">

  {/* DASHBOARD */}

  <Link
    to={user?.role === "admin" ? "/admin" : "/dashboard"}
    className={
      location.pathname === "/dashboard" ||
      location.pathname === "/admin"
        ? "active"
        : ""
    }
  >
    <MdDashboard />
    Dashboard
  </Link>

  {user?.role === "admin" ? (

    <>

      {/* ADMINISTRATION */}

     <div
  className="menu-section-dropdown"
  onClick={() =>
    setAdminOpen(!adminOpen)
  }
>
  <span>Administration</span>

  <span>
    {adminOpen ? "▼" : "▶"}
  </span>
</div>

{adminOpen && (
  <>
    <Link
      to="/admin/users"
      className={
        location.pathname === "/admin/users"
          ? "active"
          : ""
      }
    >
      <MdPerson />
      Users
    </Link>

    <Link
  to="/admin/project-managers"
  className={
    location.pathname ===
    "/admin/project-managers"
      ? "active"
      : ""
  }
>
  👨‍💼 Project Managers
</Link>
  </>
)}

      {/* PROJECTS */}

     <div
  className="menu-section-dropdown"
  onClick={() =>
    setProjectsOpen(!projectsOpen)
  }
>
  <span>Projects</span>

  <span>
    {projectsOpen ? "▼" : "▶"}
  </span>
</div>

{projectsOpen && (
  <>
    <Link
      to="/admin/projects"
      className={
        location.pathname === "/admin/projects"
          ? "active"
          : ""
      }
    >
      <MdFolder />
      All Projects
    </Link>

    <Link
      to="/admin/tasks"
      className={
        location.pathname === "/admin/tasks"
          ? "active"
          : ""
      }
    >
      <MdTask />
      Tasks
    </Link>
  </>
)}

      {/* COLLABORATION */}

    <div
  className="menu-section-dropdown"
  onClick={() =>
    setCollabOpen(!collabOpen)
  }
>
  <span>Collaboration</span>

  <span>
    {collabOpen ? "▼" : "▶"}
  </span>
</div>

{collabOpen && (
  <>
   <Link
  to="/admin/comments"
  className={
    location.pathname === "/admin/comments"
      ? "active"
      : ""
  }
>
  💬 Comments
</Link>

<Link
  to="/admin/attachments"
  className={
    location.pathname === "/admin/attachments"
      ? "active"
      : ""
  }
>
  📎 Attachments
</Link>

<Link
  to="/admin/notifications"
  className={
    location.pathname === "/admin/notifications"
      ? "active"
      : ""
  }
>
  🔔 Notifications
</Link>
  </>
)}

      {/* SYSTEM */}
<div
  className="menu-section-dropdown"
  onClick={() =>
    setSystemOpen(!systemOpen)
  }
>
  <span>System</span>

  <span>
    {systemOpen ? "▼" : "▶"}
  </span>
</div>

{systemOpen && (
  <>
    <Link
      to="/admin/activity-logs"
      className={
        location.pathname ===
        "/admin/activity-logs"
          ? "active"
          : ""
      }
    >
      📋 Activity Logs
    </Link>
  </>
)}

    </>

  ) : (

    <>

      <Link
        to="/projects"
        className={
          location.pathname === "/projects"
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
          location.pathname === "/tasks"
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
          location.pathname === "/mytasks"
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
          location.pathname === "/profile"
            ? "active"
            : ""
        }
      >
        <MdPerson />
        Profile
      </Link>

    </>

  )}

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