import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";

function AllTasks() {

  const [tasks, setTasks] =
    useState([]);

  const fetchCompletedTasks =
    async () => {

      try {

        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            "http://localhost:5000/api/tasks/all",
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
    fetchCompletedTasks();
  }, []);

  const priorityBadge = (
    priority
  ) => {

    switch (priority) {

      case "high":
        return "bg-danger-subtle text-danger";

      case "medium":
        return "bg-warning-subtle text-warning";

      default:
        return "bg-secondary-subtle text-secondary";

    }

  };

  const statusBadge = (
    status
  ) => {

    switch (status) {

      case "done":
        return "bg-success-subtle text-success";

      case "in_progress":
        return "bg-primary-subtle text-primary";

      default:
        return "bg-secondary-subtle text-secondary";

    }

  };

  return (

    <MainLayout>

      <div className="container-fluid py-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h1 className="fw-bold mb-1">
              All Tasks
            </h1>

            <p className="text-muted fs-5 mb-0">
              {tasks.length} completed tasks
            </p>

          </div>

          <div className="btn-group">

            <button className="btn btn-light border">
              ☰
            </button>

            <button className="btn btn-light border">
              ⊞
            </button>

          </div>

        </div>

        <div
          className="card border-0 shadow-sm"
          style={{
            borderRadius: "18px",
          }}
        >

          <div className="table-responsive">

            <table className="table align-middle mb-0">

              <thead
                style={{
                  background:
                    "#F8FAFC",
                }}
              >

                <tr>

                  <th className="ps-4 py-3">
                    Task
                  </th>

                  <th>
                    Project
                  </th>

                  <th>
                    Priority
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Finished
                  </th>

                </tr>

              </thead>

              <tbody>

                {tasks.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted"
                    >
                      No completed tasks found
                    </td>

                  </tr>

                ) : (

                  tasks.map((task) => (

                    <tr key={task.id}>

                      <td className="ps-4 py-4 fw-medium">
                        {task.title}
                      </td>

                      <td className="text-secondary">
                        {task.project_name}
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

                      <td className="text-success fw-semibold">

  {task.completed_at
    ? new Date(
        task.completed_at
      ).toLocaleDateString("en-GB")
    : "-"}

</td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </MainLayout>

  );

}

export default AllTasks;