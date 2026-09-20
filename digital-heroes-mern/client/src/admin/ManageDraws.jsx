import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageDraws = () => {
    const [draws, setDraws] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadDraws = async () => {
        try {
            const response = await api.get("/admin/draws");
            setDraws(response.data.draws || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Unable to load draws"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDraws();
    }, []);

    const simulateDraw = async (id) => {
        try {
            await api.post(`/draws/${id}/simulate`);
            setMessage("Draw simulated successfully.");
            await loadDraws();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to simulate draw"
            );
        }
    };

    const publishDraw = async (id) => {
        try {
            await api.patch(`/draws/${id}/publish`);
            setMessage("Draw published successfully.");
            await loadDraws();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to publish draw"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Draws</h1>

            {message && <p>{message}</p>}

            {draws.map((draw) => (
                <div className="card" key={draw._id}>
                    <h2>{draw.title}</h2>
                    <p>Month: {draw.month}</p>
                    <p>Status: {draw.status}</p>

                    <button onClick={() => simulateDraw(draw._id)}>
                        Simulate
                    </button>

                    <button onClick={() => publishDraw(draw._id)}>
                        Publish
                    </button>
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

export default ManageDraws;