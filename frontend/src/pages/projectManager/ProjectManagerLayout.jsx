import {
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";

function ProjectManagerLayout() {
  const navigate = useNavigate();
   const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "project_manager") {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (!user || user.role !== "project_manager") {
    return null;
  }

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar />

      <div className="flex-grow-1 bg-light">
       {location.pathname !== "/pm/tasks" && <Navbar />}

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProjectManagerLayout;