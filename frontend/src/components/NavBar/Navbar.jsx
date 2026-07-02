console.log("NAVBAR IS RENDERING");
import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import { FiUser, FiLogOut, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import notificationSound from "../../sounds/notification.mp3";

function Navbar() {
  console.log("Navbar Loaded");
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const [search, setSearch] =
  useState("");

const [results, setResults] =
  useState({
    projects: [],
    tasks: [],
  });

const [searchOpen, setSearchOpen] =
  useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     SOUND
  ========================= */
  const playSound = () => {
    const audio = new Audio(notificationSound);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  };
useEffect(() => {
  console.log("SOCKET INIT");

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  return () => {
    socket.off("connect");
  };
}, []);
  /* =========================
     SOCKET CONNECT
  ========================= */
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => socket.off("connect");
  }, []);

  /* =========================
     GET USER
  ========================= */
 /* =========================
   GET USER
========================= */
useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("USER DATA:", data);
    console.log("ROLE =", data.role);

    setUser(data);
  };

  fetchUser();
}, []);

  /* =========================
     GET NOTIFICATIONS (HISTORY)
  ========================= */
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setNotifications(data);
    };

    fetchNotifications();
  }, []);

  /* =========================
     SOCKET REALTIME
  ========================= */
  
useEffect(() => {
  if (!user) return;

  console.log("USER READY:", user);

  socket.emit("join", user.user_id || user.id);

  if (user.role === "admin") {
    console.log("ADMIN DETECTED");

    socket.emit("join_admin", {
      id: user.id,
      role: user.role,
    });
  }

 const handleNotification = () => {
  playSound();
  fetchNotifications(); 
};
  socket.on("notification", handleNotification);
  socket.on("admin_notification", handleNotification);

  socket.onAny((event, data) => {
    console.log("SOCKET EVENT:", event, data);
  });

  return () => {
    socket.off("notification", handleNotification);
    socket.off("admin_notification", handleNotification);
  };
}, [user]);
 

 const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  /* =========================
     MARK AS READ
  ========================= */
 const markAsRead = async (id) => {
  const token = localStorage.getItem("token");

  await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchNotifications();
};
  /* =========================
     DELETE NOTIFICATION
  ========================= */
  const deleteNotification = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleSearch = async (value) => {
  setSearch(value);

  if (!value.trim()) {
    setSearchOpen(false);

    setResults({
      projects: [],
      tasks: [],
    });

    return;
  }

  try {
    const token =
      localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:5000/api/search?q=${value}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await res.json();

    setResults(data);
    setSearchOpen(true);
  } catch (error) {
    console.log(error);
  }
};

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-white border-bottom d-flex justify-content-between align-items-center px-4"
        style={{ height: "65px" }}>

       <div
  style={{
    position: "relative",
    width: "560px",
  }}
>
  <input
    value={search}
    onChange={(e) =>
      handleSearch(e.target.value)
    }
    className="form-control"
    placeholder="Search projects, tasks..."
    style={{
      background: "#f1f5f9",
    }}
  />

  {searchOpen && (
    <div
      className="bg-white shadow"
      style={{
        position: "absolute",
        top: "50px",
        width: "100%",
        borderRadius: "12px",
        zIndex: 9999,
        maxHeight: "350px",
        overflowY: "auto",
      }}
    >
      {results.projects?.map(
        (project) => (
          <div
            key={project.id}
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom:
                "1px solid #eee",
            }}
            onClick={() => {
              navigate(
                `/projects/${project.id}`
              );

              setSearchOpen(false);
              setSearch("");
            }}
          >
            📁 {project.title}
          </div>
        )
      )}

      {results.tasks?.map(
        (task) => (
          <div
            key={task.id}
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom:
                "1px solid #eee",
            }}
          >
            ✅ {task.title}
          </div>
        )
      )}
    </div>
  )}
</div>
        <div className="d-flex align-items-center gap-3">

          {/* NOTIFICATIONS (ONLY FOR NON-ADMIN) */}
{user?.role !== "admin" && (
  <div ref={notifRef} style={{ position: "relative" }}>
    <FiBell size={22} onClick={() => setNotifOpen(!notifOpen)} />

    {unreadCount > 0 && (
      <span style={{
        position: "absolute",
        top: -5,
        right: -5,
        background: "red",
        color: "white",
        fontSize: 10,
        borderRadius: "50%",
        width: 18,
        height: 18,
        textAlign: "center"
      }}>
        {unreadCount}
      </span>
    )}

    {notifOpen && (
      <div className="shadow bg-white"
        style={{
          position: "absolute",
          right: 0,
          top: 40,
          width: 320,
          borderRadius: 10,
          zIndex: 9999
        }}>

        <div className="p-2 border-bottom fw-bold">
          Notifications
        </div>

        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              background: n.is_read ? "#fff" : "#f1f5f9",
              borderBottom: "1px solid #eee"
            }}
          >
            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => markAsRead(n.id)}
            >
              {n.message}
            </div>

            <button
              onClick={() => deleteNotification(n.id)}
              style={{
                border: "none",
                background: "transparent",
                color: "red",
                cursor: "pointer"
              }}
            >
              🗑
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
)}

          {/* PROFILE */}
          <div ref={profileRef} style={{ position: "relative" }}>
  <div
    onClick={() => setProfileOpen(!profileOpen)}
    style={{
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      padding: "6px 10px",
      borderRadius: "12px",
      transition: "0.2s",
      background: profileOpen ? "#f1f5f9" : "transparent",
    }}
    onMouseDown={(e) => e.preventDefault()} // 👈 fix blur bug
  >
    <img
      src={user?.avatar || "https://i.pravatar.cc/150"}
      width="40"
      height="40"
      style={{ borderRadius: "50%" }}
    />

    <div style={{ marginLeft: 10 }}>
      <div style={{ fontWeight: "600" }}>{user?.full_name}</div>
    </div>

    <IoChevronDown />
  </div>

            {/* DROPDOWN */}
            {profileOpen && (
              <div className="shadow bg-white"
                style={{
                  position: "absolute",
                  right: 0,
                  top: 50,
                  width: 180,
                  borderRadius: 10
                }}>

               <div
  className="p-2 border-bottom"
  onClick={() => {
    setProfileOpen(false);
    navigate("/profile");
  }}
  style={{
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }}
>
  <FiUser />
  <span>My Profile</span>
</div>
                <div
                  className="p-2 text-danger"
                  onClick={() => setShowLogoutModal(true)}
                  style={{ cursor: "pointer" }}
                >
                  <FiLogOut /> Log out
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* LOGOUT MODAL */}
      {showLogoutModal && (
        <div className="modal-backdrop d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)"
          }}>

          <div className="bg-white p-4 rounded">
            <h5>Are you sure you want to Log out?</h5>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="btn btn-danger"
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

export default Navbar;