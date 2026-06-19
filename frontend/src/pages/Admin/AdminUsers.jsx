import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [showEditModal, setShowEditModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const [formData, setFormData] =
    useState({
      full_name: "",
      email: "",
      password: "",
      role: "team_member",
      phone: "",
      location: "",
      bio: "",
    });

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.full_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        user.role
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);

    setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
  };

  const createUser = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/users",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowAddModal(false);

      fetchUsers();

      showSuccess(
        "User created successfully"
      );

      setFormData({
        full_name: "",
        email: "",
        password: "",
        role: "team_member",
        phone: "",
        location: "",
        bio: "",
      });

    } catch (err) {
      console.log(err);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${selectedUser.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowEditModal(false);

      fetchUsers();

      showSuccess(
        "User updated successfully"
      );

    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${selectedUser.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowDeleteModal(false);

      fetchUsers();

      showSuccess(
        "User deleted successfully"
      );

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container-fluid p-4">

      {successMessage && (
        <div className="alert alert-success shadow-sm">
          {successMessage}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
<h1
  className="fw-bold mb-1"
  style={{
    fontSize: "36px",
    letterSpacing: "-1px",
  }}
>
  Team Members
</h1>

<p
  className="text-secondary"
  style={{
    fontSize: "17px",
  }}
>
    {filteredUsers.length} members in your organization
  </p>

</div>

        <button
  className="btn fw-semibold px-4"
  style={{
    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    height: "50px",
  }}
  onClick={() =>
    setShowAddModal(true)
  }
>
  + Add User
</button>

      </div>

<div
  className="card border-0 shadow-sm"
  style={{
    borderRadius: "24px",
    background:
      "linear-gradient(145deg,#ffffff,#f8fafc)",
    width: "100%",
    overflow: "hidden",
 }}
>

        <div className="card-body">

          <input
  type="text"
  className="form-control border-0 shadow-sm mb-4"
  placeholder="🔍 Search users..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  style={{
    height: "58px",
    borderRadius: "18px",
    fontSize: "16px",
    background: "#fff",
  }}
/>

          {loading ? (
            <h5>Loading...</h5>
          ) : (
          <div className="row g-4 w-100 m-0">

  {filteredUsers.map((user) => (
   <div
  key={user.id}
  className="col-12 col-lg-6 col-xl-4 mb-4"
  style={{
    minWidth: "430px",
  }}
>
  <div
    className="card border-0 shadow-sm h-100"
   style={{
    width: "100%",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg,#ffffff,#dbeafe)",
  border:
    "1px solid rgba(59,130,246,.15)",
  transition: "all .3s ease",
  cursor: "pointer",
  overflow: "hidden",
}}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform =
        "translateY(-8px) scale(1.02)";
      e.currentTarget.style.boxShadow =
        "0 25px 50px rgba(0,0,0,.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform =
        "translateY(0px) scale(1)";
      e.currentTarget.style.boxShadow =
        "";
    }}
  >
    
    

     

        <div
  className="card-body p-4"
  style={{
    minWidth: "450px",
  }}
>

          <div
  className="
    d-flex
    align-items-center
    mb-4
    flex-wrap
  "
>

            <div className="position-relative">

            <img
  src={
    user.avatar ||
    "https://ui-avatars.com/api/?name=" +
      user.full_name
  }
  alt=""
  className="rounded-circle border border-3 border-white shadow"
  style={{
    width: "95px",
    height: "95px",
    objectFit: "cover",
  }}
/><span
  style={{
    position: "absolute",
    bottom: "5px",
    right: "5px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "3px solid white",
    background:
    user.last_seen
    ? "#22c55e"
    : "#cbd5e1",
  }}
></span>
            </div>

          <div
  className="
    ms-3
    d-flex
    flex-column
    align-items-center
    justify-content-center
    flex-grow-1
  "
>

  <h4
    className="fw-bold mb-2 text-center"
  >
    {user.full_name}
  </h4>

  <span
    className="badge rounded-pill px-4 py-2 fw-semibold"
    style={{
      background:
        user.role === "admin"
          ? "#fee2e2"
          : user.role === "project_manager"
          ? "#dbeafe"
          : "#dcfce7",

      color:
        user.role === "admin"
          ? "#dc2626"
          : user.role === "project_manager"
          ? "#2563eb"
          : "#15803d",

      fontSize: "14px",
      minWidth: "150px",
    }}
  >
    {user.role
      .replace("_", " ")
      .toUpperCase()}
  </span>

</div>

          </div>

          <div className="mb-3 text-secondary">

            📧 {user.email}

          </div>

          <div className="mb-2 text-secondary">

            📱 {user.phone || "No phone"}

          </div>

          <div className="mb-3 text-secondary">

            📍 {user.location || "No location"}

          </div>

         <div
  className="p-3 mb-3"
  style={{
    minHeight: "90px",
    background:
      "linear-gradient(135deg,#f8fafc,#eef2ff)",
    borderRadius: "18px",
  }}
>

            <div className="fw-semibold mb-2">
              Bio
            </div>

            <small className="text-muted">
              {user.bio || "No bio available"}
            </small>

          </div>

          <div className="row g-3 mb-4">

            <div className="col-6">

              <div
  className="text-center p-3"
  style={{
    background:
      "linear-gradient(135deg,#ffffff,#f8fafc)",
    borderRadius: "18px",
    border:
      "1px solid rgba(0,0,0,.05)",
  }}
>

                <h3 className="fw-bold mb-0">
                  {user.id}
                </h3>

                <small className="text-muted">
                  User ID
                </small>

              </div>

            </div>

            <div className="col-6">

              <div
  className="text-center p-3"
  style={{
    background:
      "linear-gradient(135deg,#ffffff,#f8fafc)",
    borderRadius: "18px",
    border:
      "1px solid rgba(0,0,0,.05)",
  }}
>

                <h3 className="fw-bold mb-0">
                  {new Date(
                    user.created_at
                  ).getFullYear()}
                </h3>

                <small className="text-muted">
                  Joined
                </small>

              </div>

            </div>

          </div>

          <div className="d-flex gap-2">

            <button
  className="btn flex-fill fw-semibold"
  style={{
    background:
      "linear-gradient(135deg,#f59e0b,#fbbf24)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
  }}

              onClick={(e) => {

                e.stopPropagation();

                setSelectedUser(user);

                setFormData({
                  full_name:
                    user.full_name,
                  email:
                    user.email,
                  role:
                    user.role,
                  phone:
                    user.phone || "",
                  location:
                    user.location || "",
                  bio:
                    user.bio || "",
                });

                setShowEditModal(true);

              }}
            >
              Edit
            </button>

           <button
  className="btn flex-fill fw-semibold"
  style={{
    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
  }}
              onClick={(e) => {

                e.stopPropagation();

                setSelectedUser(user);

                setShowDeleteModal(true);

              }}
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>

  ))}

</div>
          )}

        </div>

      </div>

      {/* ADD USER */}

     {/* ADD USER */}

{showAddModal && (
  <>
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(15,23,42,.65)",
        backdropFilter: "blur(8px)",
        zIndex: 1050,
      }}
      onClick={() => setShowAddModal(false)}
    />

    <div
      className="position-fixed top-50 start-50 translate-middle"
      style={{
        zIndex: 1060,
        width: "92%",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          borderRadius: "24px",
        }}
      >
        {/* HEADER */}

        <div
          className="text-center border-bottom"
          style={{
            background: "#fff",
            padding: "32px",
          }}
        >
          <div
            className="mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "#fff",
              fontSize: "34px",
              fontWeight: "700",
            }}
          >
            +
          </div>

          <h3
            className="fw-bold mb-1"
            style={{
              color: "#111827",
            }}
          >
            Add New Team Member
          </h3>

          <p
            className="mb-0"
            style={{
              color: "#6b7280",
            }}
          >
            Create a new account and assign permissions
          </p>
        </div>

        {/* BODY */}

        <div
          className="p-4"
          style={{
            background: "#fff",
          }}
        >
          <div className="row g-3">

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="John Doe"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                className="form-control shadow-sm"
                placeholder="john@email.com"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                className="form-control shadow-sm"
                placeholder="********"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Role
              </label>

              <select
                className="form-select shadow-sm"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              >
                <option value="team_member">
                  Team Member
                </option>

                <option value="project_manager">
                  Project Manager
                </option>

                <option value="admin">
                  Admin
                </option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Phone
              </label>

              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="+383..."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Location
              </label>

              <input
                type="text"
                className="form-control shadow-sm"
                placeholder="Kosovo"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-12">
              <label className="fw-semibold mb-2">
                Profile Photo
              </label>

              <input
                type="file"
                className="form-control shadow-sm"
                accept="image/*"
                style={{
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-12">
              <label className="fw-semibold mb-2">
                Bio
              </label>

              <textarea
                rows="4"
                className="form-control shadow-sm"
                placeholder="Write a short bio..."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                style={{
                  borderRadius: "14px",
                  resize: "none",
                }}
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div
          className="d-flex justify-content-end gap-3 p-4 border-top"
        >
          <button
            className="btn btn-light px-4"
            onClick={() =>
              setShowAddModal(false)
            }
          >
            Cancel
          </button>

          <button
            className="btn px-4 fw-semibold"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
            }}
            onClick={createUser}
          >
            Create User
          </button>
        </div>
      </div>
    </div>
  </>
)}

     {/* EDIT USER */}

{showEditModal && (
  <>
    <div
      className="position-fixed top-0 start-0 w-100 h-100"
      style={{
        background: "rgba(15,23,42,.65)",
        backdropFilter: "blur(8px)",
        zIndex: 1050,
      }}
      onClick={() => setShowEditModal(false)}
    />

    <div
  className="position-fixed top-50 start-50 translate-middle"
  style={{
    zIndex: 1060,
    width: "92%",
    maxWidth: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
  }}
>
      <div
        className="card border-0 shadow-lg overflow-hidden"
        style={{
          borderRadius: "24px",
          background: "#fff",
        }}
      >
        {/* HEADER */}

       <div
  className="text-center border-bottom"
  style={{
    padding: "32px",
    background: "#ffffff",
  }}
>
          <img
            src={
              selectedUser?.avatar ||
              `https://ui-avatars.com/api/?name=${selectedUser?.full_name}&background=random`
            }
            alt=""
            className="rounded-circle border border-4 border-white shadow"
            style={{
              width: "72px",
              height: "72px",
              objectFit: "cover",
            }}
          />

          <h3
  className="fw-bold mt-3 mb-1"
  style={{
    color: "#111827",
  }}
>
  Edit Team Member
</h3>

<p
  className="mb-0"
  style={{
    color: "#6b7280",
    fontSize: "14px",
  }}
>
  Manage profile information and permissions
</p>
        </div>

        {/* BODY */}

        <div
          className="p-4"
          style={{
            background: "#ffffff"
          }}
        >
          <div className="row g-3">

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Full Name
              </label>

              <input
                type="text"
                className="form-control border-0 shadow-sm"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    full_name: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Email
              </label>

              <input
                type="email"
                className="form-control border-0 shadow-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Role
              </label>

              <select
                className="form-select border-0 shadow-sm"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              >
                <option value="admin">
                  Admin
                </option>

                <option value="project_manager">
                  Project Manager
                </option>

                <option value="team_member">
                  Team Member
                </option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="fw-semibold mb-2">
                Phone
              </label>

              <input
                type="text"
                className="form-control border-0 shadow-sm"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-12">
              <label className="fw-semibold mb-2">
                Location
              </label>

              <input
                type="text"
                className="form-control border-0 shadow-sm"
                value={formData.location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    location: e.target.value,
                  })
                }
                style={{
                  height: "52px",
                  borderRadius: "14px",
                }}
              />
            </div>

            <div className="col-12">
              <label className="fw-semibold mb-2">
                Bio
              </label>

              <textarea
                rows="4"
                className="form-control border-0 shadow-sm"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bio: e.target.value,
                  })
                }
                style={{
                  borderRadius: "14px",
                  resize: "none",
                }}
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div
          className="d-flex justify-content-end gap-2 p-4"
          style={{
            background: "#fff",
          }}
        >
          <button
            className="btn px-4"
            style={{
              borderRadius: "12px",
              height: "46px",
              background: "#e5e7eb",
            }}
            onClick={() =>
              setShowEditModal(false)
            }
          >
            Cancel
          </button>

          <button
            className="btn px-4 fw-semibold"
            style={{
              borderRadius: "12px",
              height: "46px",
              color: "#fff",
              border: "none",
              background:
                "linear-gradient(135deg,#10b981,#22c55e)",
            }}
            onClick={updateUser}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </>
)}

    

      {/* DELETE MODAL */}

      {showDeleteModal && (
        <div className="modal d-block">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Delete User</h5>
              </div>

              <div className="modal-body">
                Are you sure you want to
                delete this user?
              </div>

              <div className="modal-footer">

                <button
                  className="btn btn-secondary"
                  onClick={() =>
                    setShowDeleteModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="btn btn-danger"
                  onClick={deleteUser}
                >
                  Delete
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminUsers;