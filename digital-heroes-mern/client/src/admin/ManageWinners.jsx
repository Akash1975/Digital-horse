import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageWinners = () => {
    const [winners, setWinners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadWinners = async () => {
        try {
            const response = await api.get("/admin/winners");
            setWinners(response.data.winners || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load winners"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWinners();
    }, []);

    const reviewWinner = async (id, status) => {
        try {
            await api.patch(`/winners/${id}/review`, {
                status,
                comment: `Winner ${status} by administrator`,
            });

            setMessage(`Winner ${status}.`);
            await loadWinners();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to review winner"
            );
        }
    };

    const updatePayout = async (id) => {
        try {
            await api.patch(`/winners/${id}/payout`, {
                status: "paid",
            });

            setMessage("Payout updated.");
            await loadWinners();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to update payout"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Winners</h1>

            {message && <p>{message}</p>}

            {winners.map((winner) => (
                <div className="card" key={winner._id}>
                    <h2>{winner.user?.name || "Winner"}</h2>
                    <p>Match Type: {winner.matchType}</p>
                    <p>Prize: ₹{winner.prizeAmount}</p>
                    <p>
                        Verification: {winner.verificationStatus}
                    </p>
                    <p>Payout: {winner.payoutStatus}</p>

                    {winner.verificationStatus === "pending" && (
                        <>
                            <button
                                onClick={() =>
                                    reviewWinner(winner._id, "approved")
                                }
                            >
                                Approve
                            </button>

                            <button
                                onClick={() =>
                                    reviewWinner(winner._id, "rejected")
                                }
                            >
                                Reject
                            </button>
                        </>
                    )}

                    {winner.verificationStatus === "approved" &&
                        winner.payoutStatus !== "paid" && (
                            <button
                                onClick={() => updatePayout(winner._id)}
                            >
                                Mark Paid
                            </button>
                        )}
                </div>
            ))}

            <style>{styles}</style>
        </div>
    );
};

const styles = `
  .page {
    max-width: 1100px;
    margin: auto;
    padding: 35px 20px;
  }

  .card {
    background: white;
    padding: 22px;
    margin-bottom: 20px;
    border-radius: 14px;
    box-shadow: 0 5px 20px #00000012;
  }

  button {
    margin: 5px;
    padding: 10px 15px;
    border: none;
    border-radius: 7px;
    background: #0b1f1a;
    color: white;
    cursor: pointer;
  }
`;

export default ManageWinners;