import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import {
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
function Profile() {

  const [profile, setProfile] =
    useState(null);

  const [success, setSuccess] =
    useState(false);

    const [selectedFile,setSelectedFile] =
       useState(null);

       const [uploadSuccess, setUploadSuccess] =
         useState(false);

         const [showPasswordModal,
  setShowPasswordModal] =
  useState(false);

const [currentPassword,
  setCurrentPassword] =
  useState("");

const [newPassword,
  setNewPassword] =
  useState("");

const [confirmPassword,
  setConfirmPassword] =
  useState("");

const [passwordError,
  setPasswordError] =
  useState("");

const [passwordSuccess,
  setPasswordSuccess] =
  useState(false); 

  const [showCurrentPassword,
  setShowCurrentPassword] =
  useState(false);

const [showNewPassword,
  setShowNewPassword] =
  useState(false);

const [showConfirmPassword,
  setShowConfirmPassword] =
  useState(false);

  const fetchProfile = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          "http://localhost:5000/api/users/profile",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setProfile(data);

    } catch (error) {
      console.log(error);
    }

  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]:
        e.target.value,
    });

  };

  const saveProfile = async () => {

    try {

      const token =
        localStorage.getItem("token");

      await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            profile
          ),
        }
      );

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.log(error);
    }

  };
