import { useEffect, useState } from "react";
import axios from "axios";


function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] =
    useState([]);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

    const [showModal, setShowModal] = useState(false);

const [projects, setProjects] = useState([]);
const [users, setUsers] = useState([]);

const [successMessage, setSuccessMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");

const [formData, setFormData] = useState({
  title: "",
  description: "",
  project_id: "",
  assigned_to: "",
  priority: "medium",
  status: "todo",
  due_date: "",
});


  const token =
    localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/tasks",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);
      setFilteredTasks(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const fetchFormData = async () => {
  try {
    const res = await axios.get(
      "http://localhost:5000/api/admin/tasks/form-data",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjects(res.data.projects);
    setUsers(res.data.users);

  } catch (err) {
    console.log(err);
  }
};
const handleCreateTask = async () => {
  try {

    await axios.post(
      "http://localhost:5000/api/admin/tasks",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuccessMessage(
      "Task Created Successfully"
    );

    setErrorMessage("");

    setShowModal(false);

    setFormData({
      title: "",
      description: "",
      project_id: "",
      assigned_to: "",
      priority: "medium",
      status: "todo",
      due_date: "",
    });

    fetchTasks();

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

  } catch (err) {

    setErrorMessage(
      "Error while creating task. Please try again later."
    );

    setTimeout(() => {
      setErrorMessage("");
    }, 4000);
  }
};

 useEffect(() => {
  fetchTasks();
  fetchFormData();
}, []);

  useEffect(() => {
    const filtered =
      tasks.filter(
        (task) =>
          task.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          task.project_name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          task.assigned_user
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredTasks(filtered);
  }, [search, tasks]);

  const getPriorityColor = (
    priority
  ) => {
    if (priority === "high")
      return {
        bg: "#fee2e2",
        color: "#dc2626",
      };

    if (priority === "medium")
      return {
        bg: "#fef3c7",
        color: "#d97706",
      };

    return {
      bg: "#dcfce7",
      color: "#15803d",
    };
  };

  const getStatusColor = (
    status
  ) => {
    if (status === "done")
      return {
        bg: "#dcfce7",
        color: "#15803d",
      };

    if (
      status === "in_progress"
    )
      return {
        bg: "#dbeafe",
        color: "#2563eb",
      };

    return {
      bg: "#f1f5f9",
      color: "#64748b",
    };
  };

  return (
  <div
    className="container-fluid"
    style={{
      minHeight: "100vh",
      background: "#f8fafc",
      padding: "30px",
    }}
  >

  <div className="d-flex justify-content-between align-items-center mb-4">

  <div>

    <h1
      className="fw-bold mb-1"
      style={{
        fontSize: "42px",
      }}
    >
      All Tasks
    </h1>

    <p
      className="text-secondary mb-0"
      style={{
        fontSize: "20px",
      }}
    >
      {filteredTasks.length} tasks
    </p>

  </div>

  <button
  className="btn px-4 fw-semibold"
  onClick={() =>
    setShowModal(true)
  }
  style={{
    background: "#2563eb",
    color: "#fff",
    border: "none",
    height: "50px",
    borderRadius: "14px",
  }}
>
  + New Task
</button>

</div>

        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius:
              "24px",
          }}
        >
          <div className="card-body">

            <input
              type="text"
              className="form-control border-0 shadow-sm mb-4"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              style={{
                height: "58px",
                borderRadius:
                  "18px",
              }}
            />

            {loading ? (
              <h4>
                Loading...
              </h4>
            ) : (
            <div
  className="table-responsive"
  style={{
    borderRadius: "20px",
    overflow: "hidden",
  }}
>
  <table
    className="table align-middle mb-0"
    style={{
      background: "#fff",
    }}
  >
    <thead
      style={{
        background: "#f8fafc",
      }}
    >
      <tr>
        <th className="py-4 px-4">Task</th>
        <th className="py-4">Project</th>
        <th className="py-4">Assignee</th>
        <th className="py-4">Priority</th>
        <th className="py-4">Status</th>
        <th className="py-4">Due</th>
      </tr>
    </thead>

    <tbody>

      {filteredTasks.map((task) => (

        <tr key={task.id}>

          <td
            className="px-4"
            style={{
              minWidth: "350px",
            }}
          >
            <div
              className="fw-semibold"
              style={{
                fontSize: "22px",
              }}
            >
              {task.title}
            </div>

            <small
              className="text-secondary"
            >
              {task.description}
            </small>
          </td>

          <td
            style={{
              minWidth: "220px",
            }}
          >
            {task.project_name}
          </td>

          <td
            style={{
              minWidth: "250px",
            }}
          >
            <div className="d-flex align-items-center">

              <img
                src={
                  task.assigned_avatar
                    ? task.assigned_avatar.startsWith(
                        "http"
                      )
                      ? task.assigned_avatar
                      : `http://localhost:5000${task.assigned_avatar}`
                    : `https://ui-avatars.com/api/?name=${task.assigned_user}`
                }
                alt=""
                className="rounded-circle me-3"
                style={{
                  width: "42px",
                  height: "42px",
                  objectFit: "cover",
                }}
              />

              <span>
                {task.assigned_user}
              </span>

            </div>
          </td>

          <td>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  task.priority === "high"
                    ? "#fee2e2"
                    : task.priority === "medium"
                    ? "#fef3c7"
                    : "#e2e8f0",

                color:
                  task.priority === "high"
                    ? "#dc2626"
                    : task.priority === "medium"
                    ? "#d97706"
                    : "#64748b",

                fontSize: "14px",
              }}
            >
              {task.priority}
            </span>

          </td>

          <td>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                background:
                  task.status === "done"
                    ? "#dcfce7"
                    : task.status ===
                      "in_progress"
                    ? "#dbeafe"
                    : task.status ===
                      "review"
                    ? "#fef3c7"
                    : "#f1f5f9",

                color:
                  task.status === "done"
                    ? "#15803d"
                    : task.status ===
                      "in_progress"
                    ? "#2563eb"
                    : task.status ===
                      "review"
                    ? "#d97706"
                    : "#475569",

                fontSize: "14px",
              }}
            >
              {task.status
                .replace("_", " ")
                .toUpperCase()}
            </span>

          </td>

          <td>

            {task.due_date
              ? new Date(
                  task.due_date
                ).toLocaleDateString()
              : "-"}

          </td>

        </tr>

      ))}

    </tbody>

  </table>
</div>
            )}

          </div>
      </div>

{showModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.5)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >

          <div
            className="bg-white p-4"
            style={{
              width: "900px",
              borderRadius: "24px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

            <h3 className="fw-bold mb-4">
              Create Task
            </h3>

            <div className="row">

              <div className="col-md-6 mb-3">
                <label>Task Title</label>

                <input
                  type="text"
                  className="form-control"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-6 mb-3">

                <label>Project</label>

                <select
                  className="form-select"
                  value={formData.project_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      project_id: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select Project
                  </option>

                  {projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.title}
                    </option>
                  ))}

                </select>

              </div>

              <div className="col-12 mb-3">

                <label>Description</label>

                <textarea
                  rows="4"
                  className="form-control"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />

              </div>

              <div className="col-md-6 mb-3">

                <label>Assignee</label>

                <select
                  className="form-select"
                  value={formData.assigned_to}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assigned_to: e.target.value,
                    })
                  }
                >

                  <option value="">
                    Select User
                  </option>

                  {users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.full_name}
                    </option>
                  ))}

                </select>

              </div>

              <div className="col-md-6 mb-3">

                <label>Priority</label>

                <select
                  className="form-select"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value,
                    })
                  }
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                </select>

              </div>

              <div className="col-md-6 mb-3">

                <label>Status</label>

                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="todo">
                    To Do
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="review">
                    Review
                  </option>

                  <option value="done">
                    Done
                  </option>

                </select>

              </div>

              <div className="col-md-6 mb-3">

                <label>Due Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      due_date: e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="d-flex justify-content-end gap-2 mt-4">

              <button
                className="btn btn-secondary"
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleCreateTask}
              >
                Create Task
              </button>

            </div>

          </div>

        </div>

      )}
 
      </div>

  );
}

export default AdminTasks;