import { Link } from "react-router-dom";
import "../styles/pricing.css";

function Pricing() {
    const plans = [
        {
            name: "Monthly",
            price: "₹499",
            period: "/month",
            description: "Flexible monthly membership.",
            features: [
                "Golf score tracking",
                "Charity participation",
                "Monthly draw eligibility",
                "Member dashboard",
            ],
        },
        {
            name: "Yearly",
            price: "₹4,999",
            period: "/year",
            description: "Annual membership for committed players.",
            features: [
                "All monthly plan benefits",
                "Annual subscription convenience",
                "Charity participation",
                "Monthly draw eligibility",
            ],
            highlighted: true,
        },
    ];

    return (
        <div className="pricing-page">
            <section className="page-header">
                <span>MEMBERSHIP</span>
                <h1>Choose Your Plan</h1>
                <p>
                    Select a plan and become part of the Digital Heroes
                    community.
                </p>
            </section>

            <section className="pricing-grid">
                {plans.map((plan) => (
                    <div
                        className={`pricing-card ${plan.highlighted ? "featured-plan" : ""
                            }`}
                        key={plan.name}
                    >
                        {plan.highlighted && (
                            <span className="popular-badge">
                                RECOMMENDED
                            </span>
                        )}

                        <h2>{plan.name}</h2>

                        <div className="price">
                            {plan.price}
                            <small>{plan.period}</small>
                        </div>

                        <p>{plan.description}</p>

                        <ul>
                            {plan.features.map((feature) => (
                                <li key={feature}>✓ {feature}</li>
                            ))}
                        </ul>

                        <Link
                            to="/register"
                            className="btn btn-primary"
                        >
                            Choose Plan
                        </Link>
                    </div>
                ))}
            </section>

            <section className="pricing-note">
                <h3>Charity Contribution</h3>
                <p>
                    Your selected charity contribution percentage can be
                    configured during subscription setup.
                </p>
            </section>
        </div>
    );
}

export default Pricing;