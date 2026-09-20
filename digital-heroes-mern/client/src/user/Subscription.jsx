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
        if (!priceId) {
            setMessage("Payment configuration is missing.")

            setTimeout(() => {
                setMessage("")
            }, 2000);
            return;
        }

        try {
            const response = await api.post(
                "/subscriptions/checkout",
                { priceId }
            );

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
        <div className="subscription-page">
            <div className="subscription-header">
                <span className="header-tag">MEMBERSHIP</span>
                <h1>My Subscription</h1>
                <p>
                    Manage your membership and enjoy all Digital Heroes
                    benefits.
                </p>
            </div>

            {message && (
                <div className="subscription-message">
                    {message}
                </div>
            )}

            {subscription ? (
                <div className="subscription-card active-card">
                    <div className="card-top">
                        <div>
                            <span className="card-label">
                                CURRENT PLAN
                            </span>

                            <h2>{subscription.plan}</h2>
                        </div>

                        <span
                            className={`status-badge ${subscription.status?.toLowerCase()
                                }`}
                        >
                            {subscription.status}
                        </span>
                    </div>

                    <div className="subscription-details">
                        <div className="detail-item">
                            <span>Amount</span>
                            <strong>
                                ₹{subscription.amount}
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Charity Contribution</span>
                            <strong>
                                {subscription.charityPercentage}%
                            </strong>
                        </div>

                        <div className="detail-item">
                            <span>Membership</span>
                            <strong>Active</strong>
                        </div>
                    </div>

                    <div className="card-divider"></div>

                    {subscription.cancelAtPeriodEnd ? (
                        <div className="action-section">
                            <p className="warning-text">
                                Your subscription will be cancelled at
                                the end of the current billing period.
                            </p>

                            <button
                                className="subscription-btn resume-btn"
                                onClick={resumeSubscription}
                            >
                                Resume Subscription
                            </button>
                        </div>
                    ) : (
                        <div className="action-section">
                            <p className="helper-text">
                                You can cancel your subscription at any
                                time.
                            </p>

                            <button
                                className="subscription-btn cancel-btn"
                                onClick={cancelSubscription}
                            >
                                Cancel Subscription
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="choose-section">
                    <div className="empty-icon">💳</div>

                    <h2>Choose a Subscription</h2>

                    <p>
                        Select a plan to unlock your Digital Heroes
                        membership benefits.
                    </p>

                    <div className="plan-buttons">
                        <button
                            className="subscription-btn monthly-btn"
                            onClick={() =>
                                createCheckout(
                                    import.meta.env
                                        .VITE_STRIPE_MONTHLY_PRICE_ID
                                )
                            }
                        >
                            <span>
                                Monthly Plan
                                <small>₹499 / month</small>
                            </span>

                            <span>→</span>
                        </button>

                        <button
                            className="subscription-btn yearly-btn"
                            onClick={() =>
                                createCheckout(
                                    import.meta.env
                                        .VITE_STRIPE_YEARLY_PRICE_ID
                                )
                            }
                        >
                            <span>
                                Yearly Plan
                                <small>₹4,999 / year</small>
                            </span>

                            <span>→</span>
                        </button>
                    </div>
                </div>
            )}
            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .subscription-page {
        min-height: 100vh;
        padding: 45px 25px;
        background: linear-gradient(
            135deg,
            #f4f8f6,
            #e8f1ed
        );
        color: #142b24;
        font-family: Arial, sans-serif;
    }

    .subscription-header {
        max-width: 850px;
        margin: 0 auto 35px;
        text-align: center;
    }

    .header-tag {
        display: inline-block;
        margin-bottom: 12px;
        padding: 7px 14px;
        border-radius: 30px;
        background: #d7ebe1;
        color: #176345;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 1.5px;
    }

    .subscription-header h1 {
        margin: 0;
        font-size: 38px;
        font-weight: 800;
    }

    .subscription-header p {
        margin-top: 12px;
        color: #687b73;
        font-size: 16px;
    }

    .subscription-message {
        max-width: 700px;
        margin: 0 auto 25px;
        padding: 14px 18px;
        border-radius: 10px;
        background: #fff4d6;
        border: 1px solid #f1d58a;
        color: #765710;
        text-align: center;
        font-size: 14px;
    }

    .subscription-card,
    .choose-section {
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        padding: 32px;
        border: 1px solid #e1ebe5;
        border-radius: 20px;
        background: #ffffff;
        box-shadow: 0 12px 35px #173b2a12;
        box-sizing: border-box;
    }

    .card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
    }

    .card-label {
        color: #8a9b93;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 1.5px;
    }

    .card-top h2 {
        margin: 8px 0 0;
        font-size: 30px;
        color: #0b1f1a;
    }

    .status-badge {
        padding: 8px 13px;
        border-radius: 30px;
        background: #dff5e7;
        color: #18733f;
        font-size: 12px;
        font-weight: 700;
        text-transform: capitalize;
    }

    .status-badge.cancelled,
    .status-badge.inactive {
        background: #ffe1e1;
        color: #b42323;
    }

    .subscription-details {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-top: 30px;
    }

    .detail-item {
        padding: 17px 12px;
        border-radius: 12px;
        background: #f4f8f5;
        text-align: center;
    }

    .detail-item span {
        display: block;
        margin-bottom: 8px;
        color: #71847a;
        font-size: 12px;
    }

    .detail-item strong {
        color: #173c2d;
        font-size: 17px;
    }

    .card-divider {
        height: 1px;
        margin: 30px 0 22px;
        background: #e5eee8;
    }

    .action-section {
        text-align: center;
    }

    .helper-text,
    .warning-text {
        margin-bottom: 18px;
        color: #75847d;
        font-size: 14px;
    }

    .warning-text {
        color: #a66a16;
    }

    .subscription-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        width: 100%;
        padding: 15px 20px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        transition: 0.25s ease;
    }

    .subscription-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 7px 18px #00000018;
    }

    .resume-btn {
        justify-content: center;
        background: #176b45;
        color: white;
    }

    .cancel-btn {
        justify-content: center;
        background: #fff0f0;
        border: 1px solid #f3caca;
        color: #c12e2e;
    }

    .choose-section {
        text-align: center;
    }

    .empty-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 65px;
        height: 65px;
        margin: 0 auto 18px;
        border-radius: 50%;
        background: #e4f1e9;
        font-size: 28px;
    }

    .choose-section h2 {
        margin: 0;
        font-size: 26px;
        color: #0b1f1a;
    }

    .choose-section > p {
        max-width: 430px;
        margin: 12px auto 25px;
        color: #75847d;
        line-height: 1.6;
        font-size: 14px;
    }

    .plan-buttons {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    .monthly-btn {
        background: #0b1f1a;
        color: white;
    }

    .yearly-btn {
        background: #176b45;
        color: white;
    }

    .subscription-btn small {
        display: block;
        margin-top: 5px;
        color: #d2e5db;
        font-size: 12px;
        font-weight: 400;
    }

    @media (max-width: 600px) {
        .subscription-page {
            padding: 30px 15px;
        }

        .subscription-header h1 {
            font-size: 29px;
        }

        .subscription-card,
        .choose-section {
            padding: 22px;
        }

        .card-top {
            align-items: flex-start;
            flex-direction: column;
        }

        .subscription-details {
            grid-template-columns: 1fr;
        }

        .detail-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: left;
        }

        .detail-item span {
            margin: 0;
        }
    }
`;

export default Subscription;