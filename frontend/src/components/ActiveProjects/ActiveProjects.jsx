import { useState } from "react";

function ActiveProjects({
  projects = [],
  isAdmin = false,
}) {
  const [showModal, setShowModal] =
    useState(false);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-success-subtle text-success";

      case "completed":
        return "bg-primary-subtle text-primary";

      case "planning":
        return "bg-warning-subtle text-warning";

      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <>
      <div
  className="bg-white rounded-4 p-4 h-100 shadow-sm"
  style={{
    border: "1px solid #eef2f7",
  }}
>

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h3 className="fw-bold mb-0">
            Active Projects
          </h3>

          <button
  className="btn btn-primary rounded-pill px-4"
  onClick={() =>
    setShowModal(true)
  }
>
  View All
</button>

        </div>

        {projects.length === 0 ? (
          <div
            style={{
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            No active projects assigned.
          </div>
        ) : (
         projects.slice(0, 3).map((project) => (
  <div
    key={project.id}
    className="rounded-4 p-4 mb-3 bg-light-subtle"
style={{
  border: "1px solid #e2e8f0",
  transition: "0.3s",
}}
  >
    <div className="d-flex justify-content-between align-items-start">

      <div>

        <h5
  className="fw-bold mb-2"
  style={{
    color: "#0f172a",
  }}
>
  📁 {project.title}
</h5>

        <span className="badge bg-primary-subtle text-primary">
          {project.status}
        </span>

      </div>

  <div className="text-end">
  <h5 className="fw-bold text-primary mb-0">
    {project.progress}%
  </h5>

  <small className="text-muted">
    Completed
  </small>
</div>

    </div>

    <div className="mt-3">

     <div
  className="progress"
  style={{
    height: "10px",
    borderRadius: "20px",
  }}
>
<div
  className="progress-bar"
  style={{
    width: `${project.progress}%`,
    background:
      "linear-gradient(90deg,#2563eb,#60a5fa)",
  }}
/>
</div>

    </div>

  </div>
))
        )}

      </div>

      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            background:
              "rgba(15,23,42,0.65)",
            backdropFilter:
              "blur(5px)",
            zIndex: 999999,
          }}
        >
          <div
            className="bg-white shadow-lg"
            style={{
              width: "900px",
              maxWidth: "95%",
              borderRadius: "28px",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
          >

            <div
              className="p-4 border-bottom"
              style={{
                background:
                  "linear-gradient(135deg,#2563eb,#3b82f6)",
                color: "white",
                borderTopLeftRadius:
                  "28px",
                borderTopRightRadius:
                  "28px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">

               <div>

  <h2 className="fw-bold mb-1">
    {isAdmin
      ? "📁 All Projects"
      : "📁 My Projects"}
  </h2>

  <p className="mb-0 opacity-75">
    {isAdmin
      ? "All created projects in the system"
      : "All projects assigned to you"}
  </p>

</div>

                <button
                  className="btn btn-light rounded-pill px-4"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Close
                </button>

              </div>
            </div>

            <div className="p-4">

              {projects.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  No projects found
                </div>
              ) : (
                projects.map((project) => (
                <div
  key={project.id}
  className="card border-0 shadow-sm mb-4"
  style={{
    borderRadius: "24px",
    background:
      "linear-gradient(to bottom,#ffffff,#f8fafc)",
  }}
>
                    <div className="card-body p-4">

                     <div
  className="d-flex align-items-start mb-3"
  style={{
    gap: "350px",
  }}
>

  <div style={{ flex: 1 }}>
    <h4 className="fw-bold mb-2">
      {project.title}
    </h4>

    <span
      className={`badge px-3 py-2 rounded-pill ${getStatusBadge(
        project.status
      )}`}
    >
      {project.status}
    </span>
  </div>

  <div
    className="text-end"
    style={{
      minWidth: "120px",
    }}
  >
   <h2 className="fw-bold text-primary mb-0">
  {project.progress}%
</h2>

    <small className="text-muted">
      Progress
    </small>
  </div>

</div>

                      <div
                        className="progress"
                        style={{
                          height:
                            "14px",
                          borderRadius:
                            "30px",
                        }}
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{
                            width: `${project.progress}%`,
                          }}
                        />
                      </div>

                    </div>
                  </div>
                ))
              )}

            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default ActiveProjects;