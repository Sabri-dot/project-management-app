import "./DashboardCards.css";

import {
  MdFolder,
  MdTaskAlt,
  MdPeople,
  MdTrendingUp,
} from "react-icons/md";

function DashboardCards({
  dashboardData,
}) {
  const cards = [
    {
      title: "Total Projects",
      value:
        dashboardData.totalProjects,
      growth: "Projects assigned",
      icon: <MdFolder />,
      color: "#2563eb",
    },
    {
      title: "Total Tasks",
      value:
        dashboardData.totalTasks,
      growth: "All assigned tasks",
      icon: <MdTaskAlt />,
      color: "#10b981",
    },
    {
      title: "Completed Tasks",
      value:
        dashboardData.completedTasks,
      growth: "Finished tasks",
      icon: <MdPeople />,
      color: "#7c3aed",
    },
    {
      title: "Completion Rate",
      value:
        dashboardData.totalTasks > 0
          ? `${Math.round(
              (dashboardData.completedTasks /
                dashboardData.totalTasks) *
                100
            )}%`
          : "0%",
      growth: "Task completion",
      icon: <MdTrendingUp />,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="dashboard-cards">
      {cards.map((card, index) => (
        <div
          className="card"
          key={index}
        >
          <div>
            <p>{card.title}</p>

            <h2>{card.value}</h2>

            <span>
              {card.growth}
            </span>
          </div>

          <div
            className="card-icon"
            style={{
              background:
                card.color,
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;