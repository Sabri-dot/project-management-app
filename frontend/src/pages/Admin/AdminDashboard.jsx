import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import AdminDashboardCards from "../../components/AdminDashboardCards/AdminDashboardCards";
import ActivityChart from "../../components/ActivityChart/ActivityChart";
import ProjectStatus from "../../components/ProjectStatus/ProjectStatus";
import ActiveProjects from "../../components/ActiveProjects/ActiveProjects";
import RecentActivity from "../../components/RecentActivity/RecentActivity";
import AdminLatestUsers from "../../components/AdminLatestUsers/AdminLatestUsers";
function AdminDashboard() {
  const [dashboardData, setDashboardData] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const response =
          await fetch(
            "http://localhost:5000/api/admin/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        setDashboardData(data);

      } catch (error) {
        console.log(error);
      }
    };

  if (!dashboardData) {
    return (
      <MainLayout>
        <h3>Loading...</h3>
      </MainLayout>
    );
  }

 
  return (
    <MainLayout>

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="fw-bold">
            Admin Dashboard
          </h1>

          <p className="text-secondary mb-0">
            System overview and statistics
          </p>

        </div>

      </div>

      <AdminDashboardCards
  dashboardData={{
    totalProjects:
      dashboardData.totalProjects,

    activeTasks:
      dashboardData.activeTasks,

    teamMembers:
      dashboardData.teamMembers,

    projectManagers:
      dashboardData.projectManagers,

    completionRate:
      dashboardData.completionRate,
  }}
/>

      <div className="row g-4 mt-2">

        <div className="col-lg-8">
          <ActivityChart />
        </div>

        <div className="col-lg-4">
          <ProjectStatus />
        </div>

      </div>

      <div className="row g-4 mt-2">

        <div className="col-lg-8">

          <ActiveProjects
            projects={
              dashboardData.activeProjects
            }
          />

        </div>

        <div className="col-lg-4">

          <RecentActivity
            activities={
              dashboardData.activities
            }
          />

        </div>

      </div>
     <div className="mt-4">

  <AdminLatestUsers
    users={
      dashboardData.latestUsers || []
    }
  />

</div>

    </MainLayout>
  );
}

export default AdminDashboard;