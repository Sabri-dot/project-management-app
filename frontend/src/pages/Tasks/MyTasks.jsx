import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

function MyTasks() {

  const [tasks, setTasks] =
    useState([]);

  const [showManagerModal,
    setShowManagerModal] =
    useState(false);

  const [selectedManager,
    setSelectedManager] =
    useState(null);

  const fetchTasks = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "http://localhost:5000/api/tasks/mytasks",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setTasks(data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const priorityBadge =
    (priority) => {

      switch (priority) {

        case "high":
          return "bg-danger-subtle text-danger";

        case "medium":
          return "bg-warning-subtle text-warning";

        default:
          return "bg-secondary-subtle text-secondary";
      }

    };

  const statusBadge =
    (status) => {

      switch (status) {

        case "in_progress":
          return "bg-primary-subtle text-primary";

        case "done":
          return "bg-success-subtle text-success";

        default:
          return "bg-secondary-subtle text-secondary";
      }

    };

  return (

    <MainLayout>

      <div
  className="py-4 mx-auto"
  style={{
    maxWidth: "1450px",
  }}
>

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h1 className="fw-bold mb-1">
              My Tasks
            </h1>

           <p className="text-muted fs-5 mb-0 ms-5">
  {tasks.length} tasks
</p>

          </div>

          <div className="btn-group me-5">

  <button className="btn btn-light border">
    ☰
  </button>

  <button className="btn btn-light border">
    ⊞
  </button>

</div>

        </div>

       <div
  className="card border-0 shadow"
  style={{
    borderRadius: "24px",
  }}
>

          <div className="table-responsive">

            <table className="table align-middle mb-0">

             <thead
  style={{
    background: "#F8FAFC",
  }}
>
  <tr>

    <th
      className="ps-4 py-3"
      style={{
        minWidth: "320px",
      }}
    >
      Task
    </th>

    <th
      style={{
        minWidth: "230px",
      }}
    >
      Project
    </th>

    <th
      style={{
        minWidth: "140px",
      }}
    >
      Manager
    </th>

    <th
      style={{
        minWidth: "150px",
      }}
    >
      Priority
    </th>

    <th
      style={{
        minWidth: "150px",
      }}
    >
      Status
    </th>

    <th
      style={{
        minWidth: "150px",
      }}
    >
      Due Date
    </th>

  </tr>
</thead>

              <tbody>

                {tasks.map((task) => (

                  <tr key={task.id}>

                    <td className="ps-4 py-4 fw-medium">
                      {task.title}
                    </td>

                    <td className="text-secondary">
                      {task.project_name}
                    </td>

                    <td>

                      <img
                        src={
                          task.manager_avatar ||
                          "https://i.pravatar.cc/150"
                        }
                        alt=""
                        width="40"
                        height="40"
                        className="rounded-circle shadow-sm"
                        style={{
                          cursor:
                            "pointer",
                          objectFit:
                            "cover",
                        }}
                        onClick={() => {

                          setSelectedManager(
                            task
                          );

                          setShowManagerModal(
                            true
                          );

                        }}
                      />

                    </td>

                    <td>

                      <span
                        className={`badge rounded-pill px-3 py-2 ${priorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>

                    </td>

                    <td>

                      <span
                        className={`badge rounded-pill px-3 py-2 ${statusBadge(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>

                    </td>

                    <td className="text-secondary fw-semibold">
  {task.due_date
    ? `Deadline: ${new Date(
        task.due_date
      ).toLocaleDateString("en-GB")}`
    : "-"}
</td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {showManagerModal &&
        selectedManager && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(0,0,0,0.55)",
            zIndex: 999999,
          }}
        >

          <div
            className="bg-white p-5 shadow-lg"
            style={{
              width: "450px",
              borderRadius: "25px",
            }}
          >

            <div className="text-center">

              <img
                src={
                  selectedManager.manager_avatar ||
                  "https://i.pravatar.cc/150"
                }
                alt=""
                width="110"
                height="110"
                className="rounded-circle shadow mb-3"
              />

              <h3 className="fw-bold">
                {
                  selectedManager.manager_name
                }
              </h3>

              <p className="text-muted">
                Project Manager
              </p>

            </div>

            <hr />

            <div className="mb-3">

              <small className="text-muted">
                Email
              </small>

              <div className="fw-semibold">
                {
                  selectedManager.manager_email
                }
              </div>

            </div>

            <div>

              <small className="text-muted">
                Bio
              </small>

              <div className="fw-semibold">
                {
                  selectedManager.manager_bio ||
                  "No bio available"
                }
              </div>

            </div>

            <button
              className="btn btn-dark w-100 mt-4"
              onClick={() =>
                setShowManagerModal(
                  false
                )
              }
            >
              Close
            </button>

          </div>

        </div>

      )}

    </MainLayout>

  );
}

export default MyTasks;