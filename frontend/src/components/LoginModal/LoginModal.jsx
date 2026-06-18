import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdClose } from "react-icons/md";

function LoginModal({
  show,
  onClose,
  onRegisterClick,
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

     if (response.ok) {
  localStorage.setItem(
    "token",
    data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  onClose();

  if (data.user.role === "admin") {
    navigate("/admin");
  } else {
    navigate("/dashboard");
  }
} else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  if (!show) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        zIndex: 99999,
      }}
    >
      <div
        className="bg-white overflow-hidden shadow-lg"
        style={{
          width: "560px",
          borderRadius: "22px",
        }}
      >
        {/* HEADER */}

        <div
          className="position-relative text-center text-white"
          style={{
            background:
              "linear-gradient(135deg,#2563eb 0%, #4f46e5 100%)",
            padding: "34px 30px",
          }}
        >
          <MdClose
            size={28}
            onClick={onClose}
            style={{
              position: "absolute",
              right: "20px",
              top: "20px",
              cursor: "pointer",
            }}
          />

          <div
            className="mx-auto mb-4 d-flex justify-content-center align-items-center"
            style={{
              width: "62px",
              height: "62px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.15)",
              fontSize: "28px",
            }}
          >
            📦
          </div>

          <h2
            className="fw-bold mb-2"
            style={{
              fontSize: "22px",
            }}
          >
            Welcome back
          </h2>

          <p
            className="mb-0"
            style={{
              fontSize: "16px",
              opacity: "0.9",
            }}
          >
            Sign in to ProjectHub
          </p>
        </div>

        {/* BODY */}

        <div className="p-4">

          <div className="input-group mb-4">
            <span
              className="input-group-text bg-white border-end-0"
              style={{
                borderRadius: "14px 0 0 14px",
              }}
            >
              <MdEmail
                size={20}
                color="#94a3b8"
              />
            </span>

            <input
              type="email"
              placeholder="Email address"
              className="form-control border-start-0"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={{
                height: "52px",
                boxShadow: "none",
                borderRadius:
                  "0 14px 14px 0",
              }}
            />
          </div>

          <div className="input-group mb-4">
            <span
              className="input-group-text bg-white border-end-0"
              style={{
                borderRadius: "14px 0 0 14px",
              }}
            >
              <MdLock
                size={20}
                color="#94a3b8"
              />
            </span>

            <input
              type="password"
              placeholder="Password"
              className="form-control border-start-0"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              style={{
                height: "52px",
                boxShadow: "none",
                borderRadius:
                  "0 14px 14px 0",
              }}
            />
          </div>

          <button
            className="btn btn-primary w-100 fw-semibold"
            style={{
              height: "52px",
              borderRadius: "14px",
              fontSize: "18px",
            }}
            onClick={handleLogin}
          >
            Sign In
          </button>

          <div
            className="text-center mt-4"
            style={{
              fontSize: "16px",
              color: "#64748b",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={onRegisterClick}
              style={{
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Sign up
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginModal;