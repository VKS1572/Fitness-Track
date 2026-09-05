import { useState } from "react";
import api from "./api/axios";
import "./Register.css";

function Register({
  onRegisterSuccess,
  onBackToLogin,
  onRegister,
  onLogin,
  onBackToLanding,
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // REGISTER
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/register", form);

      setSuccess(
        "Verification OTP sent to your email."
      );

      setShowOtp(true);
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // VERIFY OTP
  // ============================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/verify-email", {
        email: form.email,
        otp: otp,
      });

      setSuccess(
        "Email verified successfully! You can now login."
      );

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else if (onRegister) {
          onRegister();
        }
      }, 1200);
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // RESEND OTP
  // ============================

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    try {
      setResending(true);

      await api.post("/api/users/resend-otp", {
        email: form.email,
      });

      setSuccess(
        "A new verification OTP has been sent to your email."
      );

      setOtp("");
    } catch (err) {
      console.error("Resend OTP error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else if (onLogin) {
      onLogin();
    }
  };

  // ============================
  // OTP SCREEN
  // ============================

  if (showOtp) {
    return (
      <div className="auth-page">

        <button
          type="button"
          className="register-back"
          onClick={onBackToLanding}
        >
          ← Back to Home
        </button>

        <div className="auth-card">

          <div className="auth-logo">
            Fit<span>Track</span>
          </div>

          <h1>
            Verify Your Email
          </h1>

          <p className="auth-subtitle">
            We sent a 6-digit verification code to
          </p>

          <p
            style={{
              textAlign: "center",
              fontWeight: "600",
              marginBottom: "24px",
            }}
          >
            {form.email}
          </p>

          <form onSubmit={handleVerifyOtp}>

            <div className="input-group">

              <label>
                Verification OTP
              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
              />

            </div>

            {error && (
              <div className="auth-error">
                {error}
              </div>
            )}

            {success && (
              <div className="auth-success">
                {success}
              </div>
            )}

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify Email"}
            </button>

          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "18px",
            }}
          >
            <span>
              Didn't receive the code?{" "}
            </span>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending}
              style={{
                background: "none",
                border: "none",
                color: "#c9ff38",
                fontWeight: "700",
                cursor: resending
                  ? "not-allowed"
                  : "pointer",
              }}
            >
              {resending
                ? "Sending..."
                : "Resend OTP"}
            </button>
          </div>

          <div className="auth-footer">

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={handleBackToLogin}
            >
              Login
            </button>

          </div>

        </div>

      </div>
    );
  }

  // ============================
  // REGISTER SCREEN
  // ============================

  return (
    <div className="auth-page">

      <button
        type="button"
        className="register-back"
        onClick={onBackToLanding}
      >
        ← Back to Home
      </button>

      <div className="auth-card">

        <div className="auth-logo">
          Fit<span>Track</span>
        </div>

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Start your fitness journey today
        </p>

        <form onSubmit={handleSubmit}>

          <div className="name-row">

            <div className="input-group">

              <label>
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                placeholder="Vikas"
                value={form.firstName}
                onChange={handleChange}
              />

            </div>

            <div className="input-group">

              <label>
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                placeholder="Pradhan"
                value={form.lastName}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="input-group">

            <label>
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />

          </div>

          <div className="input-group">

            <label>
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange}
            />

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}

          <button
            className="auth-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <div className="auth-footer">

          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={handleBackToLogin}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;