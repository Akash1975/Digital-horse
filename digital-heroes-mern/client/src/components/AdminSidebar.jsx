
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();

    const menuItems = [
        {
            title: "Dashboard",
            path: "/admin/dashboard",
            icon: "📊",
        },
        {
            title: "Manage Users",
            path: "/admin/users",
            icon: "👥",
        },
        {
            title: "Subscriptions",
            path: "/admin/subscriptions",
            icon: "💳",
        },
        {
            title: "Manage Draws",
            path: "/admin/draws",
            icon: "🎲",
        },
        {
            title: "Manage Charities",
            path: "/admin/charities",
            icon: "❤️",
        },
        {
            title: "Manage Winners",
            path: "/admin/winners",
            icon: "🏆",
        },
        {
            title: "Analytics",
            path: "/admin/analytics",
            icon: "📈",
        },
    ];

    const handleLogout = () => {
        logoutUser();
        navigate("/admin/login");
    };

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>Digital Heroes</h2>
                <span>Admin Panel</span>
            </div>

            <nav className="sidebar-menu">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span>{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="back-button"
                    onClick={() => navigate("/")}
                >
                    🏠 Visit Website
                </button>

                <button
                    className="logout-button"
                    onClick={() => navigate("/admin/login")}
                >
                    🚪 Logout
                </button>
            </div>

            <style>{styles}</style>
        </aside>
    );
};

const styles = `
    .admin-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;

        display: flex;
        flex-direction: column;

        width: 260px;
        height: 100vh;

        padding: 24px 16px;

        background: #111827;
        color: white;
        box-sizing: border-box;
    }

    .sidebar-header {
        padding: 8px 12px 25px;
        border-bottom: 1px solid #374151;
    }

    .sidebar-header h2 {
        margin: 0 0 8px;
        font-size: 22px;
    }

    .sidebar-header span {
        color: #9ca3af;
        font-size: 13px;
    }

    .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 7px;

        margin-top: 25px;
        overflow-y: auto;
    }

    .sidebar-link {
        display: flex;
        align-items: center;
        gap: 12px;

        padding: 13px 14px;

        color: #d1d5db;
        border-radius: 9px;
        text-decoration: none;
        font-size: 15px;

        transition: 0.2s ease;
    }

    .sidebar-link:hover {
        background: #374151;
        color: white;
    }

    .sidebar-link.active {
        background: #4f46e5;
        color: white;
        font-weight: 600;
    }

    .sidebar-icon {
        width: 25px;
        font-size: 18px;
    }

    .sidebar-footer {
        display: flex;
        flex-direction: column;
        gap: 10px;

        margin-top: auto;
        padding-top: 20px;
        border-top: 1px solid #374151;
    }

    .back-button,
    .logout-button {
        width: 100%;
        padding: 12px;

        border: none;
        border-radius: 8px;

        cursor: pointer;
        font-size: 14px;
        text-align: left;
    }

    .back-button {
        background: #374151;
        color: white;
    }

    .logout-button {
        background: #dc2626;
        color: white;
    }

    .back-button:hover {
        background: #4b5563;
    }

    .logout-button:hover {
        background: #b91c1c;
    }

    @media (max-width: 768px) {
        .admin-sidebar {
            width: 220px;
        }
    }
`;

export default AdminSidebar;