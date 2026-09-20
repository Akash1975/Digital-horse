import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/auth/register`,
                {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }
            );

            const { token, user } = response.data;

            if (token) {
                localStorage.setItem("token", token);
            }

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            setSuccess("Account created successfully!");

            setTimeout(() => {
                navigate(token ? "/dashboard" : "/login");
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Join Digital Heroes</h1>
                    <p>Create your account and get started</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Full Name</label>

                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email Address</label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={6}
                        required
                    />

                    <label htmlFor="confirmPassword">
                        Confirm Password
                    </label>

                    <input
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>

            <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: #f2f6f3;
        }

        .auth-card {
          width: 100%;
          max-width: 430px;
          background: white;
          padding: 38px;
          border-radius: 16px;
          box-shadow: 0 10px 35px rgba(11, 31, 26, 0.12);
        }

        .auth-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .auth-header h1 {
          color: #0b1f1a;
          margin-bottom: 8px;
        }

        .auth-header p {
          color: #718078;
          margin: 0;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        label {
          color: #253b31;
          font-size: 14px;
          font-weight: 600;
          margin-top: 8px;
        }

        input {
          padding: 13px;
          border: 1px solid #d4ded8;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
        }

        input:focus {
          border-color: #0b1f1a;
        }

        button {
          border: none;
          background: #0b1f1a;
          color: white;
          padding: 13px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          margin-top: 12px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .error-message,
        .success-message {
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .error-message {
          background: #ffe8e8;
          color: #b42318;
        }

        .success-message {
          background: #e5f7eb;
          color: #176b4d;
        }

        .auth-footer {
          text-align: center;
          color: #718078;
          font-size: 14px;
          margin: 25px 0 0;
        }

        a {
          color: #176b4d;
          text-decoration: none;
        }
      `}</style>
        </div>
    );
};

export default Signup;