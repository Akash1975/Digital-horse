import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Charity = () => {
    const [charities, setCharities] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadCharities = async () => {
            try {
                const [charityResponse, contributionResponse] =
                    await Promise.all([
                        api.get("/charities"),
                        api.get("/charities/user/my-contributions"),
                    ]);

                setCharities(charityResponse.data.charities || []);
                setContributions(
                    contributionResponse.data.contributions || []
                );
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "Unable to load charity information"
                );
            } finally {
                setLoading(false);
            }
        };

        loadCharities();
    }, []);

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Charities</h1>

            {message && <p>{message}</p>}

            <div className="grid">
                {charities.map((charity) => (
                    <div className="card" key={charity._id}>
                        {charity.logo && (
                            <img src={charity.logo} alt={charity.name} />
                        )}

                        <h2>{charity.name}</h2>
                        <p>
                            {charity.shortDescription ||
                                charity.description ||
                                "Support this charity."}
                        </p>

                        {charity.website && (
                            <a
                                href={charity.website}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Visit Website
                            </a>
                        )}
                    </div>
                ))}
            </div>

            <h2>My Contributions</h2>

            {contributions.map((item) => (
                <div className="contribution" key={item._id}>
                    <strong>
                        {item.charity?.name || "Charity"}
                    </strong>
                    <span>₹{item.amount}</span>
                    <span>{item.status}</span>
                </div>
            ))}

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

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
  }

  .card {
    padding: 20px;
    background: white;
    border-radius: 14px;
    box-shadow: 0 5px 20px #00000012;
  }

  .card img {
    width: 100%;
    max-height: 180px;
    object-fit: cover;
    border-radius: 8px;
  }

  .card a {
    color: #176b4d;
  }

  .contribution {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    padding: 15px;
    border-bottom: 1px solid #ddd;
  }
`;

export default Charity;