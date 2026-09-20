
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
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
        <div className="signup-page">
            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="signup-card">
                <div className="signup-header">
                    <div className="brand-icon">
                        🦸
                    </div>

                    <span className="signup-badge">
                        DIGITAL HEROES
                    </span>

                    <h1>Join Digital Heroes</h1>

                    <p>
                        Create your account and start your journey.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

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
                    </div>

                    <div className="form-group">
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
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account →"}
                    </button>
                </form>

                <div className="signup-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
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
                    🔒 Secure Digital Heroes Registration
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
.signup-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    padding: 35px 20px;
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

.signup-card {
    width: 100%;
    max-width: 460px;

    padding: 40px;
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

.signup-header {
    text-align: center;
    margin-bottom: 28px;
}

.brand-icon {
    width: 65px;
    height: 65px;

    margin: 0 auto 18px;

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

.signup-badge {
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

.signup-header h1 {
    margin: 18px 0 10px;

    color: #f9fafb;
    font-size: 27px;
    font-weight: 750;
    letter-spacing: -0.8px;
}

.signup-header p {
    margin: 0;

    color: #9ca3af;
    font-size: 14px;
    line-height: 1.6;
}

.error-message,
.success-message {
    padding: 13px 15px;
    margin-bottom: 20px;

    border-radius: 10px;
    font-size: 13px;
    line-height: 1.5;
}

.error-message {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(248, 113, 113, 0.25);
    color: #fca5a5;
}

.success-message {
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(52, 211, 153, 0.25);
    color: #6ee7b7;
}

form {
    display: flex;
    flex-direction: column;
}

.form-group {
    margin-bottom: 17px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;

    color: #d1d5db;
    font-size: 13px;
    font-weight: 600;
}

.form-group input {
    width: 100%;
    padding: 13px 15px;

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
    margin-top: 5px;

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

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.signup-footer {
    text-align: center;
    margin-top: 25px;
}

.signup-footer p {
    margin: 0 0 18px;

    color: #9ca3af;
    font-size: 14px;
}

.signup-footer a {
    color: #6ee7b7;
    font-size: 14px;
    font-weight: 600;

    text-decoration: none;
}

.signup-footer a:hover {
    color: #a7f3d0;
    text-decoration: underline;
}

.signup-footer .admin-link {
    display: inline-block;

    padding: 9px 14px;

    border: 1px solid #374151;
    border-radius: 8px;

    color: #a5b4fc;
    font-size: 12px;
}

.signup-footer .admin-link:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: #6366f1;

    color: #c7d2fe;
    text-decoration: none;
}

.security-note {
    text-align: center;

    margin-top: 25px;
    padding-top: 18px;

    border-top: 1px solid #1f2937;

    color: #6b7280;
    font-size: 11px;
    letter-spacing: 0.4px;
}

@media (max-width: 480px) {
    .signup-page {
        padding: 20px 14px;
    }

    .signup-card {
        padding: 32px 22px;
        border-radius: 20px;
    }

    .signup-header h1 {
        font-size: 23px;
    }

    .brand-icon {
        width: 58px;
        height: 58px;
        font-size: 24px;
    }
}
`;

export default Signup;