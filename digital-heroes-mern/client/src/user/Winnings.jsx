import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Winnings = () => {
    const [winnings, setWinnings] = useState([]);
    const [proof, setProof] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

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
        if (!proof[winnerId]) {
            setMessage("Please enter a proof URL.");
            return;
        }

        try {
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
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>My Winnings</h1>

            {message && <p>{message}</p>}

            {winnings.map((winner) => (
                <div className="card" key={winner._id}>
                    <h2>{winner.matchType} Matches</h2>
                    <p>Prize: ₹{winner.prizeAmount}</p>
                    <p>Verification: {winner.verificationStatus}</p>
                    <p>Payout: {winner.payoutStatus}</p>

                    {winner.verificationStatus !== "approved" && (
                        <>
                            <input
                                type="url"
                                placeholder="Proof image URL"
                                value={proof[winner._id] || ""}
                                onChange={(event) =>
                                    setProof({
                                        ...proof,
                                        [winner._id]: event.target.value,
                                    })
                                }
                            />

                            <button onClick={() => submitProof(winner._id)}>
                                Submit Proof
                            </button>
                        </>
                    )}
                </div>
            ))}

            <style>{styles}</style>
        </div>
    );
};

const styles = `
  .page {
    max-width: 1000px;
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

  input {
    display: block;
    width: 100%;
    max-width: 450px;
    box-sizing: border-box;
    padding: 12px;
    margin: 15px 0;
  }

  button {
    padding: 11px 16px;
    background: #0b1f1a;
    color: white;
    border: none;
    border-radius: 7px;
    cursor: pointer;
  }
`;

export default Winnings;