import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "../styles/Charities.css"

function Charities() {
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCharities = async () => {
            try {
                const response = await api.get("/charities");

                setCharities(
                    response.data.charities ||
                    response.data.data ||
                    []
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load charities."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCharities();
    }, []);

    return (
        <div className="charities-page">
            <section className="page-header">
                <span>MAKE AN IMPACT</span>
                <h1>Our Charities</h1>
                <p>
                    Discover organizations and causes supported by our
                    community.
                </p>
            </section>

            {loading && (
                <p className="loading-message">Loading charities...</p>
            )}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && charities.length === 0 && (
                <p className="empty-message">
                    No charities are available at the moment.
                </p>
            )}

            <section className="charities-grid">
                {charities.map((charity) => (
                    <article className="charity-card" key={charity._id}>
                        {charity.coverImage || charity.logo ? (
                            <img
                                src={
                                    charity.coverImage ||
                                    charity.logo
                                }
                                alt={charity.name}
                                className="charity-image"
                            />
                        ) : (
                            <div className="charity-image-placeholder">
                                ❤️
                            </div>
                        )}

                        <div className="charity-card-content">
                            <h2>{charity.name}</h2>

                            <p>
                                {charity.shortDescription ||
                                    charity.description ||
                                    "Support this meaningful cause."}
                            </p>

                            <div className="charity-meta">
                                <span>
                                    Supporters:{" "}
                                    {charity.totalSupporters || 0}
                                </span>
                            </div>

                            <Link
                                to={`/charities/${charity._id}`}
                                className="btn btn-primary"
                            >
                                View Details
                            </Link>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    );
}

export default Charities;