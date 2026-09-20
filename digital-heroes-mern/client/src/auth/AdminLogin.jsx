import { useState } from "react";
import {
    Link,
    useLocation,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function AdminLogin() {
    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();

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
            const response = await login(formData);

            const loggedInUser =
                response.user ||
                response.data?.user ||
                JSON.parse(
                    localStorage.getItem("user") || "null"
                );

            if (!loggedInUser || loggedInUser.role !== "admin") {
                localStorage.removeItem("token");
                localStorage.removeItem("user");

                throw new Error(
                    "Access denied. Only administrators can log in."
                );
            }

            // Redirect admin to the admin dashboard
            navigate("/admin/dashboard", {
                replace: true,
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                error.message ||
                "Admin login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <span className="admin-badge">
                        ADMIN PANEL
                    </span>

                    <h1>Administrator Login</h1>

                    <p>
                        Sign in to manage Digital Heroes.
                    </p>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="admin-email">
                            Admin Email
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            name="email"
                            placeholder="Enter admin email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <input
                            id="admin-password"
                            type="password"
                            name="password"
                            placeholder="Enter admin password"
                            value={formData.password}
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
                            ? "Signing in..."
                            : "Admin Login"}
                    </button>
                </form>

                <div className="admin-login-footer">
                    <Link to="/login">
                        User Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;