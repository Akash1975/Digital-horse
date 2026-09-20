import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadUsers = async () => {
        try {
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

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Users</h1>

            {message && <p>{message}</p>}

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
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.isActive ? "Active" : "Inactive"}</td>
                                <td>
                                    <button
                                        onClick={() =>
                                            updateStatus(user._id, !user.isActive)
                                        }
                                    >
                                        {user.isActive ? "Deactivate" : "Activate"}
                                    </button>
                                </td>
                            </tr>
                        ))}
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

  button {
    padding: 9px 12px;
    border: none;
    border-radius: 7px;
    background: #0b1f1a;
    color: white;
    cursor: pointer;
  }
`;

export default ManageUsers;