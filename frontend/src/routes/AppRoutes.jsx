import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing/Landing";

import Dashboard from "../pages/Dashboard/Dashboard";
import AllProjects from "../pages/Projects/AllProjects";
import AllTasks from "../pages/Tasks/AllTasks";
import MyTasks from "../pages/Tasks/MyTasks";
import Profile from "../pages/Profile/Profile";

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

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;