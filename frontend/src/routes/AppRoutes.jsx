import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";

import Dashboard from "../pages/Dashboard/Dashboard";
import AllProjects from "../pages/Projects/AllProjects";
import AllTasks from "../pages/Tasks/AllTasks";
import MyTasks from "../pages/Tasks/MyTasks";
import Profile from "../pages/Profile/Profile";
import AdminDashboard from "../pages/Admin/AdminDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}

        <Route
          path="/"
          element={<Landing />}
        />

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/projects"
          element={<AllProjects />}
        />

        <Route
          path="/tasks"
          element={<AllTasks />}
        />

        <Route
          path="/mytasks"
          element={<MyTasks />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

    



<Route path="/admin" element={<AdminDashboard />}/>
<Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/projects" element={<AdminProjects />} />
<Route path="/admin/tasks" element={<AdminTasks />} />
<Route path="/admin/project-members" element={<AdminProjectMembers />} />
<Route path="/admin/comments" element={<AdminComments />} />
<Route path="/admin/notifications" element={<AdminNotifications />} />
<Route path="/admin/attachments" element={<AdminAttachments />} />
<Route path="/admin/activity-logs" element={<AdminActivityLogs />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;