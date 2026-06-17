import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";

function MainLayout({ children }) {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <div
        className="bg-dark text-white position-fixed top-0 start-0 vh-100"
        style={{
          width: "300px",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: "300px",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <Navbar />

        <div className="container-fluid p-4">
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;