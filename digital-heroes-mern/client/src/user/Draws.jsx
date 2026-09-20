
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import "../pages/styles/Draws.css";

const Draws = () => {
    const [draws, setDraws] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const loadDraws = async () => {
        try {
            const response = await api.get("/draws");
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

    const enterDraw = async (drawId) => {
        try {
            await api.post(`/draws/${drawId}/enter`);
            setMessage("You have entered the draw successfully.");
        } catch (err) {
            setMessage(
                err.response?.data?.message || "Unable to enter draw"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="draws-page">
            <h1>Monthly Draws</h1>

            {message && (
                <p className="draws-message">{message}</p>
            )}

            <div className="draws-grid">
                {draws.map((draw) => (
                    <div className="draw-card" key={draw._id}>
                        <h2>{draw.title}</h2>

                        <p>Month: {draw.month}</p>
                        <p>Status: {draw.status}</p>

                        {draw.drawDate && (
                            <p>
                                Date:{" "}
                                {new Date(
                                    draw.drawDate
                                ).toLocaleDateString()}
                            </p>
                        )}

                        <button
                            onClick={() => enterDraw(draw._id)}
                        >
                            Enter Draw
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Draws;