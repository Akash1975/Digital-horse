import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
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

            const redirectPath = location.state?.from?.pathname || "/dashboard";

            navigate(redirectPath, { replace: true });
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
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to your Digital Heroes account</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="form-options">
                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/signup">Create Account</Link>
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

        .form-options {
          display: flex;
          justify-content: flex-end;
          margin: 8px 0;
        }

        a {
          color: #176b4d;
          text-decoration: none;
          font-size: 14px;
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

        .error-message {
          background: #ffe8e8;
          color: #b42318;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 18px;
          font-size: 14px;
        }

        .auth-footer {
          text-align: center;
          color: #718078;
          font-size: 14px;
          margin: 25px 0 0;
        }
      `}</style>
        </div>
    );
};

export default Login;