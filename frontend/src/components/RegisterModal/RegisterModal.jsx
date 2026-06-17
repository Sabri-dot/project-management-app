import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { MdClose } from "react-icons/md";

function RegisterModal({
  show,
  onClose,
  onLoginClick,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [successMessage, setSuccessMessage] =
    useState(false);

  if (!show) return null;

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            full_name: fullName,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(true);

        setFullName("");
        setEmail("");
        setPassword("");

        setTimeout(() => {
          setSuccessMessage(false);

          onClose();

          if (onLoginClick) {
            onLoginClick();
          }
        }, 6000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  return (
    <>
      {successMessage && (
        <div
          className="position-fixed"
          style={{
            top: "30px",
            right: "30px",
            background: "#10b981",
            color: "white",
            padding: "18px 24px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "600",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 999999,
          }}
        >
          ✅ Account created successfully.
          <br />
          Please continue with Sign In.
        </div>
      )}

      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
        style={{
          background: "rgba(0,0,0,0.45)",
          zIndex: 99999,
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          className="bg-white overflow-hidden"
          style={{
            width: "560px",
            borderRadius: "24px",
          }}
        >
          {/* HEADER */}

          <div
            className="position-relative text-center text-white"
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#4f46e5)",
              padding: "34px",
            }}
          >
            <MdClose
              size={28}
              onClick={onClose}
              style={{
                position: "absolute",
                right: "22px",
                top: "22px",
                cursor: "pointer",
              }}
            />

            <div
              className="mx-auto mb-3 d-flex justify-content-center align-items-center"
              style={{
                width: "62px",
                height: "62px",
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,0.15)",
                fontSize: "28px",
              }}
            >
              📦
            </div>

            <h2 className="fw-bold mb-2">
              Create your account
            </h2>

            <p
              className="mb-0"
              style={{
                fontSize: "22px",
                opacity: "0.9",
              }}
            >
              Join ProjectHub today
            </p>
          </div>

          {/* BODY */}

          <div className="p-4">
            <div className="input-group mb-4">
              <span className="input-group-text bg-white border-end-0">
                <MdPerson size={22} />
              </span>

              <input
                type="text"
                placeholder="Full name"
                className="form-control border-start-0"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                style={{
                  height: "52px",
                  boxShadow: "none",
                }}
              />
            </div>

            <div className="input-group mb-4">
              <span className="input-group-text bg-white border-end-0">
                <MdEmail size={22} />
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
                }}
              />
            </div>

            <div className="input-group mb-4">
              <span className="input-group-text bg-white border-end-0">
                <MdLock size={22} />
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
                }}
              />
            </div>

            <button
              className="btn btn-primary w-100 fw-semibold"
              style={{
                height: "52px",
                borderRadius: "14px",
                fontSize: "20px",
              }}
              onClick={handleRegister}
            >
              Create Account
            </button>

            <div
              className="text-center mt-4"
              style={{
                fontSize: "18px",
              }}
            >
              Already have an account?{" "}
              <span
                onClick={onLoginClick}
                style={{
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Sign in
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterModal;