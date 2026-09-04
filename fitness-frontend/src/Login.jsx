import { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import api from "./api/axios";
import "./Login.css";

function Login({ onLogin, onRegister, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

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

  return (
    <div className="login-page">

      {/* Background */}
      <div className="login-background">
        <div className="login-overlay"></div>
        <div className="login-glow login-glow-one"></div>
        <div className="login-glow login-glow-two"></div>
      </div>

      {/* Top Logo */}
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

      {/* Login Main */}
      <main className="login-main">

        {/* Back Button - TOP */}
        <button
          type="button"
          className="login-back"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
            Back to Home
        </button>

        {/* Login Card */}
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
              <label htmlFor="password">
                Password
              </label>

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