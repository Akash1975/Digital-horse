
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

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
            <div className="dashboard-header">
                <div>
                    <span className="dashboard-label">
                        DIGITAL HEROES
                    </span>

                    <h1>
                        Welcome, {profile?.name || "Hero"} 👋
                    </h1>

                    <p>
                        Your Digital Heroes overview
                    </p>
                </div>

                <div className="hero-icon">🦸‍♂️</div>
            </div>

            {error && (
                <div className="dashboard-error">
                    ⚠️ {error}
                </div>
            )}

            <div className="dashboard-cards">
                <div className="dashboard-card score-card">
                    <div className="card-icon">🎯</div>

                    <div className="card-content">
                        <h3>Total Scores</h3>
                        <strong>{scores.length}</strong>
                        <span>Your recorded scores</span>
                    </div>
                </div>

                <div className="dashboard-card subscription-card">
                    <div className="card-icon">💎</div>

                    <div className="card-content">
                        <h3>Subscription</h3>
                        <strong>
                            {subscription?.status || "Not Active"}
                        </strong>
                        <span>Your current plan status</span>
                    </div>
                </div>

                <div className="dashboard-card email-card">
                    <div className="card-icon">📧</div>

                    <div className="card-content">
                        <h3>Email</h3>
                        <strong title={profile?.email}>
                            {profile?.email || "Unavailable"}
                        </strong>
                        <span>Registered email address</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-bottom">
                <div className="overview-card">
                    <div className="section-title">
                        <h2>Account Overview</h2>
                        <span>👤</span>
                    </div>

                    <div className="info-row">
                        <span>Name</span>
                        <strong>
                            {profile?.name || "Unavailable"}
                        </strong>
                    </div>

                    <div className="info-row">
                        <span>Email</span>
                        <strong>
                            {profile?.email || "Unavailable"}
                        </strong>
                    </div>

                    <div className="info-row">
                        <span>Subscription</span>
                        <strong>
                            {subscription?.status || "Not Active"}
                        </strong>
                    </div>

                    <div className="info-row">
                        <span>Total Scores</span>
                        <strong>{scores.length}</strong>
                    </div>
                </div>

                <div className="overview-card">
                    <div className="section-title">
                        <h2>Score Summary</h2>
                        <span>🏆</span>
                    </div>

                    {scores.length > 0 ? (
                        <>
                            <div className="score-summary">
                                <strong>{scores.length}</strong>
                                <span>Total rounds completed</span>
                            </div>

                            <div className="score-list">
                                {scores.slice(0, 5).map((score, index) => (
                                    <div
                                        className="score-item"
                                        key={score._id || index}
                                    >
                                        <span>
                                            Round {index + 1}
                                        </span>

                                        <strong>
                                            {score.score}
                                        </strong>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-score">
                            <span>📊</span>
                            <p>No scores recorded yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    * {
        box-sizing: border-box;
    }

    .dashboard-page {
        width: 100%;
        min-height: 100vh;
        padding: 35px clamp(16px, 4vw, 45px);
        overflow-x: hidden;
        background: #f5f8f6;
        color: #183329;
        font-family: inherit;
    }

    .dashboard-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        width: 100%;
        max-width: 1250px;
        margin: 0 auto 28px;
        padding: clamp(24px, 4vw, 40px);
        border-radius: 24px;
        background: linear-gradient(135deg, #09241a, #216442);
        color: white;
        box-shadow: 0 15px 35px rgba(15, 57, 36, 0.16);
    }

    .dashboard-label {
        display: block;
        margin-bottom: 10px;
        color: #a8e7bd;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 2px;
    }

    .dashboard-header h1 {
        margin: 0;
        color: white;
        font-size: clamp(25px, 4vw, 40px);
        line-height: 1.25;
        overflow-wrap: anywhere;
    }

    .dashboard-header p {
        margin: 12px 0 0;
        color: #d4e9dc;
        font-size: 15px;
    }

    .hero-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 85px;
        height: 85px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        font-size: 40px;
    }

    .dashboard-error {
        width: 100%;
        max-width: 1250px;
        margin: 0 auto 25px;
        padding: 15px 18px;
        border: 1px solid #f2c5c5;
        border-radius: 12px;
        background: #fff0f0;
        color: #b42318;
        font-size: 14px;
        overflow-wrap: anywhere;
    }

    .dashboard-cards {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px;
        width: 100%;
        max-width: 1250px;
        margin: 0 auto 28px;
    }

    .dashboard-card {
        display: flex;
        align-items: flex-start;
        gap: 16px;
        min-width: 0;
        padding: 25px;
        border: 1px solid #e1ebe4;
        border-radius: 18px;
        background: white;
        box-shadow: 0 7px 25px rgba(21, 56, 36, 0.06);
    }

    .card-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: #eaf7ed;
        font-size: 24px;
    }

    .card-content {
        min-width: 0;
    }

    .card-content h3 {
        margin: 0 0 10px;
        color: #6b7d71;
        font-size: 13px;
        font-weight: 700;
    }

    .card-content strong {
        display: block;
        max-width: 100%;
        color: #173d29;
        font-size: clamp(18px, 2vw, 25px);
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .card-content span {
        display: block;
        margin-top: 8px;
        color: #8a998f;
        font-size: 12px;
    }

    .dashboard-bottom {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 25px;
        width: 100%;
        max-width: 1250px;
        margin: 0 auto;
    }

    .overview-card {
        min-width: 0;
        padding: 26px;
        border: 1px solid #e1ebe4;
        border-radius: 20px;
        background: white;
        box-shadow: 0 7px 25px rgba(21, 56, 36, 0.06);
    }

    .section-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e8efe9;
    }

    .section-title h2 {
        margin: 0;
        color: #183b29;
        font-size: 20px;
    }

    .section-title span {
        font-size: 24px;
    }

    .info-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 15px;
        padding: 15px 0;
        border-bottom: 1px solid #edf2ee;
    }

    .info-row:last-child {
        border-bottom: none;
    }

    .info-row span {
        flex-shrink: 0;
        color: #75857a;
        font-size: 14px;
    }

    .info-row strong {
        max-width: 65%;
        color: #234532;
        font-size: 14px;
        text-align: right;
        overflow-wrap: anywhere;
        word-break: break-word;
    }

    .score-summary {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 14px;
        background: #edf8f0;
    }

    .score-summary strong {
        color: #18713d;
        font-size: 32px;
    }

    .score-summary span {
        color: #698170;
        font-size: 13px;
    }

    .score-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .score-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 13px 15px;
        border-radius: 10px;
        background: #f6f9f6;
        color: #64766a;
        font-size: 14px;
    }

    .score-item strong {
        color: #1b6338;
        font-size: 15px;
    }

    .empty-score {
        padding: 30px 15px;
        color: #7c8e81;
        text-align: center;
    }

    .empty-score span {
        font-size: 38px;
    }

    .empty-score p {
        margin: 10px 0 0;
        font-size: 14px;
    }

    @media (max-width: 900px) {
        .dashboard-cards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .dashboard-card:last-child {
            grid-column: 1 / -1;
        }

        .dashboard-bottom {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .dashboard-page {
            padding: 20px 14px;
        }

        .dashboard-header {
            align-items: flex-start;
            padding: 24px 20px;
            border-radius: 18px;
        }

        .dashboard-header h1 {
            font-size: 26px;
        }

        .dashboard-header p {
            font-size: 13px;
        }

        .hero-icon {
            width: 55px;
            height: 55px;
            font-size: 27px;
        }

        .dashboard-cards {
            grid-template-columns: 1fr;
            gap: 15px;
        }

        .dashboard-card:last-child {
            grid-column: auto;
        }

        .dashboard-card {
            padding: 20px;
        }

        .overview-card {
            padding: 20px;
        }

        .section-title h2 {
            font-size: 18px;
        }

        .info-row {
            flex-direction: column;
            gap: 5px;
        }

        .info-row strong {
            max-width: 100%;
            text-align: left;
        }
    }
`;

export default Dashboard;