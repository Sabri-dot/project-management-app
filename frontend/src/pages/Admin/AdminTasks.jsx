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

  useEffect(() => {
    fetchTasks();
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

      </div>
    
  );
}

export default AdminTasks;