import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const ManageCharities = () => {
    const [charities, setCharities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadCharities = async () => {
        try {
            const response = await api.get("/charities");
            setCharities(response.data.charities || []);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load charities"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCharities();
    }, []);

    const deactivateCharity = async (id) => {
        try {
            await api.patch(`/admin/charities/${id}/deactivate`);
            setMessage("Charity deactivated.");
            await loadCharities();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to deactivate charity"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>Manage Charities</h1>

            {message && <p>{message}</p>}

            {charities.map((charity) => (
                <div className="card" key={charity._id}>
                    <h2>{charity.name}</h2>
                    <p>{charity.description}</p>
                    <p>
                        Status: {charity.isActive ? "Active" : "Inactive"}
                    </p>

                    {charity.isActive && (
                        <button
                            onClick={() => deactivateCharity(charity._id)}
                        >
                            Deactivate
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
    padding: 10px 15px;
    background: #0b1f1a;
    color: white;
    border: none;
    border-radius: 7px;
    cursor: pointer;
  }
`;

export default ManageCharities;