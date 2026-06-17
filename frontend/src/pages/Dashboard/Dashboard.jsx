import { useEffect, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import DashboardCards from "../../components/DashboardCards/DashboardCards";
import ActivityChart from "../../components/ActivityChart/ActivityChart";
import ProjectStatus from "../../components/ProjectStatus/ProjectStatus";
import ActiveProjects from "../../components/ActiveProjects/ActiveProjects";
import RecentActivity from "../../components/RecentActivity/RecentActivity";

import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] =
    useState(null);

  const [activities, setActivities] =
    useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchActivities();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const fetchActivities =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            "http://localhost:5000/api/activity/myactivities",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        setActivities(data);

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
            Dashboard
          </h1>

          <p className="text-secondary mb-0">
            Welcome back,{" "}
            {
              dashboardData.user
                .full_name
            }
            ! Here's what's happening today.
          </p>

        </div>

      </div>

      <DashboardCards
        dashboardData={dashboardData}
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
            activities={activities}
          />

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;