import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";

function CharityDetails() {
    const { id } = useParams();

    const [charity, setCharity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCharity = async () => {
            try {
                const response = await api.get(`/charities/${id}`);

                setCharity(
                    response.data.charity ||
                    response.data.data ||
                    null
                );
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load charity details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCharity();
    }, [id]);

    if (loading) {
        return (
            <div className="page-state">
                <p>Loading charity details...</p>
            </div>
        );
    }

    if (error || !charity) {
        return (
            <div className="page-state">
                <h2>{error || "Charity not found."}</h2>

                <Link to="/charities" className="btn btn-primary">
                    Back to Charities
                </Link>
            </div>
        );
    }

    return (
        <div className="charity-details-page">
            {/* Charity Header */}
            <section className="charity-details-header">
                {charity.coverImage && (
                    <img
                        src={charity.coverImage}
                        alt={charity.name}
                        className="charity-cover-image"
                    />
                )}

                <div className="charity-details-heading">
                    <span>SUPPORTED ORGANIZATION</span>
                    <h1>{charity.name}</h1>

                    <p>
                        {charity.shortDescription ||
                            charity.description}
                    </p>
                </div>
            </section>

            {/* Charity Content */}
            <section className="charity-details-content">
                <div className="charity-description">
                    <h2>About This Charity</h2>

                    <p>
                        {charity.description ||
                            "More information about this charity will be available soon."}
                    </p>

                    {charity.website && (
                        <a
                            href={charity.website}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-secondary"
                        >
                            Visit Website
                        </a>
                    )}
                </div>

                <aside className="charity-statistics">
                    <div className="stat-card">
                        <h3>{charity.totalSupporters || 0}</h3>
                        <p>Total Supporters</p>
                    </div>

                    <div className="stat-card">
                        <h3>
                            ₹
                            {Number(
                                charity.totalContributions || 0
                            ).toLocaleString("en-IN")}
                        </h3>
                        <p>Total Contributions</p>
                    </div>

                    {charity.location && (
                        <div className="stat-card">
                            <h3>📍 Location</h3>
                            <p>{charity.location}</p>
                        </div>
                    )}
                </aside>
            </section>

            {/* Events */}
            {charity.events?.length > 0 && (
                <section className="charity-events-section">
                    <h2>Charity Events</h2>

                    <div className="events-grid">
                        {charity.events.map((event, index) => (
                            <article
                                className="event-card"
                                key={event._id || index}
                            >
                                {event.image && (
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                    />
                                )}

                                <h3>{event.title}</h3>

                                <p>{event.description}</p>

                                {event.eventDate && (
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {new Date(
                                            event.eventDate
                                        ).toLocaleDateString("en-IN")}
                                    </p>
                                )}

                                {event.location && (
                                    <p>
                                        <strong>Location:</strong>{" "}
                                        {event.location}
                                    </p>
                                )}
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <div className="back-link">
                <Link to="/charities">← Back to Charities</Link>
            </div>
        </div>
    );
}

export default CharityDetails;