const uploadAvatar =
  async () => {

    if (!selectedFile) return;

    try {

      const token =
        localStorage.getItem("token");

      const formData =
        new FormData();

      formData.append(
        "avatar",
        selectedFile
      );

      const response =
        await fetch(
          "http://localhost:5000/api/users/avatar",
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
            body: formData,
          }
        );

      const data =
        await response.json();
setProfile({
  ...profile,
  avatar: data.avatar,
});

setUploadSuccess(true);

setTimeout(() => {
  setUploadSuccess(false);
}, 5000);

    } catch (error) {

      console.log(error);

    }

  };
  const changePassword =
  async () => {

    setPasswordError("");

    if (
      newPassword !==
      confirmPassword
    ) {

      setPasswordError(
        "Passwords do not match"
      );

      return;

    }

    try {

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          "http://localhost:5000/api/users/change-password",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        setPasswordError(
          data.message
        );

        return;

      }

      setPasswordSuccess(true);

setTimeout(() => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "user"
  );

  window.location.href = "/";

}, 3000);

    } catch (error) {

      console.log(error);

    }

  };
  const getPasswordStrength = () => {

  if (newPassword.length < 6) {
    return {
      text: "Weak",
      className: "text-danger",
    };
  }

  if (newPassword.length < 10) {
    return {
      text: "Medium",
      className: "text-warning",
    };
  }

  return {
    text: "Strong",
    className: "text-success",
  };

};

  if (!profile) {
    return (
      <MainLayout>
        <div className="container-fluid py-5">
          Loading...
        </div>
      </MainLayout>
    );
  }
  const getUserStatus = () => {

  if (!profile?.last_seen) {

    return {
      text: "Offline",
      className:
        "bg-secondary-subtle text-secondary",
    };

  }

  const now =
    new Date();

  const lastSeen =
    new Date(
      profile.last_seen
    );

  const diffMinutes =
    Math.floor(
      (now - lastSeen) /
      1000 /
      60
    );

  if (diffMinutes < 2) {

    return {
      text:
        "Active Now",
      className:
        "bg-success-subtle text-success",
    };

  }

  if (diffMinutes < 60) {

    return {
      text:
        `Last seen ${diffMinutes} min ago`,
      className:
        "bg-warning-subtle text-warning",
    };

  }

  const diffHours =
    Math.floor(
      diffMinutes / 60
    );

  return {
    text:
      `Last seen ${diffHours} hour ago`,
    className:
      "bg-secondary-subtle text-secondary",
  };

};
  return (

    <MainLayout>

      <div className="container-fluid py-4">

        <h1 className="fw-bold mb-1">
          My Profile
        </h1>

        <p className="text-muted fs-5 mb-4">
          Manage your personal information
        </p>

     {uploadSuccess && (

  <div
    className="
      position-fixed
      top-0
      end-0
      m-4
      shadow-lg
      bg-success
      text-white
      px-4
      py-3
      rounded-4
    "
    style={{
      zIndex: 999999,
      minWidth: "320px",
      animation:
        "fadeIn 0.3s ease",
    }}
  >
    ✅ Profile photo uploaded successfully
  </div>

)}

        <div className="row g-4">

          {/* LEFT CARD */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm h-100"
              style={{
                borderRadius: "18px",
              }}
            >

              <div className="card-body text-center p-4">

             <div
  className="position-relative d-inline-block mb-3"
>
  <img
    src={
      profile.avatar ||
      "https://i.pravatar.cc/200"
    }
    alt=""
    className="rounded-circle shadow"
    width="120"
    height="120"
    style={{
      objectFit: "cover",
      border: "4px solid white",
    }}
  />

  {getUserStatus().text ===
    "Active Now" && (
    <span
      style={{
        position: "absolute",
        bottom: "8px",
        right: "8px",
        width: "18px",
        height: "18px",
        borderRadius: "50%",
        background: "#22c55e",
        border: "3px solid white",
        boxShadow:
          "0 0 12px rgba(34,197,94,.8)",
      }}
    />
  )}

</div>
                <div className="mt-3">

  <input
  type="file"
  id="avatarInput"
  hidden
  onChange={(e) =>
    setSelectedFile(
      e.target.files[0]
    )
  }
/>

<label
  htmlFor="avatarInput"
  className="btn btn-outline-primary w-100 mt-3"
>
  📷 Change Profile Picture
</label>

{selectedFile && (

  <div className="mt-3">

    <small className="text-muted d-block mb-2">
      Selected:
      {" "}
      {selectedFile.name}
    </small>

    <button
      className="btn btn-dark w-100"
      onClick={uploadAvatar}
    >
      Upload New Avatar
    </button>

  </div>

)}

</div>

                <h2 className="fw-bold">
                  {profile.full_name}
                </h2>

              <div
  className="
    d-inline-flex
    align-items-center
    gap-2
    px-3
    py-2
    rounded-pill
    bg-success-subtle
    text-success
    fw-semibold
  "
>

  <span
    style={{
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "#22c55e",
      display: "inline-block",
      boxShadow:
        "0 0 10px rgba(34,197,94,.8)",
    }}
  />

  {getUserStatus().text}

</div>

                <p className="text-muted mt-2 mb-4">
                  {profile.role}
                </p>

                <div className="text-start">

                  <p className="mb-3 text-secondary">
                    📧 {profile.email}
                  </p>

                  <p className="mb-3 text-secondary">
                    📞 {profile.phone || "-"}
                  </p>

                  <p className="mb-3 text-secondary">
                    📍 {profile.location || "-"}
                  </p>

                  <p className="mb-0 text-secondary">
                    👤 {profile.role}
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT CARD */}

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-sm"
              style={{
                borderRadius: "18px",
              }}
            >

              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  Edit Information
                </h3>

                <div className="row">

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      className="form-control"
                      value={
                        profile.full_name || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={
                        profile.email || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={
                        profile.phone || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={
                        profile.location || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-md-12 mb-3">

                    <label className="form-label">
                      Avatar URL
                    </label>

                    <input
                      type="text"
                      name="avatar"
                      className="form-control"
                      value={
                        profile.avatar || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div className="col-12 mb-4">

                    <label className="form-label">
                      Bio
                    </label>

                    <textarea
                      rows="4"
                      name="bio"
                      className="form-control"
                      value={
                        profile.bio || ""
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                  <div>

                   <div className="d-flex gap-2">

  <button
    className="btn btn-primary px-4 py-2"
    onClick={saveProfile}
  >
    Save Changes
  </button>

  <button
    className="btn btn-dark px-4 py-2"
    onClick={() =>
      setShowPasswordModal(
        true
      )
    }
  >
    Change Password
  </button>

</div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
{showPasswordModal && (

  <div
    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
    style={{
      background: "rgba(0,0,0,0.55)",
      zIndex: 999999,
    }}
  >

    <div
      className="bg-white p-4 shadow-lg"
      style={{
        width: "500px",
        borderRadius: "20px",
      }}
    >

      <h3 className="fw-bold mb-4">
        Change Password
      </h3>

      {passwordSuccess && (

        <div className="alert alert-success">
          Password changed successfully
        </div>

      )}

      {passwordError && (

        <div className="alert alert-danger">
          {passwordError}
        </div>

      )}

      <div className="mb-3">

        <label className="form-label">
          Current Password
        </label>

       <div className="input-group">

  <input
    type={
      showCurrentPassword
        ? "text"
        : "password"
    }
    className="form-control"
    value={currentPassword}
    onChange={(e) =>
      setCurrentPassword(
        e.target.value
      )
    }
  />

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() =>
      setShowCurrentPassword(
        !showCurrentPassword
      )
    }
  >
    {showCurrentPassword
  ? <FaEyeSlash />
  : <FaEye />
}
  </button>

</div>

      </div>

      <div className="mb-3">

        <label className="form-label">
          New Password
        </label>
<div className="input-group">

  <input
    type={
      showNewPassword
        ? "text"
        : "password"
    }
    className="form-control"
    value={newPassword}
    onChange={(e) =>
      setNewPassword(
        e.target.value
      )
    }
  />

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() =>
      setShowNewPassword(
        !showNewPassword
      )
    }
  >
    {showCurrentPassword
  ? <FaEyeSlash />
  : <FaEye />
}
  </button>

</div>

{newPassword && (

  <small
    className={
      getPasswordStrength()
        .className
    }
  >
    Password Strength:
    {" "}
    {
      getPasswordStrength()
        .text
    }
  </small>

)}

      </div>

      <div className="mb-4">

        <label className="form-label">
          Confirm Password
        </label>

       <div className="input-group">

  <input
    type={
      showConfirmPassword
        ? "text"
        : "password"
    }
    className="form-control"
    value={confirmPassword}
    onChange={(e) =>
      setConfirmPassword(
        e.target.value
      )
    }
  />

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={() =>
      setShowConfirmPassword(
        !showConfirmPassword
      )
    }
  >
   {showCurrentPassword
  ? <FaEyeSlash />
  : <FaEye />
}
  </button>

</div>

      </div>

      <div className="d-flex gap-2">

        <button
          className="btn btn-primary w-100"
          onClick={changePassword}
        >
          Save New Password
        </button>

        <button
          className="btn btn-secondary w-100"
          onClick={() =>
            setShowPasswordModal(
              false
            )
          }
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}
    </MainLayout>

  );

}

export default Profile;