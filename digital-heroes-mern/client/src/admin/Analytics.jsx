import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Analytics = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                setStats(response.data.stats || response.data);
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "Unable to load analytics"
                );
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Analytics</h1>

            {message && <p>{message}</p>}

            <div className="analytics-grid">
                {Object.entries(stats || {}).map(([key, value]) => (
                    <div className="card" key={key}>
                        <h3>{key}</h3>
                        <p>
                            {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                        </p>
                    </div>
                ))}
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

  .analytics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 20px;
  }

  .card {
    background: white;
    padding: 22px;
    border-radius: 14px;
    box-shadow: 0 5px 20px #00000012;
  }

  .card p {
    overflow-wrap: anywhere;
  }
`;

export default Analytics;