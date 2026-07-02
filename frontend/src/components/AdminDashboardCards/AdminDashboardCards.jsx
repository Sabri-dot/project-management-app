import {
  MdFolder,
  MdTaskAlt,
  MdPeople,
  MdAdminPanelSettings,
  MdTrendingUp,
} from "react-icons/md";


function AdminDashboardCards({
  dashboardData,
}) {
  const cards = [
    {
      title: "Total Projects",
      value:
        dashboardData.totalProjects,
      subtitle:
        "All projects",
      icon: <MdFolder />,
      color: "primary",
    },

    {
      title: "Active Tasks",
      value:
        dashboardData.activeTasks,
      subtitle:
        "Tasks in progress",
      icon: <MdTaskAlt />,
      color: "success",
    },

    {
      title: "Team Members",
      value:
        dashboardData.teamMembers,
      subtitle:
        "Registered members",
      icon: <MdPeople />,
      color: "warning",
    },

    {
      title: "Project Managers",
      value:
        dashboardData.projectManagers,
      subtitle:
        "Managers",
      icon:
        <MdAdminPanelSettings />,
      color: "danger",
    },

    {
      title: "Completion Rate",
      value:
        `${dashboardData.completionRate}%`,
      subtitle:
        "Overall completion",
      icon:
        <MdTrendingUp />,
      color: "info",
    },
  ];

  return (
    <div className="row g-4 mt-2">

      {cards.map(
        (card, index) => (
          <div
            key={index}
            className="col-xl col-lg-4 col-md-6"
          >
            <div className="card border-0 shadow-sm h-100 rounded-4">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center">

                  <div>

                    <p className="text-secondary mb-2">
                      {card.title}
                    </p>

                    <h2 className="fw-bold mb-2">
                      {card.value}
                    </h2>

                    <small className="text-muted">
                      {card.subtitle}
                    </small>

                  </div>

                  <div
                    className={`bg-${card.color} d-flex justify-content-center align-items-center text-white rounded-4`}
                    style={{
                      width: "65px",
                      height: "65px",
                      fontSize: "30px",
                    }}
                  >
                    {card.icon}
                  </div>

                </div>

              </div>

            </div>
          </div>
        )
      )}

    </div>
  );
}

export default AdminDashboardCards;