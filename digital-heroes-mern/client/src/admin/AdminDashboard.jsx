
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await api.get("/admin/dashboard");

                setStats(response.data.stats || response.data);
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "Unable to load admin dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    const adminActivities = [
        {
            title: "Manage Users",
            description: "View, manage, and control registered users.",
            path: "/admin/users",
            icon: "👥",
        },
        {
            title: "Manage Subscriptions",
            description: "Manage user subscriptions and plans.",
            path: "/admin/subscriptions",
            icon: "💳",
        },
        {
            title: "Manage Draws",
            description: "Create, simulate, and publish draws.",
            path: "/admin/draws",
            icon: "🎲",
        },
        {
            title: "Manage Charities",
            description: "Add, update, and manage charities.",
            path: "/admin/charities",
            icon: "❤️",
        },
        {
            title: "Manage Winners",
            description: "View and manage draw winners.",
            path: "/admin/winners",
            icon: "🏆",
        },
        {
            title: "Analytics",
            description: "View platform statistics and reports.",
            path: "/admin/analytics",
            icon: "📊",
        },
    ];

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage all Digital Heroes activities from one place.</p>
            </div>

            {message && <p className="error-message">{message}</p>}

            {/* Dashboard Statistics */}
            {stats && (
                <section className="stats-section">
                    <h2>Dashboard Statistics</h2>

                    <div className="stats-grid">
                        {Object.entries(stats).map(([key, value]) => (
                            <div className="stat-card" key={key}>
                                <h3>
                                    {key
                                        .replace(/([A-Z])/g, " $1")
                                        .replace(/^./, (char) =>
                                            char.toUpperCase()
                                        )}
                                </h3>

                                <strong>
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </strong>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Admin Activities */}
            <section className="activities-section">
                <h2>Admin Activities</h2>

                <div className="activities-grid">
                    {adminActivities.map((activity) => (
                        <div className="activity-card" key={activity.path}>
                            <div className="activity-icon">
                                {activity.icon}
                            </div>

                            <h3>{activity.title}</h3>

                            <p>{activity.description}</p>

                            <Link
                                to={activity.path}
                                className="manage-button"
                            >
                                Open
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .admin-page {
        max-width: 1250px;
        margin: 0 auto;
        padding: 35px 20px;
    }

    .admin-header {
        margin-bottom: 35px;
    }

    .admin-header h1 {
        margin-bottom: 8px;
        font-size: 32px;
    }

    .admin-header p {
        color: #666;
        font-size: 16px;
    }

    .stats-section,
    .activities-section {
        margin-bottom: 40px;
    }

    .stats-section h2,
    .activities-section h2 {
        margin-bottom: 20px;
        font-size: 24px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(
            auto-fit,
            minmax(200px, 1fr)
        );
        gap: 20px;
    }

    .stat-card {
        padding: 24px;
        background: white;
        border-radius: 14px;
        box-shadow: 0 5px 20px #00000012;
        border-left: 5px solid #4f46e5;
    }

    .stat-card h3 {
        margin-bottom: 12px;
        color: #555;
        font-size: 15px;
    }

    .stat-card strong {
        font-size: 25px;
        overflow-wrap: anywhere;
    }

    .activities-grid {
        display: grid;
        grid-template-columns: repeat(
            auto-fit,
            minmax(250px, 1fr)
        );
        gap: 24px;
    }

    .activity-card {
        padding: 28px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 5px 20px #00000012;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .activity-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 28px #00000020;
    }

    .activity-icon {
        font-size: 38px;
        margin-bottom: 15px;
    }

    .activity-card h3 {
        margin-bottom: 10px;
        font-size: 20px;
    }

    .activity-card p {
        min-height: 45px;
        margin-bottom: 22px;
        color: #666;
        line-height: 1.5;
    }

    .manage-button {
        display: inline-block;
        padding: 11px 22px;
        background: #4f46e5;
        color: white;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.2s ease;
    }

    .manage-button:hover {
        background: #3730a3;
    }

    .error-message {
        padding: 15px;
        margin-bottom: 25px;
        background: #fee2e2;
        color: #b91c1c;
        border-radius: 8px;
    }

    @media (max-width: 600px) {
        .admin-page {
            padding: 25px 15px;
        }

        .admin-header h1 {
            font-size: 26px;
        }

        .activity-card {
            padding: 22px;
        }
    }
`;

export default AdminDashboard;