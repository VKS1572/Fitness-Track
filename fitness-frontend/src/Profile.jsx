import { useEffect, useState } from "react";
import api from "./api/axios";

import {
  Camera,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";

function Profile({ user, onUserUpdated }) {
  // =========================================================
  // PROFILE FORM
  // =========================================================

  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  // =========================================================
  // PASSWORD
  // =========================================================

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // KEEP FORM IN SYNC WITH USER
  // =========================================================

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    });
  }, [user]);

  // =========================================================
  // LOAD PROFILE IMAGE
  // =========================================================

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

  // =========================================================
  // PROFILE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================================
  // PROFILE IMAGE CHANGE
  // =========================================================

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setImageError(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError(
        "Image size must be less than 5 MB."
      );
      return;
    }

    setProfileImage(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // =========================================================
  // UPLOAD PROFILE IMAGE
  // =========================================================

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

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      onUserUpdated?.(updatedUser);

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

  // =========================================================
  // REMOVE PROFILE IMAGE
  // =========================================================

  const handleRemoveProfileImage = async () => {
    setImageLoading(true);
    setImageError("");
    setMessage("");

    try {
      const response = await api.delete(
        `/api/users/${user.id}/profile-image`
      );

      const updatedUser = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

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

  // =========================================================
  // UPDATE PROFILE
  // =========================================================

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

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

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

  // =========================================================
  // PASSWORD INPUT
  // =========================================================

  const handlePasswordInput = (e) => {
    setPasswordForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // =========================================================
  // CHANGE PASSWORD
  // =========================================================

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

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

    if (passwordForm.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

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

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
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

  // =========================================================
  // HELPERS
  // =========================================================

  const firstName =
    form.firstName?.trim() || "";

  const lastName =
    form.lastName?.trim() || "";

  const displayName =
    `${firstName} ${lastName}`.trim() ||
    "Fitness User";

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase() || "FU";

  const passwordLength =
    passwordForm.newPassword.length;

  const passwordStrength =
    passwordLength === 0
      ? 0
      : passwordLength < 6
      ? 33
      : passwordLength < 10
      ? 66
      : 100;

  const passwordStrengthText =
    passwordLength === 0
      ? "Enter a new password"
      : passwordLength < 6
      ? "Too short"
      : passwordLength < 10
      ? "Good password"
      : "Strong password";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="profile-page profile-premium">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="profile-header premium-profile-header">

        <div>

          <div className="profile-eyebrow">
            <span className="profile-eyebrow-dot"></span>
            ACCOUNT
          </div>

          <h1>
            Profile & Settings
          </h1>

          <p className="subtitle">
            Manage your personal information,
            security and account preferences.
          </p>

        </div>

      </div>


      {/* =====================================================
          MAIN PROFILE CARD
      ===================================================== */}

      <div className="profile-card premium-profile-card">

        {/* ===================================================
            PROFILE HERO
        =================================================== */}

        <section className="profile-hero">

          <div className="profile-hero-glow"></div>

          <div className="premium-avatar-column">

            <div className="premium-avatar-ring">

              <div className="profile-avatar premium-avatar">

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={displayName}
                  />
                ) : (
                  <span>
                    {initials}
                  </span>
                )}

              </div>

              <label
                htmlFor="profile-image-input"
                className="avatar-camera-button"
                title="Change profile photo"
              >
                <Camera size={16} />
              </label>

            </div>

            <input
              type="file"
              id="profile-image-input"
              accept="image/*"
              onChange={
                handleProfileImageChange
              }
              hidden
            />

            <div className="avatar-hint">
              JPG, PNG or WEBP · Max 5 MB
            </div>

          </div>


          <div className="profile-hero-info">

            <div className="profile-name-row">

              <h2>
                {displayName}
              </h2>

              <span className="verified-badge">
                <CheckCircle2 size={14} />
                Verified
              </span>

            </div>

            <div className="profile-email-row">
              <Mail size={15} />
              {form.email || "No email available"}
            </div>

            <div className="profile-member-badge">
              <ShieldCheck size={15} />
              FitTrack Member
            </div>

            <div className="profile-photo-actions">

              <label
                htmlFor="profile-image-input"
                className="profile-outline-button"
              >
                <Camera size={16} />
                Change Photo
              </label>

              {profileImage && (
                <button
                  type="button"
                  className="profile-upload-button"
                  onClick={
                    handleProfileImageUpload
                  }
                  disabled={imageLoading}
                >
                  <Upload size={16} />

                  {imageLoading
                    ? "Uploading..."
                    : "Upload Photo"}
                </button>
              )}

              {imagePreview && (
                <button
                  type="button"
                  className="profile-remove-button"
                  onClick={
                    handleRemoveProfileImage
                  }
                  disabled={imageLoading}
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              )}

            </div>

          </div>

        </section>


        {/* GLOBAL IMAGE MESSAGE */}

        {imageError && (
          <div className="premium-alert error">
            <span>!</span>
            {imageError}
          </div>
        )}

        {message && (
          <div className="premium-alert success">
            <Check size={16} />
            {message}
          </div>
        )}


        {/* ===================================================
            PERSONAL INFORMATION
        =================================================== */}

        <section className="profile-settings-section">

          <div className="settings-section-header">

            <div className="settings-section-icon">
              <UserRound size={19} />
            </div>

            <div>
              <div className="settings-section-eyebrow">
                PROFILE
              </div>

              <h3>
                Personal Information
              </h3>

              <p>
                Keep your account information
                up to date.
              </p>
            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div className="premium-profile-grid">

              {/* FIRST NAME */}

              <div className="premium-field">

                <label>
                  First Name
                </label>

                <div className="premium-input-wrapper">

                  <UserRound size={17} />

                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />

                </div>

              </div>


              {/* LAST NAME */}

              <div className="premium-field">

                <label>
                  Last Name
                </label>

                <div className="premium-input-wrapper">

                  <UserRound size={17} />

                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="premium-field full">

                <label>
                  Email Address
                </label>

                <div className="premium-input-wrapper">

                  <Mail size={17} />

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

            </div>


            {error && (
              <div className="premium-alert error">
                <span>!</span>
                {error}
              </div>
            )}


            <div className="premium-form-footer">

              <span className="changes-hint">
                Your information is stored securely.
              </span>

              <button
                type="submit"
                className="premium-primary-button"
                disabled={loading}
              >
                <Save size={16} />

                {loading
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </section>


        {/* ===================================================
            SECURITY
        =================================================== */}

        <section className="profile-settings-section security-section">

          <div className="settings-section-header">

            <div className="settings-section-icon security-icon">
              <LockKeyhole size={19} />
            </div>

            <div>

              <div className="settings-section-eyebrow">
                SECURITY
              </div>

              <h3>
                Change Password
              </h3>

              <p>
                Use a strong password to protect
                your FitTrack account.
              </p>

            </div>

          </div>


          <form
            onSubmit={handlePasswordChange}
          >

            <div className="premium-profile-grid">

              {/* CURRENT PASSWORD */}

              <div className="premium-field full">

                <label>
                  Current Password
                </label>

                <div className="premium-input-wrapper">

                  <KeyRound size={17} />

                  <input
                    type={
                      showCurrentPassword
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={
                      handlePasswordInput
                    }
                    placeholder="Enter current password"
                    required
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowCurrentPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>


              {/* NEW PASSWORD */}

              <div className="premium-field">

                <label>
                  New Password
                </label>

                <div className="premium-input-wrapper">

                  <LockKeyhole size={17} />

                  <input
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={
                      handlePasswordInput
                    }
                    placeholder="Minimum 6 characters"
                    required
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowNewPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    tabIndex={-1}
                  >
                    {showNewPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

                {/* PASSWORD STRENGTH */}

                <div className="password-strength">

                  <div className="strength-track">

                    <div
                      className={`strength-fill strength-${passwordStrength}`}
                      style={{
                        width: `${passwordStrength}%`,
                      }}
                    />

                  </div>

                  <span>
                    {passwordStrengthText}
                  </span>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="premium-field">

                <label>
                  Confirm New Password
                </label>

                <div className="premium-input-wrapper">

                  <LockKeyhole size={17} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={
                      handlePasswordInput
                    }
                    placeholder="Confirm new password"
                    required
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>

                </div>

              </div>

            </div>


            {passwordMessage && (
              <div className="premium-alert success">
                <Check size={16} />
                {passwordMessage}
              </div>
            )}


            {passwordError && (
              <div className="premium-alert error">
                <span>!</span>
                {passwordError}
              </div>
            )}


            <div className="premium-form-footer">

              <span className="changes-hint">
                We recommend using 8+ characters.
              </span>

              <button
                type="submit"
                className="premium-primary-button"
                disabled={passwordLoading}
              >
                <ShieldCheck size={16} />

                {passwordLoading
                  ? "Changing..."
                  : "Change Password"}
              </button>

            </div>

          </form>

        </section>

      </div>

    </div>
  );
}

export default Profile;