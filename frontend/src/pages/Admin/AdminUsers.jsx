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

  const token =
    localStorage.getItem("token");

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
      console.error(err);
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

  const deleteUser = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this user?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/admin/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  return (
    <div className="container-fluid p-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          Users Management
        </h2>

        <button
          className="btn btn-primary"
        >
          + Add User
        </button>
      </div>

      <div className="card shadow-sm">

        <div className="card-body">

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {loading ? (

            <div className="text-center py-5">
              Loading...
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredUsers.map(
                    (user) => (
                      <tr key={user.id}>

                        <td>
                          {user.id}
                        </td>

                        <td>
                          {user.full_name}
                        </td>

                        <td>
                          {user.email}
                        </td>

                        <td>
                          {user.role}
                        </td>

                        <td>
                          {new Date(
                            user.created_at
                          ).toLocaleDateString()}
                        </td>

                        <td>

                          <button
                            className="
                              btn
                              btn-warning
                              btn-sm
                              me-2
                            "
                          >
                            Edit
                          </button>

                          <button
                            className="
                              btn
                              btn-danger
                              btn-sm
                            "
                            onClick={() =>
                              deleteUser(
                                user.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default AdminUsers;