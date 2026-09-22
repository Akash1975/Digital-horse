
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Winnings = () => {
    const [winnings, setWinnings] = useState([]);
    const [proof, setProof] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [submittingId, setSubmittingId] = useState(null);

    const loadWinnings = async () => {
        try {
            const response = await api.get("/winners/my-winners");
            setWinnings(response.data.winners || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load winnings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWinnings();
    }, []);

    const submitProof = async (winnerId) => {
        if (!proof[winnerId]?.trim()) {
            setMessage("Please enter a proof URL.");
            return;
        }

        try {
            setSubmittingId(winnerId);
            setMessage("");

            await api.patch(`/winners/${winnerId}/proof`, {
                proofImage: proof[winnerId],
            });

            setMessage("Proof submitted successfully.");
            await loadWinnings();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to submit proof"
            );
        } finally {
            setSubmittingId(null);
        }
    };

    const getStatusClass = (status) => {
        return status?.toLowerCase().replace(/\s+/g, "-") || "pending";
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="winnings-page">
            <div className="winnings-header">
                <div>
                    <span className="header-label">YOUR REWARDS</span>
                    <h1>My Winnings 🏆</h1>
                    <p>
                        Track your prizes, verification, and payout status.
                    </p>
                </div>

                <div className="trophy-circle">🏆</div>
            </div>

            {message && (
                <div className="winnings-message">
                    <span>ⓘ</span>
                    {message}
                </div>
            )}

            {winnings.length === 0 ? (
                <div className="empty-winnings">
                    <div className="empty-icon">🎁</div>
                    <h2>No Winnings Yet</h2>
                    <p>
                        Your winning records will appear here after you win
                        a draw.
                    </p>
                </div>
            ) : (
                <div className="winnings-grid">
                    {winnings.map((winner) => (
                        <div className="winning-card" key={winner._id}>
                            <div className="card-top">
                                <div className="match-icon">🎯</div>

                                <span
                                    className={`status-badge ${getStatusClass(
                                        winner.verificationStatus
                                    )}`}
                                >
                                    {winner.verificationStatus}
                                </span>
                            </div>

                            <h2>{winner.matchType} Matches</h2>

                            <div className="prize-box">
                                <span className="prize-label">
                                    PRIZE AMOUNT
                                </span>
                                <strong>₹{winner.prizeAmount}</strong>
                            </div>

                            <div className="winning-details">
                                <div className="detail-row">
                                    <span>Verification</span>
                                    <strong
                                        className={getStatusClass(
                                            winner.verificationStatus
                                        )}
                                    >
                                        {winner.verificationStatus}
                                    </strong>
                                </div>

                                <div className="detail-row">
                                    <span>Payout</span>
                                    <strong
                                        className={getStatusClass(
                                            winner.payoutStatus
                                        )}
                                    >
                                        {winner.payoutStatus}
                                    </strong>
                                </div>
                            </div>

                            {winner.verificationStatus !== "approved" && (
                                <div className="proof-section">
                                    <h3>Submit Proof</h3>
                                    <p>
                                        Add an image URL to verify your
                                        winning entry.
                                    </p>

                                    <input
                                        type="url"
                                        placeholder="https://example.com/proof.jpg"
                                        value={proof[winner._id] || ""}
                                        onChange={(event) =>
                                            setProof({
                                                ...proof,
                                                [winner._id]:
                                                    event.target.value,
                                            })
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            submitProof(winner._id)
                                        }
                                        disabled={
                                            submittingId === winner._id
                                        }
                                    >
                                        {submittingId === winner._id
                                            ? "Submitting..."
                                            : "Submit Proof →"}
                                    </button>
                                </div>
                            )}

                            {winner.verificationStatus === "approved" && (
                                <div className="approved-box">
                                    ✓ Your proof has been approved
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .winnings-page {
        min-height: 100vh;
        max-width: 1150px;
        margin: 0 auto;
        padding: 45px 24px;
        box-sizing: border-box;
        color: #172b25;
        font-family: inherit;
    }

    .winnings-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 25px;
        padding: 35px;
        margin-bottom: 28px;
        border-radius: 24px;
        background: linear-gradient(135deg, #0b1f1a, #174b38);
        color: white;
        box-shadow: 0 15px 40px rgba(11, 31, 26, 0.18);
    }
    .winnings-page {
    min-height: 100vh;
    max-width: 1150px;
    margin: 0 auto;
    padding: 45px 24px;
    box-sizing: border-box;
    color: #172b25;
    font-family: inherit;
    background: linear-gradient(135deg, #f5f8f6, #eaf4ed);
}

    .header-label {
        display: inline-block;
        margin-bottom: 10px;
        color: #a7e9bf;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 2px;
    }

    .winnings-header h1 {
        margin: 0;
        font-size: clamp(28px, 4vw, 42px);
        font-weight: 800;
    }

    .winnings-header p {
        margin: 12px 0 0;
        color: #d2e5da;
        font-size: 15px;
    }

    .trophy-circle {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 90px;
        height: 90px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.12);
        font-size: 42px;
    }

    .winnings-message {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 25px;
        padding: 14px 18px;
        border: 1px solid #cce5d5;
        border-radius: 12px;
        background: #effaf2;
        color: #205c39;
        font-size: 14px;
        font-weight: 600;
    }

    .winnings-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 25px;
    }

    .winning-card {
        padding: 25px;
        border: 1px solid #e5ece7;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 8px 30px rgba(19, 50, 35, 0.07);
        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .winning-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 14px 35px rgba(19, 50, 35, 0.12);
    }

    .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 18px;
    }

    .match-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: #edf8ef;
        font-size: 25px;
    }

    .winning-card h2 {
        margin: 0 0 20px;
        color: #102d20;
        font-size: 22px;
    }

    .status-badge {
        padding: 7px 11px;
        border-radius: 30px;
        background: #f0f0f0;
        color: #555;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.4px;
        text-transform: capitalize;
    }

    .status-badge.approved {
        background: #dff7e7;
        color: #16703b;
    }

    .status-badge.pending {
        background: #fff3d5;
        color: #996b00;
    }

    .status-badge.rejected {
        background: #ffe3e3;
        color: #b42318;
    }

    .prize-box {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 20px;
        border: 1px solid #d9f0df;
        border-radius: 15px;
        background: linear-gradient(135deg, #f1fbf3, #e7f6eb);
    }

    .prize-label {
        color: #60806b;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1px;
    }

    .prize-box strong {
        color: #0e6335;
        font-size: 32px;
    }

    .winning-details {
        margin: 20px 0;
    }

    .detail-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 13px 0;
        border-bottom: 1px solid #edf1ee;
        color: #68776e;
        font-size: 14px;
    }

    .detail-row strong {
        color: #263d30;
        font-size: 13px;
        text-transform: capitalize;
    }

    .detail-row strong.approved {
        color: #168044;
    }

    .detail-row strong.pending {
        color: #a97800;
    }

    .detail-row strong.rejected {
        color: #c22b2b;
    }

    .proof-section {
        margin-top: 22px;
        padding-top: 20px;
        border-top: 1px solid #e8eee9;
    }

    .proof-section h3 {
        margin: 0 0 6px;
        color: #183b29;
        font-size: 17px;
    }

    .proof-section p {
        margin: 0 0 15px;
        color: #78867d;
        font-size: 13px;
        line-height: 1.5;
    }

    .proof-section input {
        display: block;
        width: 100%;
        box-sizing: border-box;
        margin: 0 0 13px;
        padding: 13px 14px;
        border: 1px solid #dce6df;
        border-radius: 10px;
        outline: none;
        background: #fbfdfb;
        color: #243c2d;
        font-family: inherit;
        font-size: 13px;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .proof-section input:focus {
        border-color: #328354;
        box-shadow: 0 0 0 3px rgba(50, 131, 84, 0.1);
    }

    .proof-section button {
        width: 100%;
        padding: 13px 18px;
        border: none;
        border-radius: 10px;
        background: linear-gradient(135deg, #0b1f1a, #246b45);
        color: white;
        font-family: inherit;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .proof-section button:hover {
        transform: translateY(-2px);
    }

    .proof-section button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        transform: none;
    }

    .approved-box {
        margin-top: 20px;
        padding: 13px;
        border-radius: 10px;
        background: #eaf9ee;
        color: #18743d;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
    }

    .empty-winnings {
        padding: 70px 25px;
        border: 1px dashed #cbded0;
        border-radius: 20px;
        background: #f8fcf9;
        text-align: center;
    }

    .empty-icon {
        margin-bottom: 15px;
        font-size: 55px;
    }

    .empty-winnings h2 {
        margin: 0 0 10px;
        color: #183b29;
        font-size: 25px;
    }

    .empty-winnings p {
        max-width: 420px;
        margin: auto;
        color: #738379;
        font-size: 14px;
        line-height: 1.6;
    }

    @media (max-width: 768px) {
        .winnings-page {
            padding: 25px 15px;
        }

        .winnings-header {
            padding: 25px;
            border-radius: 18px;
        }

        .trophy-circle {
            min-width: 65px;
            height: 65px;
            font-size: 30px;
        }

        .winnings-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 480px) {
        .winnings-header {
            align-items: flex-start;
        }

        .winnings-header h1 {
            font-size: 27px;
        }

        .winnings-header p {
            font-size: 13px;
        }

        .trophy-circle {
            min-width: 48px;
            height: 48px;
            font-size: 23px;
        }

        .winning-card {
            padding: 20px;
        }

        .winning-card h2 {
            font-size: 19px;
        }

        .prize-box strong {
            font-size: 28px;
        }

        .detail-row {
            font-size: 13px;
        }
    }
`;

export default Winnings;