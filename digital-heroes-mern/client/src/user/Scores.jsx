
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Scores = () => {
    const [scores, setScores] = useState([]);
    const [score, setScore] = useState("");
    const [scoreDate, setScoreDate] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const loadScores = async () => {
        try {
            setLoading(true);

            const response = await api.get("/scores/my-scores");
            setScores(response.data.scores || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load scores"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadScores();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setSubmitting(true);

        try {
            await api.post("/scores", {
                score: Number(score),
                scoreDate: scoreDate || undefined,
            });

            setScore("");
            setScoreDate("");
            setMessage("Score added successfully.");
            await loadScores();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to add score"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const deleteScore = async (id) => {
        if (!window.confirm("Delete this score?")) return;

        try {
            setMessage("");
            await api.delete(`/scores/${id}`);
            setMessage("Score deleted successfully.");
            await loadScores();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to delete score"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="scores-page">
            {/* Header */}
            <div className="scores-header">
                <div>
                    <span className="page-label">
                        ⛳ PERFORMANCE TRACKER
                    </span>

                    <h1>My Golf Scores</h1>

                    <p>
                        Track your progress and keep improving
                        your game.
                    </p>
                </div>

                <div className="total-score-card">
                    <span>Total Rounds</span>
                    <strong>{scores.length}</strong>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className="message">
                    <span>✓</span>
                    <p>{message}</p>
                    <button
                        type="button"
                        className="close-message"
                        onClick={() => setMessage("")}
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Add Score Card */}
            <section className="add-score-card">
                <div className="card-heading">
                    <div className="heading-icon">🏌️</div>

                    <div>
                        <h2>Record Your Score</h2>
                        <p>
                            Add a new golf round to your performance
                            history.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="score-form">
                    <div className="input-group">
                        <label htmlFor="score">Golf Score</label>

                        <input
                            id="score"
                            type="number"
                            min="1"
                            max="45"
                            placeholder="Enter score (1–45)"
                            value={score}
                            onChange={(event) =>
                                setScore(event.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="scoreDate">Round Date</label>

                        <input
                            id="scoreDate"
                            type="date"
                            value={scoreDate}
                            onChange={(event) =>
                                setScoreDate(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="add-button"
                        disabled={submitting}
                    >
                        {submitting ? (
                            <>
                                <span className="spinner"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span>＋</span>
                                Add Score
                            </>
                        )}
                    </button>
                </form>
            </section>

            {/* Score History */}
            <section className="history-section">
                <div className="section-header">
                    <div>
                        <h2>Score History</h2>
                        <p>
                            Your recently recorded golf rounds.
                        </p>
                    </div>

                    <span className="round-count">
                        {scores.length} Rounds
                    </span>
                </div>

                {scores.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">⛳</div>
                        <h3>No Scores Yet</h3>
                        <p>
                            Add your first golf score to start
                            tracking your performance.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Score</th>
                                    <th>Round Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {scores.map((item, index) => (
                                    <tr key={item._id}>
                                        <td className="row-number">
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </td>

                                        <td>
                                            <span className="score-badge">
                                                {item.score}
                                            </span>
                                        </td>

                                        <td className="date-cell">
                                            {item.scoreDate
                                                ? new Date(
                                                    item.scoreDate
                                                ).toLocaleDateString(
                                                    "en-IN",
                                                    {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    }
                                                )
                                                : "-"}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteScore(item._id)
                                                }
                                            >
                                                <span>🗑</span>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .scores-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 24px 60px;
        color: #0b1f1a;
    }

    .scores-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 24px;
        margin-bottom: 32px;
    }

    .page-label {
        display: inline-block;
        color: #176b4d;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.6px;
        margin-bottom: 10px;
    }

    .scores-header h1 {
        font-size: clamp(28px, 4vw, 40px);
        line-height: 1.2;
        letter-spacing: -1px;
        margin: 0 0 10px;
        font-weight: 800;
    }

    .scores-header p {
        margin: 0;
        color: #718078;
        font-size: 14px;
        line-height: 1.6;
    }

    .total-score-card {
        min-width: 145px;
        padding: 18px 24px;
        background: linear-gradient(135deg, #0b1f1a, #176b4d);
        border-radius: 16px;
        color: white;
        text-align: center;
        box-shadow: 0 8px 20px rgba(11, 31, 26, 0.12);
    }

    .total-score-card span {
        display: block;
        font-size: 12px;
        opacity: 0.8;
        margin-bottom: 5px;
    }

    .total-score-card strong {
        font-size: 30px;
        font-weight: 800;
    }

    .message {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        margin-bottom: 24px;
        border: 1px solid #cce5d5;
        border-radius: 12px;
        background: #eaf7ee;
        color: #176b4d;
        font-size: 14px;
    }

    .message p {
        flex: 1;
        margin: 0;
    }

    .close-message {
        padding: 0;
        border: none;
        background: transparent;
        color: #176b4d;
        font-size: 20px;
        cursor: pointer;
    }

    .add-score-card {
        padding: 30px;
        border-radius: 20px;
        border: 1px solid #e0ebe4;
        background: white;
        box-shadow: 0 8px 30px rgba(11, 31, 26, 0.05);
        margin-bottom: 36px;
    }

    .card-heading {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 26px;
    }

    .heading-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: #e8f4ec;
        font-size: 23px;
        flex-shrink: 0;
    }

    .card-heading h2 {
        margin: 0 0 5px;
        font-size: 20px;
        font-weight: 750;
    }

    .card-heading p {
        margin: 0;
        color: #718078;
        font-size: 13px;
    }

    .score-form {
        display: grid;
        grid-template-columns: 1fr 1fr auto;
        align-items: end;
        gap: 16px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .input-group label {
        color: #253b31;
        font-size: 13px;
        font-weight: 700;
    }

    .input-group input {
        width: 100%;
        min-width: 0;
        padding: 13px 14px;
        border: 1px solid #d4ded8;
        border-radius: 10px;
        outline: none;
        background: #fcfefd;
        color: #253b31;
        font-size: 14px;
        font-family: inherit;
        transition: 0.2s ease;
    }

    .input-group input:focus {
        border-color: #176b4d;
        box-shadow: 0 0 0 3px rgba(23, 107, 77, 0.08);
    }

    .add-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 46px;
        padding: 13px 20px;
        border: none;
        border-radius: 10px;
        background: linear-gradient(135deg, #0b1f1a, #176b4d);
        color: white;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        white-space: nowrap;
        transition: 0.2s ease;
    }

    .add-button:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(11, 31, 26, 0.16);
    }

    .add-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
    }

    .spinner {
        width: 15px;
        height: 15px;
        border: 2px solid rgba(255, 255, 255, 0.35);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.7s linear infinite;
    }

    .history-section {
        padding: 30px;
        border-radius: 20px;
        border: 1px solid #e0ebe4;
        background: white;
        box-shadow: 0 8px 30px rgba(11, 31, 26, 0.04);
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 15px;
        margin-bottom: 25px;
    }

    .section-header h2 {
        margin: 0 0 6px;
        font-size: 21px;
        font-weight: 750;
    }

    .section-header p {
        margin: 0;
        color: #718078;
        font-size: 13px;
    }

    .round-count {
        padding: 7px 12px;
        border-radius: 20px;
        background: #e8f4ec;
        color: #176b4d;
        font-size: 12px;
        font-weight: 700;
        white-space: nowrap;
    }

    .table-wrapper {
        width: 100%;
        overflow-x: auto;
        border: 1px solid #e4ebe6;
        border-radius: 12px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        min-width: 520px;
    }

    th {
        padding: 15px 18px;
        background: #f5f9f6;
        color: #718078;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        text-align: left;
        white-space: nowrap;
    }

    td {
        padding: 16px 18px;
        border-bottom: 1px solid #edf1ee;
        color: #253b31;
        font-size: 13px;
        vertical-align: middle;
    }

    tbody tr:last-child td {
        border-bottom: none;
    }

    tbody tr {
        transition: background 0.2s ease;
    }

    tbody tr:hover {
        background: #f9fcfa;
    }

    .row-number {
        color: #9aa9a1;
        font-weight: 700;
        font-size: 12px;
    }

    .score-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 42px;
        padding: 7px 12px;
        border-radius: 8px;
        background: #e8f4ec;
        color: #176b4d;
        font-weight: 800;
        font-size: 14px;
    }

    .date-cell {
        color: #718078;
    }

    .delete-button {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        padding: 8px 12px;
        border: 1px solid #ffd5d5;
        border-radius: 8px;
        background: #fff2f2;
        color: #c62828;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: 0.2s ease;
    }

    .delete-button:hover {
        background: #ffe3e3;
        border-color: #ffbaba;
    }

    .empty-state {
        text-align: center;
        padding: 50px 20px;
        border: 1px dashed #cbdcd1;
        border-radius: 14px;
        background: #fbfdfb;
    }

    .empty-icon {
        font-size: 40px;
        margin-bottom: 14px;
    }

    .empty-state h3 {
        margin: 0 0 8px;
        font-size: 19px;
        color: #0b1f1a;
    }

    .empty-state p {
        margin: 0;
        color: #718078;
        font-size: 13px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media (max-width: 900px) {
        .score-form {
            grid-template-columns: 1fr 1fr;
        }

        .add-button {
            width: 100%;
        }
    }

    @media (max-width: 600px) {
        .scores-page {
            padding: 25px 14px 40px;
        }

        .scores-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
        }

        .total-score-card {
            width: 100%;
        }

        .add-score-card,
        .history-section {
            padding: 22px 16px;
            border-radius: 16px;
        }

        .score-form {
            grid-template-columns: 1fr;
        }

        .section-header {
            align-items: flex-start;
            flex-direction: column;
        }

        .table-wrapper {
            border-radius: 10px;
        }

        th,
        td {
            padding: 12px;
        }

        .card-heading h2 {
            font-size: 18px;
        }

        .scores-header h1 {
            font-size: 29px;
        }
    }
`;

export default Scores;