import { useEffect, useState } from "react";
import api from "./api/axios";

function Profile({ user, onUserUpdated }) {
  // =========================
  // PROFILE FORM
  // =========================

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // PROFILE IMAGE
  // =========================

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  // =========================
  // LOAD PROFILE IMAGE
  // =========================

  useEffect(() => {
    let objectUrl;

    const loadProfileImage = async () => {
      if (!user?.profileImage || !user?.id) {
        setImagePreview(null);
        return;
      }

      try {
        const response = await api.get(
          `/api/users/${user.id}/profile-image`,
          {
            responseType: "blob",
          }
        );

        objectUrl = URL.createObjectURL(response.data);

        setImagePreview(objectUrl);
      } catch (err) {
        console.error(
          "Profile image load error:",
          err
        );

        setImagePreview(null);
      }
    };

    loadProfileImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user?.id, user?.profileImage]);

  // =========================
  // PASSWORD FORM
  // =========================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // =========================
  // PROFILE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // PROFILE IMAGE CHANGE
  // =========================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    // Check image type
    if (!file.type.startsWith("image/")) {
      setImageError(
        "Please select a valid image file."
      );
      return;
    }

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    setProfileImage(file);

    // Preview selected image
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // =========================
  // UPLOAD PROFILE IMAGE
  // =========================

  const handleProfileImageUpload = async () => {
    if (!profileImage) {
      return;
    }

    setImageLoading(true);
    setImageError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("file", profileImage);

      const response = await api.post(
        `/api/users/${user.id}/profile-image`,
        formData
      );

      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update App.jsx
      onUserUpdated?.(updatedUser);

      // Clear selected file
      setProfileImage(null);

      setMessage(
        "Profile photo updated successfully."
      );

    } catch (err) {
      console.error(
        "Profile image upload error:",
        err
      );

      if (err.response?.status === 401) {
        setImageError(
          "Session expired. Please login again."
        );
      } else {
        setImageError(
          err.response?.data?.message ||
          err.response?.data ||
          "Unable to upload profile photo."
        );
      }

    } finally {
      setImageLoading(false);
    }
  };

  // =========================
  // REMOVE PROFILE IMAGE
  // =========================

  const handleRemoveProfileImage = async () => {
    setImageLoading(true);
    setImageError("");
    setMessage("");

    try {
      const response = await api.delete(
        `/api/users/${user.id}/profile-image`
      );

      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update App.jsx
      onUserUpdated?.(updatedUser);

      setProfileImage(null);
      setImagePreview(null);

      setMessage(
        "Profile photo removed successfully."
      );

    } catch (err) {
      console.error(
        "Profile image remove error:",
        err
      );

      if (err.response?.status === 401) {
        setImageError(
          "Session expired. Please login again."
        );
      } else {
        setImageError(
          err.response?.data?.message ||
          err.response?.data ||
          "Unable to remove profile photo."
        );
      }

    } finally {
      setImageLoading(false);
    }
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put(
        `/api/users/${user.id}`,
        form
      );

      const updatedUser = response.data;

      // Update local storage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update user in App.jsx
      onUserUpdated?.(updatedUser);

      setMessage(
        "Profile updated successfully."
      );

    } catch (err) {
      console.error(
        "Profile update error:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "Session expired. Please login again."
        );
      } else {
        setError(
          err.response?.data?.message ||
          "Unable to update profile."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    // Check empty fields
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    // Check password length
    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    // Check password confirmation
    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordError(
        "New passwords do not match."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(
        `/api/users/${user.id}/password`,
        {
          currentPassword:
            passwordForm.currentPassword,

          newPassword:
            passwordForm.newPassword,
        }
      );

      setPasswordMessage(
        "Password changed successfully."
      );

      // Clear password fields
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      console.error(
        "Password change error:",
        err
      );

      if (err.response?.status === 401) {
        setPasswordError(
          "Session expired. Please login again."
        );
      } else {
        setPasswordError(
          err.response?.data?.message ||
          err.response?.data ||
          "Unable to change password."
        );
      }

    } finally {
      setPasswordLoading(false);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="profile-page">

      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="profile-header">

        <div>

          <p className="eyebrow">
            ACCOUNT
          </p>

          <h1>
            Profile & Settings
          </h1>

          <p className="subtitle">
            Manage your personal information
            and account settings.
          </p>

        </div>

      </div>


      {/* =========================
          PROFILE CARD
      ========================= */}

      <div className="profile-card">

        {/* USER INFORMATION */}

        <div className="profile-user">

          <div className="profile-avatar-wrapper">

            <div className="profile-avatar">

              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt={`${form.firstName} ${form.lastName}`}
                />
              ) : (
                <span>
                  {form.firstName?.charAt(0)?.toUpperCase() || "U"}
                  {form.lastName?.charAt(0)?.toUpperCase() || ""}
                </span>
              )}

            </div>

            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              onChange={handleProfileImageChange}
              hidden
            />

            <label
              htmlFor="profile-image-input"
              className="secondary-button"
            >
              Change Profile Photo
            </label>

            {profileImage && (
              <button
                type="button"
                className="primary-button"
                onClick={handleProfileImageUpload}
                disabled={imageLoading}
              >
                {imageLoading
                  ? "Uploading..."
                  : "Upload Photo"}
              </button>
            )}

            {imagePreview && (
              <button
                type="button"
                className="danger-button"
                onClick={handleRemoveProfileImage}
                disabled={imageLoading}
              >
                Remove Photo
              </button>
            )}

            {imageError && (
              <div className="profile-error">
                {imageError}
              </div>
            )}

          </div>

          <div>

            <h2>
              {form.firstName}{" "}
              {form.lastName}
            </h2>

            <p>
              {form.email}
            </p>

          </div>

        </div>


        {/* =========================
            PROFILE FORM
        ========================= */}

        <form onSubmit={handleSubmit}>

          <div className="profile-form-grid">

            {/* FIRST NAME */}

            <div className="form-field">

              <label>
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                required
              />

            </div>


            {/* LAST NAME */}

            <div className="form-field">

              <label>
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                required
              />

            </div>


            {/* EMAIL */}

            <div className="form-field full">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />

            </div>

          </div>


          {/* PROFILE SUCCESS */}

          {message && (
            <div className="profile-success">
              {message}
            </div>
          )}


          {/* PROFILE ERROR */}

          {error && (
            <div className="profile-error">
              {error}
            </div>
          )}


          {/* SAVE BUTTON */}

          <div className="profile-actions">

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>


        {/* =========================
            CHANGE PASSWORD
        ========================= */}

        <div className="password-section">

          <div className="password-header">

            <p className="eyebrow">
              SECURITY
            </p>

            <h2>
              Change Password
            </h2>

            <p>
              Update your password to keep
              your account secure.
            </p>

          </div>


          {/* PASSWORD FORM */}

          <form
            onSubmit={handlePasswordChange}
          >

            <div className="profile-form-grid">

              {/* CURRENT PASSWORD */}

              <div className="form-field full">

                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  value={
                    passwordForm.currentPassword
                  }
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      currentPassword:
                        e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  required
                />

              </div>


              {/* NEW PASSWORD */}

              <div className="form-field">

                <label>
                  New Password
                </label>

                <input
                  type="password"
                  value={
                    passwordForm.newPassword
                  }
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword:
                        e.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  required
                />

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="form-field">

                <label>
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={
                    passwordForm.confirmPassword
                  }
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword:
                        e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                />

              </div>

            </div>


            {/* PASSWORD SUCCESS */}

            {passwordMessage && (
              <div className="profile-success">
                {passwordMessage}
              </div>
            )}


            {/* PASSWORD ERROR */}

            {passwordError && (
              <div className="profile-error">
                {passwordError}
              </div>
            )}


            {/* CHANGE PASSWORD BUTTON */}

            <div className="profile-actions">

              <button
                type="submit"
                className="primary-button"
                disabled={passwordLoading}
              >
                {passwordLoading
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default Profile;