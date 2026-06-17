import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";

function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [currentUserId, setCurrentUserId] =
  useState(null);

  const [showTasksModal, setShowTasksModal] =
  useState(false);

const [projectTasks, setProjectTasks] =
  useState([]);

const [selectedProject, setSelectedProject] =
  useState("");
  const [showCommentsModal, setShowCommentsModal] =
  useState(false);

const [comments, setComments] =
  useState([]);

const [selectedTaskId, setSelectedTaskId] =
  useState(null);

const [newComment, setNewComment] =
  useState("");

const [selectedProjectId, setSelectedProjectId] =
  useState(null);

  const [showEditModal, setShowEditModal] =
  useState(false);

const [editCommentId, setEditCommentId] =
  useState(null);

const [editText, setEditText] =
  useState("");

const [showDeleteModal, setShowDeleteModal] =
  useState(false);

const [deleteCommentId, setDeleteCommentId] =
  useState(null);

  const [showAttachmentModal, setShowAttachmentModal] =
  useState(false);

const [attachments, setAttachments] =
  useState([]);

const [selectedAttachmentTaskId,
  setSelectedAttachmentTaskId] =
  useState(null);

const [selectedFile, setSelectedFile] =
  useState(null);

  const [showDeleteAttachmentModal,
  setShowDeleteAttachmentModal] =
  useState(false);

const [deleteAttachmentId,
  setDeleteAttachmentId] =
  useState(null);
  const [showMembersModal, setShowMembersModal] =
  useState(false);

