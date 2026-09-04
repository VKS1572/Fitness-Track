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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

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
        "Account created successfully! You can now login."
      );

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else if (onRegister) {
          onRegister();
        }
      }, 1200);
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

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else if (onLogin) {
      onLogin();
    }
  };

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

        {/* =================================================
            FITTRACK LOGO
        ================================================= */}

        <div className="auth-logo">
          Fit<span>Track</span>
        </div>


        {/* =================================================
            HEADING
        ================================================= */}

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Start your fitness journey today
        </p>


        {/* =================================================
            REGISTER FORM
        ================================================= */}

        <form onSubmit={handleSubmit}>

          {/* NAME */}

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


          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div className="auth-success">
              {success}
            </div>
          )}


          {/* CREATE ACCOUNT */}

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


        {/* =================================================
            LOGIN LINK
        ================================================= */}

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