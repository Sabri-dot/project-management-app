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


 const hideLayout =
  location.pathname.startsWith("/pm/projects") ||
  location.pathname.startsWith("/pm/project-details") ||
  location.pathname.startsWith("/pm/tasks");


  return (

    <>

      {hideLayout ? (

        <Outlet />

      ) : (

        <div className="d-flex" style={{ minHeight: "100vh" }}>

          <Sidebar />


          <div className="flex-grow-1 bg-light">

            <Navbar />


            <div>

              <Outlet />

            </div>


          </div>


        </div>

      )}

    </>

  );

}


export default ProjectManagerLayout;