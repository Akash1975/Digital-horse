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
            const response = await api.get("/scores/my-scores");
            setScores(response.data.scores || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Unable to load scores"
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
                err.response?.data?.message || "Unable to add score"
            );
        } finally {
            setSubmitting(false);
        }
    };

    const deleteScore = async (id) => {
        if (!window.confirm("Delete this score?")) return;

        try {
            await api.delete(`/scores/${id}`);
            await loadScores();
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Unable to delete score"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>My Golf Scores</h1>

            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit} className="form">
                <input
                    type="number"
                    min="1"
                    max="45"
                    placeholder="Enter score"
                    value={score}
                    onChange={(event) => setScore(event.target.value)}
                    required
                />

                <input
                    type="date"
                    value={scoreDate}
                    onChange={(event) => setScoreDate(event.target.value)}
                />

                <button disabled={submitting}>
                    {submitting ? "Saving..." : "Add Score"}
                </button>
            </form>

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Score</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {scores.map((item) => (
                            <tr key={item._id}>
                                <td>{item.score}</td>
                                <td>
                                    {item.scoreDate
                                        ? new Date(item.scoreDate).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td>
                                    <button onClick={() => deleteScore(item._id)}>
                                        Delete
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

  .form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 25px 0;
  }

  input, button {
    padding: 11px;
    border-radius: 7px;
    border: 1px solid #d4ded8;
  }

  button {
    cursor: pointer;
    background: #0b1f1a;
    color: white;
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
    border-bottom: 1px solid #e4ebe6;
    text-align: left;
  }
`;

export default Scores;