const [members, setMembers] =
  useState([]);

  const fetchProjects = async (
    currentStatus = status,
    currentSearch = search
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      let url =
        "http://localhost:5000/api/projects/myprojects";

      const params = [];

      if (
        currentStatus &&
        currentStatus !== "all"
      ) {
        params.push(
          `status=${currentStatus}`
        );
      }

      if (currentSearch) {
        params.push(
          `search=${currentSearch}`
        );
      }

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const openProjectTasks = async (
    projectId,
    projectTitle
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/tasks/project/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

setProjectTasks(
  data.map((task) => ({
    ...task,
    project_id: projectId,
  }))
);

setSelectedProject(projectTitle);

setSelectedProjectId(projectId);

setShowTasksModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  const openComments = async (taskId) => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/comments/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    setComments(data);
    setSelectedTaskId(taskId);
    setShowCommentsModal(true);
  } catch (error) {
    console.log(error);
  }
};
const openMembers = async (
  projectId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/projects/${projectId}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    setMembers(data);

    setShowMembersModal(true);

  } catch (error) {
    console.log(error);
  }
};
const openAttachments = async (
  taskId
) => {
  try {
    const token =
      localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/attachments/${taskId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const data =
      await response.json();

    setAttachments(data);

    setSelectedAttachmentTaskId(
      taskId
    );

    setShowAttachmentModal(true);

  } catch (error) {
    console.log(error);
  }
};
const addComment = async () => {
  try {
    const token =
      localStorage.getItem("token");

    await fetch(
      "http://localhost:5000/api/comments",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_id: selectedTaskId,
          comment: newComment,
        }),
      }
    );

    setNewComment("");

    openComments(selectedTaskId);
  } catch (error) {
    console.log(error);
  }
};
const uploadAttachment =
  async () => {

  try {

    if (!selectedFile) return;

    const token =
      localStorage.getItem("token");

    const formData =
      new FormData();

    formData.append(
      "file",
      selectedFile
    );

    formData.append(
      "task_id",
      selectedAttachmentTaskId
    );

    await fetch(
      "http://localhost:5000/api/attachments",
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
        body: formData,
      }
    );

    openAttachments(
      selectedAttachmentTaskId
    );

  } catch (error) {
    console.log(error);
  }
};

 useEffect(() => {
  fetchProjects();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (user) {
    setCurrentUserId(user.id);
  }
}, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return "bg-primary-subtle text-primary";

      case "planning":
        return "bg-info-subtle text-info";

      case "completed":
        return "bg-success-subtle text-success";

      default:
        return "bg-warning-subtle text-warning";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-danger-subtle text-danger";

      case "medium":
        return "bg-warning-subtle text-warning";

      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  return (
    <MainLayout>
      <div className="container-fluid py-4">

        <h1 className="fw-bold mb-1">
          All Projects
        </h1>

        <p className="text-muted mb-4">
          {projects.length} projects found
        </p>

        <div className="d-flex flex-wrap gap-2 mb-4">

          <input
            type="text"
            className="form-control"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              fetchProjects(
                status,
                e.target.value
              );
            }}
            style={{
              maxWidth: "400px",
            }}
          />

          <button
            className={
              status === "all"
                ? "btn btn-primary"
                : "btn btn-outline-secondary"
            }
            onClick={() => {
              setStatus("all");
              fetchProjects(
                "all",
                search
              );
            }}
          >
            All
          </button>

          <button
            className={
              status === "active"
                ? "btn btn-primary"
                : "btn btn-outline-secondary"
            }
            onClick={() => {
              setStatus("active");
              fetchProjects(
                "active",
                search
              );
            }}
          >
            Active
          </button>

          <button
            className={
              status === "planning"
                ? "btn btn-primary"
                : "btn btn-outline-secondary"
            }
            onClick={() => {
              setStatus("planning");
              fetchProjects(
                "planning",
                search
              );
            }}
          >
            Planning
          </button>

          <button
            className={
              status === "completed"
                ? "btn btn-primary"
                : "btn btn-outline-secondary"
            }
            onClick={() => {
              setStatus("completed");
              fetchProjects(
                "completed",
                search
              );
            }}
          >
            Completed
          </button>

          <button
            className={
              status === "on_hold"
                ? "btn btn-primary"
                : "btn btn-outline-secondary"
            }
            onClick={() => {
              setStatus("on_hold");
              fetchProjects(
                "on_hold",
                search
              );
            }}
          >
            On Hold
          </button>

        </div>

        <div className="row g-4">

          {projects.map((project) => (

            <div
              key={project.id}
              className="col-lg-4 col-md-6"
            >
              <div className="card border-0 shadow-sm h-100">

                <div className="card-body">

                  <div className="d-flex justify-content-between mb-3">

                    <span
                      className={`badge ${getStatusBadge(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>

                    <span
                      className={`badge ${getPriorityBadge(
                        project.priority
                      )}`}
                    >
                      {project.priority}
                    </span>

                  </div>

                  <h4 className="fw-bold">
                    {project.title}
                  </h4>

                  <p className="text-muted">
                    {project.description}
                  </p>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Progress</span>
                    <span>
                      {project.progress}%
                    </span>
                  </div>

                  <div
                    className="progress mb-4"
                    style={{
                      height: "8px",
                    }}
                  >
                    <div
                      className="progress-bar"
                      style={{
                        width:
                          `${project.progress}%`,
                      }}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">

                    <div className="d-flex">

                      {project.members
                        ?.slice(0, 3)
                        .map((member, index) => (

                          <img
                            key={member.id}
                            src={
                              member.avatar ||
                              `https://i.pravatar.cc/40?img=${
                                index + 1
                              }`
                            }
                            alt=""
                            className="rounded-circle border border-white"
                            width="35"
                            height="35"
                            style={{
                              marginLeft:
                                index === 0
                                  ? 0
                                  : "-10px",
                            }}
                          />

                        ))}

                    </div>

                    <small className="text-muted">
                      📅{" "}
                      {new Date(
                        project.created_at
                      ).toLocaleDateString()}
                    </small>

                  </div>

                  <div className="d-flex justify-content-between align-items-center">

                    <small
                      className="text-primary fw-semibold"
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openProjectTasks(
                          project.id,
                          project.title
                        )
                      }
                    >
                      View My Tasks →
                    </small>

                    <small className="text-secondary">
                      {
                        project.members
                          ?.length
                      }{" "}
                      Members
                    </small>

                  </div>

                </div>

              </div>
            </div>

          ))}

        </div>

       {showTasksModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,0.5)",
      zIndex: 99999,
    }}
  >
    <div
      className="bg-white p-4"
      style={{
        width: "700px",
        borderRadius: "20px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold mb-0">
          {selectedProject}
        </h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setShowTasksModal(false)
          }
        >
          Close
        </button>

      </div>

      {projectTasks.length === 0 ? (
        <div className="text-center text-muted py-5">
          No tasks found
        </div>
      ) : (
        projectTasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-4 p-4 mb-3"
          >
            <div className="d-flex justify-content-between align-items-start">

              <div>
                <h5 className="fw-bold mb-2">
                  {task.title}
                </h5>

                <p className="text-muted mb-3">
                  {task.description}
                </p>
              </div>

              <span
                className={`badge ${
                  task.status === "done"
                    ? "bg-success"
                    : task.status ===
                      "in_progress"
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              >
                {task.status}
              </span>

            </div>

            <div className="d-flex gap-2 flex-wrap mb-3">

              <span
                className={`badge ${
                  task.priority === "high"
                    ? "bg-danger"
                    : task.priority ===
                      "medium"
                    ? "bg-warning text-dark"
                    : "bg-secondary"
                }`}
              >
                {task.priority}
              </span>

              {task.due_date && (
  <span className="badge bg-light text-dark">
    📅 Deadline: {new Date(task.due_date)
      .toLocaleDateString("en-GB")}
  </span>
              )}

            </div>
            
           

<div className="d-flex gap-2 flex-wrap">

  {task.status !== "done" && (
    <button
      className="btn btn-success btn-sm"
      onClick={async () => {
        try {
          const token =
            localStorage.getItem("token");

          await fetch(
            `http://localhost:5000/api/tasks/${task.id}/done`,
            {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          openProjectTasks(
            selectedProjectId,
            selectedProject
          );

        } catch (error) {
          console.log(error);
        }
      }}
    >
      ✓ Mark As Done
    </button>
  )}

  <button
    className="btn btn-outline-primary btn-sm"
    onClick={() =>
      openComments(task.id)
    }
  >
    💬 Comments
  </button>

  <button
    className="btn btn-outline-secondary btn-sm"
    onClick={() =>
      openAttachments(task.id)
    }
  >
    📎 Attachment
  </button>

  <button
    className="btn btn-outline-dark btn-sm"
    onClick={() =>
      openMembers(task.project_id)
    }
  >
    👥 Members
  </button>

</div>
          </div>
        ))
      )}

    </div>
  </div>
)}

{showCommentsModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,0.5)",
      zIndex: 99999,
    }}
  >
    <div
      className="bg-white p-4"
      style={{
        width: "700px",
        borderRadius: "20px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold">
          Task Comments
        </h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setShowCommentsModal(false)
          }
        >
          Close
        </button>

      </div>

      {comments.length === 0 ? (
        <div className="text-center text-muted">
          No comments yet
        </div>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="border rounded-4 p-3 mb-3"
          >
            <div className="d-flex justify-content-between">

              <div>
                <h6 className="fw-bold mb-1">
                  {comment.full_name}
                </h6>

                <p className="mb-1">
                  {comment.comment}
                </p>

                <small className="text-muted">
                  {new Date(
                    comment.created_at
                  ).toLocaleString()}
                </small>
              </div>

              {comment.user_id ===
                currentUserId && (
                <div className="d-flex gap-2">

                  <button
                   className="btn btn-outline-danger rounded-4"
  style={{
    width: "50px",
    height: "50px",
    fontSize: "22px",
  }}
                    onClick={() => {
                      setEditCommentId(
                        comment.id
                      );

                      setEditText(
                        comment.comment
                      );

                      setShowEditModal(
                        true
                      );
                    }}
                  >
                    ✏️
                  </button>

                  <button
                   className="btn btn-outline-danger rounded-4"
  style={{
    width: "50px",
    height: "50px",
    fontSize: "22px",
  }}
                    onClick={() => {
                      setDeleteCommentId(
                        comment.id
                      );

                      setShowDeleteModal(
                        true
                      );
                    }}
                  >
                    🗑
                  </button>

                </div>
              )}

            </div>
          </div>
        ))
      )}

      <textarea
        className="form-control mt-3"
        rows="3"
        placeholder="Write comment..."
        value={newComment}
        onChange={(e) =>
          setNewComment(e.target.value)
        }
      />

      <button
        className="btn btn-primary mt-3"
        onClick={addComment}
      >
        Add Comment
      </button>

    </div>
  </div>
)}
{showAttachmentModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background:
        "rgba(0,0,0,0.5)",
      zIndex: 99999,
    }}
  >
    <div
      className="bg-white p-4"
      style={{
        width: "700px",
        borderRadius: "20px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between mb-4">

        <h3 className="fw-bold">
          Attachments
        </h3>

        <button
          className="btn btn-outline-secondary"
          onClick={() =>
            setShowAttachmentModal(
              false
            )
          }
        >
          Close
        </button>

      </div>

      {attachments.length === 0 ? (
        <div className="text-center text-muted">
          No attachments yet
        </div>
      ) : (
       attachments.map((file) => (

  <div
    key={file.id}
    className="border rounded-4 p-3 mb-3 shadow-sm"
  >

    <div className="d-flex justify-content-between align-items-start">

      <div>

        <h6 className="fw-bold mb-1">
          📎 {file.file_name}
        </h6>

       <small className="text-muted d-block">
  👤 Uploaded by:
  <span className="fw-semibold text-dark ms-1">
    {file.full_name}
  </span>
</small>

        <small className="text-muted">
          {new Date(
            file.created_at
          ).toLocaleString()}
        </small>

      </div>

      {file.uploaded_by ===
        currentUserId && (

      <button
  className="btn btn-outline-danger rounded-4"
  style={{
    width: "50px",
    height: "50px",
    fontSize: "22px",
  }}
  onClick={() => {

    setDeleteAttachmentId(
      file.id
    );

    setShowDeleteAttachmentModal(
      true
    );

  }}
>
  🗑
</button>
      )}

    </div>

    <a
      href={`http://localhost:5000/${file.file_url}`}
      target="_blank"
      rel="noreferrer"
      className="btn btn-primary btn-sm mt-3 rounded-pill"
    >
      Open File
    </a>

  </div>

))
      )}

      <input
        type="file"
        className="form-control mt-4"
        onChange={(e) =>
          setSelectedFile(
            e.target.files[0]
          )
        }
      />

      <button
        className="btn btn-primary mt-3"
        onClick={
          uploadAttachment
        }
      >
        Upload File
      </button>

    </div>
  </div>
)}

{showEditModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,0.5)",
      zIndex: 999999,
    }}
  >
    <div
      className="bg-white p-4 shadow"
      style={{
        width: "500px",
        borderRadius: "20px",
      }}
    >
      <h4 className="fw-bold mb-3">
        Edit Comment
      </h4>

      <textarea
        className="form-control"
        rows="5"
        value={editText}
        onChange={(e) =>
          setEditText(e.target.value)
        }
      />

      <div className="d-flex justify-content-end gap-2 mt-4">

        <button
          className="btn btn-light rounded-pill"
          onClick={() =>
            setShowEditModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="btn btn-primary rounded-pill"
          onClick={async () => {

            try {

              const token =
                localStorage.getItem("token");

              await fetch(
                `http://localhost:5000/api/comments/${editCommentId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type":
                      "application/json",
                    Authorization:
                      `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    comment: editText,
                  }),
                }
              );

              setShowEditModal(false);

              openComments(
                selectedTaskId
              );

            } catch (error) {
              console.log(error);
            }

          }}
        >
          Save Changes
        </button>

      </div>

    </div>
  </div>
)}

{showDeleteModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,0.5)",
      zIndex: 999999,
    }}
  >
    <div
      className="bg-white p-4 shadow"
      style={{
        width: "450px",
        borderRadius: "20px",
      }}
    >
      <h4 className="fw-bold">
        Delete Comment
      </h4>

      <p className="text-muted mt-3">
        Are you sure you want to delete this comment?
      </p>

      <div className="d-flex justify-content-end gap-2">

        <button
          className="btn btn-light rounded-pill"
          onClick={() =>
            setShowDeleteModal(false)
          }
        >
          Cancel
        </button>

        <button
          className="btn btn-danger rounded-pill"
          onClick={async () => {

            try {

              const token =
                localStorage.getItem("token");

              await fetch(
                `http://localhost:5000/api/comments/${deleteCommentId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

              setShowDeleteModal(false);

              openComments(
                selectedTaskId
              );

            } catch (error) {
              console.log(error);
            }

          }}
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
{showDeleteAttachmentModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background:
        "rgba(0,0,0,0.5)",
      zIndex: 999999,
    }}
  >
    <div
      className="bg-white p-4 shadow"
      style={{
        width: "450px",
        borderRadius: "20px",
      }}
    >
      <h4 className="fw-bold">
        Delete Attachment
      </h4>

      <p className="text-muted mt-3">
        Are you sure you want to delete this attachment?
      </p>

      <div className="d-flex justify-content-end gap-2">

        <button
          className="btn btn-light rounded-pill"
          onClick={() =>
            setShowDeleteAttachmentModal(
              false
            )
          }
        >
          Cancel
        </button>

        <button
          className="btn btn-danger rounded-pill"
          onClick={async () => {

            try {

              const token =
                localStorage.getItem(
                  "token"
                );

              await fetch(
                `http://localhost:5000/api/attachments/${deleteAttachmentId}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              );

              setShowDeleteAttachmentModal(
                false
              );

              openAttachments(
                selectedAttachmentTaskId
              );

            } catch (error) {
              console.log(error);
            }

          }}
        >
          Delete
        </button>

      </div>

    </div>
  </div>
)}
{showMembersModal && (
  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background:
        "rgba(0,0,0,0.6)",
      zIndex: 999999,
    }}
  >
    <div
      className="bg-white shadow-lg p-4"
      style={{
        width: "700px",
        borderRadius: "25px",
        maxHeight: "80vh",
        overflowY: "auto",
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="fw-bold mb-0">
          👥 Team Members
        </h3>

        <button
          className="btn btn-outline-secondary rounded-pill"
          onClick={() =>
            setShowMembersModal(false)
          }
        >
          Close
        </button>

      </div>

      {members.map((member) => (

        <div
          key={member.id}
          className="border rounded-4 p-3 mb-3 d-flex align-items-center justify-content-between"
        >
          <div className="d-flex align-items-center gap-3">

          <img
  src={
    member.avatar
      ? `http://localhost:5000/${member.avatar}`
      : `https://i.pravatar.cc/100?img=${member.id}`
  }
  alt=""
  width="60"
  height="60"
  className="rounded-circle"
/>

            <div>

              <h5 className="fw-bold mb-1">
                {member.full_name}
              </h5>

              <small className="text-muted">
                {member.email}
              </small>

            </div>

          </div>

          <span className="badge bg-primary rounded-pill px-3 py-2">
            {member.role}
          </span>

        </div>

      ))}

    </div>
  </div>
)}
      </div>
    </MainLayout>
  );
}

export default AllProjects;