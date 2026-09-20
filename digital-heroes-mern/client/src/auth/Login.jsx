
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      const redirectPath =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectPath, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-login-page">
      {/* Background Decorations */}
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <div className="user-login-card">
        {/* Header */}
        <div className="user-login-header">
          <div className="brand-icon">
            🦸
          </div>

          <span className="user-badge">
            DIGITAL HEROES
          </span>

          <h1>Welcome Back</h1>

          <p>
            Sign in to continue your Digital Heroes journey.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user-email">
              Email Address
            </label>

            <input
              id="user-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="user-password">
              Password
            </label>

            <input
              id="user-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-options">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Login →"}
          </button>
        </form>

        {/* Footer */}
        <div className="user-login-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </p>

          <Link
            to="/admin/login"
            className="admin-link"
          >
            🛡️ Administrator Login
          </Link>
        </div>

        <div className="security-note">
          🔒 Secure Digital Heroes Access
        </div>
      </div>

      <style>{styles}</style>
    </div>
  );
};

const styles = `
/* ===============================
   USER LOGIN PAGE
================================ */

.user-login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 30px 20px;
    position: relative;
    overflow: hidden;

    background:
        radial-gradient(
            circle at 20% 20%,
            rgba(16, 185, 129, 0.18),
            transparent 35%
        ),
        radial-gradient(
            circle at 80% 80%,
            rgba(6, 182, 212, 0.12),
            transparent 35%
        ),
        #080d1a;

    font-family: "Inter", "Segoe UI", sans-serif;
    box-sizing: border-box;
}

/* ===============================
   BACKGROUND GLOW
================================ */

.glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
}

.glow-one {
    width: 300px;
    height: 300px;

    background: rgba(16, 185, 129, 0.15);

    top: -100px;
    left: -100px;
}

.glow-two {
    width: 280px;
    height: 280px;

    background: rgba(6, 182, 212, 0.1);

    bottom: -100px;
    right: -100px;
}

/* ===============================
   LOGIN CARD
================================ */

.user-login-card {
    width: 100%;
    max-width: 460px;

    padding: 45px 40px;

    position: relative;
    z-index: 1;

    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;

    background: rgba(17, 24, 39, 0.92);

    box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);

    backdrop-filter: blur(18px);

    color: white;
    box-sizing: border-box;
}

/* ===============================
   HEADER
================================ */

.user-login-header {
    text-align: center;
    margin-bottom: 30px;
}

.brand-icon {
    width: 65px;
    height: 65px;

    margin: 0 auto 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 18px;

    background: linear-gradient(
        135deg,
        #059669,
        #0d9488
    );

    font-size: 28px;

    box-shadow:
        0 10px 30px rgba(5, 150, 105, 0.3);
}

.user-badge {
    display: inline-block;

    padding: 6px 12px;

    border-radius: 30px;

    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(52, 211, 153, 0.25);

    color: #6ee7b7;

    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1.5px;
}

.user-login-header h1 {
    margin: 18px 0 10px;

    font-size: 29px;
    font-weight: 750;
    letter-spacing: -0.8px;

    color: #f9fafb;
}

.user-login-header p {
    margin: 0;

    font-size: 14px;
    line-height: 1.6;

    color: #9ca3af;
}

/* ===============================
   ERROR MESSAGE
================================ */

.error-message {
    padding: 13px 15px;
    margin-bottom: 22px;

    border-radius: 10px;

    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(248, 113, 113, 0.25);

    color: #fca5a5;

    font-size: 13px;
    line-height: 1.5;
}

/* ===============================
   FORM
================================ */

.form-group {
    margin-bottom: 22px;
}

.form-group label {
    display: block;

    margin-bottom: 9px;

    color: #d1d5db;

    font-size: 13px;
    font-weight: 600;
}

.form-group input {
    width: 100%;

    padding: 14px 15px;

    border: 1px solid #374151;
    border-radius: 10px;

    background: #111827;

    color: #f9fafb;

    font-size: 14px;

    outline: none;
    box-sizing: border-box;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        background 0.2s ease;
}

.form-group input::placeholder {
    color: #6b7280;
}

.form-group input:hover {
    border-color: #4b5563;
}

.form-group input:focus {
    border-color: #10b981;

    background: #151d2d;

    box-shadow:
        0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* ===============================
   FORGOT PASSWORD
================================ */

.form-options {
    display: flex;
    justify-content: flex-end;

    margin: 8px 0;
}

.form-options a {
    color: #6ee7b7;

    font-size: 13px;
    text-decoration: none;

    transition: color 0.2s ease;
}

.form-options a:hover {
    color: #a7f3d0;
    text-decoration: underline;
}

/* ===============================
   LOGIN BUTTON
================================ */

.btn {
    width: 100%;

    padding: 15px;

    border: none;
    border-radius: 10px;

    font-size: 14px;
    font-weight: 700;

    cursor: pointer;

    transition:
        transform 0.2s ease,
        box-shadow 0.2s ease,
        opacity 0.2s ease;
}

.btn-primary {
    background: linear-gradient(
        135deg,
        #10b981,
        #059669
    );

    color: white;

    box-shadow:
        0 8px 25px rgba(5, 150, 105, 0.25);
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);

    box-shadow:
        0 12px 30px rgba(5, 150, 105, 0.4);
}

.btn-primary:active:not(:disabled) {
    transform: translateY(0);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ===============================
   FOOTER
================================ */

.user-login-footer {
    text-align: center;
    margin-top: 25px;
}

.user-login-footer p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0 0 18px;
}

.user-login-footer a {
    color: #6ee7b7;

    font-size: 14px;
    font-weight: 600;

    text-decoration: none;

    transition: color 0.2s ease;
}

.user-login-footer a:hover {
    color: #a7f3d0;
    text-decoration: underline;
}

.user-login-footer .admin-link {
    display: inline-block;

    padding: 9px 14px;

    border: 1px solid #374151;
    border-radius: 8px;

    color: #a5b4fc;
    font-size: 12px;

    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}

.user-login-footer .admin-link:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: #6366f1;

    color: #c7d2fe;
    text-decoration: none;
}

/* ===============================
   SECURITY NOTE
================================ */

.security-note {
    text-align: center;

    margin-top: 30px;
    padding-top: 20px;

    border-top: 1px solid #1f2937;

    color: #6b7280;

    font-size: 11px;
    letter-spacing: 0.4px;
}

/* ===============================
   RESPONSIVE
================================ */

@media (max-width: 480px) {
    .user-login-page {
        padding: 20px 14px;
    }

    .user-login-card {
        padding: 35px 22px;
        border-radius: 20px;
    }

    .user-login-header h1 {
        font-size: 24px;
    }

    .brand-icon {
        width: 58px;
        height: 58px;
        font-size: 24px;
    }
}
`;

export default Login;