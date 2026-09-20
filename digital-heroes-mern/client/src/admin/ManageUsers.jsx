
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const loadUsers = async () => {
        try {
            setLoading(true);

            const response = await api.get("/users");
            setUsers(response.data.users || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Unable to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Update User Status
    const updateStatus = async (userId, isActive) => {
        try {
            await api.patch(`/users/${userId}/status`, {
                isActive,
            });

            setMessage("User status updated.");
            await loadUsers();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to update user status"
            );
        }
    };

    // Delete User
    const deleteUser = async (userId, userRole) => {
        if (userRole === "admin") {
            setMessage("Admin user cannot be deleted.");
            return;
        }

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) return;

        try {
            setDeletingId(userId);
            setMessage("");

            await api.delete(`/users/${userId}`);

            setMessage("User deleted successfully.");

            await loadUsers();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to delete user"
            );
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Users</h1>

            {message && (
                <p className="message">
                    {message}
                </p>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={
                                                user.role === "admin"
                                                    ? "role-badge admin-role"
                                                    : "role-badge user-role"
                                            }
                                        >
                                            {user.role === "admin" ? "Admin" : "User"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.isActive
                                                    ? "status active"
                                                    : "status inactive"
                                            }
                                        >
                                            {user.isActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="actions">
                                        <button
                                            className="status-button"
                                            onClick={() =>
                                                updateStatus(
                                                    user._id,
                                                    !user.isActive
                                                )
                                            }
                                        >
                                            {user.isActive
                                                ? "Deactivate"
                                                : "Activate"}
                                        </button>

                                        <button
                                            className="delete-button"
                                            disabled={deletingId === user._id}
                                            onClick={() =>
                                                deleteUser(user._id, user.role)
                                            }
                                        >
                                            {deletingId === user._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
  .page {
    max-width: 1200px;
    margin: auto;
    padding: 35px 20px;
  }

  .message {
    padding: 12px;
    background: #f3f4f6;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .table-wrapper {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: white;
  }

  th, td {
    padding: 14px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  .status {
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
  }

  .status.active {
    background: #dcfce7;
    color: #166534;
  }

  .status.inactive {
    background: #fee2e2;
    color: #991b1b;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  button {
    padding: 9px 12px;
    border: none;
    border-radius: 7px;
    color: white;
    cursor: pointer;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .status-button {
    background: #0b1f1a;
  }

  .delete-button {
    background: #dc2626;
  }

  .delete-button:hover {
    background: #b91c1c;
  }

  .role-badge {
    display: inline-block;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: capitalize;
}

/* Admin Role */
.admin-role {
    background: #ede9fe;
    color: red;
    border: 1px solid #c4b5fd;
}

/* Normal User Role */
.user-role {
    background: #dbeafe;
    color: #1d4ed8;
    border: 1px solid #93c5fd;
}

  @media (max-width: 768px) {
    .page {
      padding: 20px 12px;
    }

    th, td {
      padding: 10px;
      font-size: 13px;
    }
  }
`;

export default ManageUsers;