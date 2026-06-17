import { useState } from "react";
import LoginModal from "../../components/LoginModal/LoginModal";
import RegisterModal from "../../components/RegisterModal/RegisterModal";
import {
  MdDashboard,
  MdGroups,
  MdBarChart,
  MdSecurity,
  MdCheckCircle,
} from "react-icons/md";

function Landing() {
 const [showLogin, setShowLogin] = useState(false);
const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
        
        {/* NAVBAR */}

        <div
          className="d-flex justify-content-between align-items-center px-5"
          style={{
            height: "70px",
            background: "#fff",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg,#2563eb,#4f46e5)",
                color: "white",
                fontSize: "22px",
              }}
            >
              📦
            </div>

            <h3
              className="mb-0 ms-3 fw-bold"
              style={{ color: "#0f172a" }}
            >
              ProjectHub
            </h3>
          </div>

          <button
            className="btn btn-primary px-4"
            style={{
              height: "45px",
              borderRadius: "12px",
            }}
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>
        </div>

        {/* HERO */}

        <div
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{
            paddingTop: "110px",
          }}
        >
          <div
            style={{
              background: "#eef2ff",
              color: "#2563eb",
              padding: "8px 18px",
              borderRadius: "999px",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            PROJECT MANAGEMENT SAAS
          </div>

          <h1
            className="fw-bold mt-4"
            style={{
              fontSize: "72px",
              lineHeight: "1.1",
              color: "#0f172a",
              maxWidth: "900px",
            }}
          >
            Manage projects & teams
            <br />
            the{" "}
            <span style={{ color: "#2563eb" }}>
              smarter
            </span>{" "}
            way
          </h1>

          <p
            className="mt-4"
            style={{
              maxWidth: "850px",
              color: "#64748b",
              fontSize: "20px",
            }}
          >
            ProjectHub brings your projects, tasks,
            and people together with role-based
            access and real-time insights.
          </p>

          <div className="d-flex gap-3 mt-4">
            <button
              className="btn btn-primary"
              style={{
                width: "210px",
                height: "56px",
                borderRadius: "14px",
                fontSize: "20px",
              }}
              onClick={() => setShowLogin(true)}
            >
              Get Started Free
            </button>

            <button
              className="btn btn-light border"
              style={{
                width: "130px",
                height: "56px",
                borderRadius: "14px",
                fontSize: "20px",
              }}
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          </div>

          <div
            className="d-flex gap-5 mt-4"
            style={{
              color: "#64748b",
              fontSize: "16px",
            }}
          >
            <div>
              <MdCheckCircle
                color="#10b981"
                size={18}
              />{" "}
              Free for diploma demo
            </div>

            <div>
              <MdCheckCircle
                color="#10b981"
                size={18}
              />{" "}
              No credit card
            </div>

            <div>
              <MdCheckCircle
                color="#10b981"
                size={18}
              />{" "}
              Role-based access
            </div>
          </div>
        </div>

        {/* CARDS */}

        <div
          className="container"
          style={{
            marginTop: "120px",
            paddingBottom: "100px",
          }}
        >
          <div className="row g-4">

            <div className="col-md-3">
              <div
                className="bg-white border h-100"
                style={{
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <MdDashboard
                  size={40}
                  color="#2563eb"
                />

                <h3 className="mt-4 fw-bold">
                  Unified Dashboard
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Track projects, tasks and team
                  velocity in one place.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="bg-white border h-100"
                style={{
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <MdGroups
                  size={40}
                  color="#2563eb"
                />

                <h3 className="mt-4 fw-bold">
                  Team Collaboration
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Assign tasks and manage members
                  with ease.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="bg-white border h-100"
                style={{
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <MdBarChart
                  size={40}
                  color="#2563eb"
                />

                <h3 className="mt-4 fw-bold">
                  Reports & Insights
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Real-time analytics for
                  data-driven decisions.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div
                className="bg-white border h-100"
                style={{
                  borderRadius: "20px",
                  padding: "30px",
                }}
              >
                <MdSecurity
                  size={40}
                  color="#2563eb"
                />

                <h3 className="mt-4 fw-bold">
                  Role-based Access
                </h3>

                <p
                  style={{
                    color: "#64748b",
                    fontSize: "18px",
                  }}
                >
                  Admin, Project Manager and Team
                  Member roles.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}

        <div
          className="text-center py-4"
          style={{
            borderTop: "1px solid #e2e8f0",
            color: "#94a3b8",
            fontSize: "18px",
          }}
        >
          © 2026 ProjectHub. Diploma project.
        </div>
      </div>

     <LoginModal
  show={showLogin}
  onClose={() => setShowLogin(false)}
  onRegisterClick={() => {
    setShowLogin(false);
    setShowRegister(true);
  }}
/>

<RegisterModal
  show={showRegister}
  onClose={() => setShowRegister(false)}
  onLoginClick={() => {
    setShowRegister(false);
    setShowLogin(true);
  }}
/>
    </>
  );
}

export default Landing;