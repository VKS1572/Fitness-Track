import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import api from "./api/axios";
import "./Login.css";

function Login({ onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState("email");

  const [forgotEmail, setForgotEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post("/api/users/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      onLogin(user);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================

  const openForgotPassword = () => {
    setShowForgotPassword(true);
    setForgotStep("email");
    setForgotEmail(email);
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setForgotStep("email");
    setError("");
    setSuccess("");
  };

  const handleSendResetOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!forgotEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/forgot-password", {
        email: forgotEmail,
      });

      setSuccess(
        "If an account exists with this email, a reset OTP has been sent."
      );

      setForgotStep("otp");
    } catch (err) {
      console.error("Forgot password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to process your request."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!resetOtp || resetOtp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/verify-reset-otp", {
        email: forgotEmail,
        otp: resetOtp,
      });

      setSuccess("OTP verified successfully.");

      setForgotStep("password");
    } catch (err) {
      console.error("Reset OTP error:", err);

      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/reset-password", {
        email: forgotEmail,
        otp: resetOtp,
        newPassword: newPassword,
      });

      setSuccess(
        "Password reset successfully. You can now login."
      );

      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep("email");
        setEmail(forgotEmail);
        setPassword("");
        setResetOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FORGOT PASSWORD SCREEN
  // ==========================================

  if (showForgotPassword) {
    return (
      <div className="login-page">

        <div className="login-background">
          <div className="login-overlay"></div>
          <div className="login-glow login-glow-one"></div>
          <div className="login-glow login-glow-two"></div>
        </div>

        <header className="login-navbar">
          <div className="login-brand">
            <div className="login-logo-mark">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <span className="login-logo-text">
              Fit<span>Track</span>
            </span>
          </div>
        </header>

        <main className="login-main">

          <button
            type="button"
            className="login-back"
            onClick={onBack}
          >
            <ArrowLeft size={15} />
            Back to Home
          </button>

          <div className="login-card">

            {/* EMAIL STEP */}
            {forgotStep === "email" && (
              <>
                <div className="login-card-top">
                  <span className="login-eyebrow">
                    ACCOUNT RECOVERY
                  </span>

                  <h1>Forgot Password?</h1>

                  <p>
                    Enter your email and we'll send you a
                    verification code.
                  </p>
                </div>

                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="login-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSendResetOtp}>

                  <div className="login-field">
                    <label htmlFor="forgot-email">
                      Email
                    </label>

                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={(e) =>
                        setForgotEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "Sending..."
                        : "Send Verification Code"}
                    </span>

                    {!loading && (
                      <ArrowUpRight size={18} />
                    )}
                  </button>

                </form>

                <button
                  type="button"
                  className="back-login-button"
                  onClick={backToLogin}
                >
                  <ArrowLeft size={15} />
                  Back to Login
                </button>
              </>
            )}

            {/* OTP STEP */}
            {forgotStep === "otp" && (
              <>
                <div className="login-card-top">
                  <span className="login-eyebrow">
                    VERIFY EMAIL
                  </span>

                  <h1>Enter OTP</h1>

                  <p>
                    Enter the 6-digit code sent to
                  </p>

                  <strong className="reset-email">
                    {forgotEmail}
                  </strong>
                </div>

                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="login-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleVerifyResetOtp}>

                  <div className="login-field">
                    <label htmlFor="reset-otp">
                      Verification OTP
                    </label>

                    <input
                      id="reset-otp"
                      type="text"
                      inputMode="numeric"
                      maxLength="6"
                      value={resetOtp}
                      onChange={(e) =>
                        setResetOtp(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 6)
                        )
                      }
                      placeholder="Enter 6-digit OTP"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "Verifying..."
                        : "Verify OTP"}
                    </span>

                    {!loading && (
                      <ArrowUpRight size={18} />
                    )}
                  </button>

                </form>

                <button
                  type="button"
                  className="back-login-button"
                  onClick={() => {
                    setForgotStep("email");
                    setError("");
                    setSuccess("");
                  }}
                >
                  <ArrowLeft size={15} />
                  Change Email
                </button>
              </>
            )}

            {/* PASSWORD STEP */}
            {forgotStep === "password" && (
              <>
                <div className="login-card-top">
                  <span className="login-eyebrow">
                    NEW PASSWORD
                  </span>

                  <h1>Reset Password</h1>

                  <p>
                    Create a new password for your FitTrack
                    account.
                  </p>
                </div>

                {error && (
                  <div className="login-error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="login-success">
                    {success}
                  </div>
                )}

                <form onSubmit={handleResetPassword}>

                  <div className="login-field">
                    <label htmlFor="new-password">
                      New Password
                    </label>

                    <input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) =>
                        setNewPassword(e.target.value)
                      }
                      placeholder="Minimum 6 characters"
                      required
                    />
                  </div>

                  <div className="login-field">
                    <label htmlFor="confirm-password">
                      Confirm Password
                    </label>

                    <input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Re-enter your password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="login-submit"
                    disabled={loading}
                  >
                    <span>
                      {loading
                        ? "Resetting..."
                        : "Reset Password"}
                    </span>

                    {!loading && (
                      <ArrowUpRight size={18} />
                    )}
                  </button>

                </form>
              </>
            )}

          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  return (
    <div className="login-page">

      <div className="login-background">
        <div className="login-overlay"></div>
        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>
      </div>

      <header className="login-navbar">
        <div className="login-brand">
          <div className="login-logo-mark">
            <span></span>
            <span></span>
            <span></span>
          </div>

          <span className="login-logo-text">
            Fit<span>Track</span>
          </span>
        </div>
      </header>

      <main className="login-main">

        <button
          type="button"
          className="login-back"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          Back to Home
        </button>

        <div className="login-card">

          <div className="login-card-top">
            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>Welcome Back</h1>

            <p>
              Sign in to continue to FitTrack
            </p>
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {success && (
            <div className="login-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="login-field">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={openForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Sign In"}
              </span>

              {!loading && (
                <ArrowUpRight size={18} />
              )}
            </button>

          </form>

          <div className="login-divider">
            <span></span>
            <small>OR</small>
            <span></span>
          </div>

          <div className="login-footer">
            <span>Don't have an account?</span>

            <button
              type="button"
              onClick={onRegister}
            >
              Create Account
              <ArrowUpRight size={15} />
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;