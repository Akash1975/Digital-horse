
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import "../pages/styles/Dashboard.css";

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [scores, setScores] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    profileResponse,
                    scoresResponse,
                    subscriptionResponse,
                ] = await Promise.all([
                    api.get("/users/profile"),
                    api.get("/scores/my-scores"),
                    api.get("/subscriptions/my-subscription"),
                ]);

                setProfile(profileResponse.data.user);
                setScores(scoresResponse.data.scores || []);
                setSubscription(
                    subscriptionResponse.data.subscription || null
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="dashboard-page">
            <h1>
                Welcome, {profile?.name || "Hero"} 👋
            </h1>

            <p>Your Digital Heroes overview</p>

            {error && (
                <p className="dashboard-error">{error}</p>
            )}

            <div className="dashboard-cards">
                <div className="dashboard-card">
                    <h3>Total Scores</h3>
                    <strong>{scores.length}</strong>
                </div>

                <div className="dashboard-card">
                    <h3>Subscription</h3>
                    <strong>
                        {subscription?.status || "Not Active"}
                    </strong>
                </div>

                <div className="dashboard-card">
                    <h3>Email</h3>
                    <strong>
                        {profile?.email || "Unavailable"}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;