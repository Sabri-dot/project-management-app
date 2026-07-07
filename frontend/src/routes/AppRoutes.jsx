import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";

import Dashboard from "../pages/Dashboard/Dashboard";
import AllProjects from "../pages/Projects/AllProjects";
import AllTasks from "../pages/Tasks/AllTasks";
import MyTasks from "../pages/Tasks/MyTasks";
import Profile from "../pages/Profile/Profile";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUsers from "../pages/Admin/AdminUsers";
import AdminProjects from "../pages/Admin/AdminProjects";
import AdminTasks from "../pages/Admin/AdminTasks";
import AdminProjectMembers from "../pages/Admin/AdminProjectMembers";
import AdminComments from "../pages/Admin/AdminComments";
import AdminNotifications from "../pages/Admin/AdminNotifications";
import AdminAttachments from "../pages/Admin/AdminAttachments";
import AdminActivityLogs from "../pages/Admin/AdminActivityLogs";
import AdminProjectDetails from "../pages/Admin/AdminProjectDetails";
import ProjectManagerLayout from "../pages/projectManager/ProjectManagerLayout";
import ProjectManagerDashboard from "../pages/projectManager/ProjectManagerDashboard";
import ProjectManagerProjects from "../pages/projectManager/ProjectManagerProjects";
import ProjectManagerTasks from "../pages/projectManager/ProjectManagerTasks";
import ProjectManagerDetails from "../pages/projectManager/ProjectManagerDetails";
/*import ProjectManagerProfile from "../pages/projectManager/ProjectManagerProfile";*/
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
<Route path="/admin/projects/:id"element={<AdminProjectDetails />}/>
<Route path="/pm" element={<ProjectManagerLayout />}>
  <Route index element={<ProjectManagerDashboard />} />
  <Route path="projects" element={<ProjectManagerProjects />} />
  <Route path="projects/:id" element={<ProjectManagerDetails />} />
  <Route path="tasks" element={<ProjectManagerTasks />} />
  <Route path="profile" element={<Profile />}/>
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;