import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadSubscriptions = async () => {
            try {
                const response = await api.get("/payments");
                setSubscriptions(response.data.subscriptions || response.data.payments || []);
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "Unable to load subscriptions"
                );
            } finally {
                setLoading(false);
            }
        };

        loadSubscriptions();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Subscriptions</h1>

            {message && <p>{message}</p>}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment Type</th>
                        </tr>
                    </thead>

                    <tbody>
                        {subscriptions.map((item) => (
                            <tr key={item._id}>
                                <td>{item.user?.email || item.user || "-"}</td>
                                <td>₹{item.amount || "-"}</td>
                                <td>{item.status}</td>
                                <td>{item.paymentType || item.plan || "-"}</td>
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
`;

export default ManageSubscriptions;