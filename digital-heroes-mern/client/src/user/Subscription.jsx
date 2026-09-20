import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Subscription = () => {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const loadSubscription = async () => {
        try {
            const response = await api.get(
                "/subscriptions/my-subscription"
            );

            setSubscription(response.data.subscription || null);
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to load subscription"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSubscription();
    }, []);

    const createCheckout = async (priceId) => {
        try {
            const response = await api.post("/subscriptions/checkout", {
                priceId,
            });

            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to create checkout session"
            );
        }
    };

    const cancelSubscription = async () => {
        try {
            await api.patch("/subscriptions/cancel");
            setMessage("Subscription cancellation scheduled.");
            await loadSubscription();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to cancel subscription"
            );
        }
    };

    const resumeSubscription = async () => {
        try {
            await api.patch("/subscriptions/resume");
            setMessage("Subscription resumed.");
            await loadSubscription();
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to resume subscription"
            );
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="page">
            <h1>My Subscription</h1>

            {message && <p>{message}</p>}

            {subscription ? (
                <div className="card">
                    <h2>{subscription.plan}</h2>
                    <p>Status: {subscription.status}</p>
                    <p>Amount: ₹{subscription.amount}</p>
                    <p>
                        Charity Percentage: {subscription.charityPercentage}%
                    </p>

                    {subscription.cancelAtPeriodEnd ? (
                        <button onClick={resumeSubscription}>
                            Resume Subscription
                        </button>
                    ) : (
                        <button onClick={cancelSubscription}>
                            Cancel Subscription
                        </button>
                    )}
                </div>
            ) : (
                <div className="card">
                    <h2>Choose a Subscription</h2>

                    <button
                        onClick={() =>
                            createCheckout(import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID)
                        }
                    >
                        Monthly Plan
                    </button>

                    <button
                        onClick={() =>
                            createCheckout(import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID)
                        }
                    >
                        Yearly Plan
                    </button>
                </div>
            )}

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
    padding: 25px;
    border-radius: 14px;
    box-shadow: 0 5px 20px #00000012;
  }

  button {
    margin: 8px;
    padding: 12px 18px;
    background: #0b1f1a;
    color: white;
    border: 0;
    border-radius: 7px;
    cursor: pointer;
  }
`;

export default Subscription;