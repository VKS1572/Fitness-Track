import { useState } from "react";
import api from "./api/axios";
import "./Register.css";

function VerifyEmail({ onLogin, onBackToLogin, onBackToLanding }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // SEND VERIFICATION OTP
  // =========================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/resend-otp", {
        email: email.trim(),
      });

      setOtpSent(true);

      setSuccess(
        "Verification OTP has been sent to your email."
      );
    } catch (err) {
      console.error("Send verification OTP error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to send verification OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // VERIFY EMAIL
  // =========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/users/verify-email", {
        email: email.trim(),
        otp: otp,
      });

      setSuccess(
        "Email verified successfully! You can now login."
      );

      setTimeout(() => {
        if (onLogin) {
          onLogin();
        } else if (onBackToLogin) {
          onBackToLogin();
        }
      }, 1200);
    } catch (err) {
      console.error("Email verification error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // RESEND OTP
  // =========================================

  const handleResendOtp = async () => {
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setResending(true);

      await api.post("/api/users/resend-otp", {
        email: email.trim(),
      });

      setSuccess(
        "A new verification OTP has been sent to your email."
      );

      setOtp("");
    } catch (err) {
      console.error("Resend verification OTP error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to resend OTP."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================================
  // PAGE
  // =========================================

  return (
    <div className="auth-page">

      {/* Back to Home */}

      <button
        type="button"
        className="register-back"
        onClick={onBackToLanding}
      >
        ← Back to Home
      </button>

      <div className="auth-card">

        {/* Logo */}

        <div className="auth-logo">
          Fit<span>Track</span>
        </div>

        {/* Heading */}

        <h1>
          Verify Your Email
        </h1>

        <p className="auth-subtitle">
          Verify your email to access your FitTrack account
        </p>

        {/* Error */}

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        {/* ======================================
            EMAIL FORM
        ====================================== */}

        {!otpSent && (
          <form onSubmit={handleSendOtp}>

            <div className="input-group">

              <label>
                Email
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <button
              className="auth-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Sending OTP..."
                : "Send Verification OTP"}
            </button>

          </form>
        )}

        {/* ======================================
            OTP FORM
        ====================================== */}

        {otpSent && (
          <>
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "13px",
                }}
              >
                Verification code sent to
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#c9ff38",
                  fontSize: "14px",
                  fontWeight: "700",
                  wordBreak: "break-word",
                }}
              >
                {email}
              </p>
            </div>

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

            {/* Resend */}

            <div
              style={{
                textAlign: "center",
                marginTop: "18px",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "12px",
                }}
              >
                Didn't receive the code?{" "}
              </span>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#c9ff38",
                  fontWeight: "700",
                  fontSize: "12px",
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

            {/* Change Email */}

            <div
              style={{
                textAlign: "center",
                marginTop: "14px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "11px",
                  cursor: "pointer",
                }}
              >
                Change email
              </button>
            </div>
          </>
        )}

        {/* Footer */}

        <div className="auth-footer">

          <span>
            Already verified?
          </span>

          <button
            type="button"
            onClick={() => {
              if (onLogin) {
                onLogin();
              } else if (onBackToLogin) {
                onBackToLogin();
              }
            }}
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default VerifyEmail;