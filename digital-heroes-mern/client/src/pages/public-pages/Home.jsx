
import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/home.css";

function Home() {
    const [isLoggedIn] = useState(
        Boolean(localStorage.getItem("token"))
    );

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <span className="hero-badge">
                        PLAY GOLF. MAKE AN IMPACT.
                    </span>

                    <h1>
                        Your Golf Performance
                        <span> Can Change Lives.</span>
                    </h1>

                    <p>
                        Improve your golf game, support meaningful
                        charities, and participate in exciting
                        monthly prize draws with Digital Heroes.
                    </p>

                    <div className="hero-buttons">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="btn btn-primary"
                                >
                                    Go to Dashboard
                                </Link>

                                <Link
                                    to="/scores"
                                    className="btn btn-secondary"
                                >
                                    Track Your Scores
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/signup"
                                    className="btn btn-primary"
                                >
                                    Get Started
                                </Link>

                                <Link
                                    to="/charities"
                                    className="btn btn-secondary"
                                >
                                    Explore Charities
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="section-heading">
                    <span>WHY DIGITAL HEROES?</span>
                    <h2>More Than Just Golf</h2>
                    <p>
                        Your participation supports both your personal
                        performance and charitable causes.
                    </p>
                </div>

                <div className="features-grid">
                    <div className="feature-card">
                        <h3>⛳ Track Your Progress</h3>
                        <p>
                            Record your golf scores and monitor your
                            performance over time.
                        </p>

                        {isLoggedIn && (
                            <Link to="/scores" className="feature-link">
                                Track Scores →
                            </Link>
                        )}
                    </div>

                    <div className="feature-card">
                        <h3>❤️ Support Charities</h3>
                        <p>
                            Choose a charity and contribute a percentage
                            of your subscription.
                        </p>

                        <Link to="/charities" className="feature-link">
                            Explore Charities →
                        </Link>
                    </div>

                    <div className="feature-card">
                        <h3>🎯 Monthly Draws</h3>
                        <p>
                            Participate in monthly draws and check
                            eligible prize opportunities.
                        </p>

                        <Link to="/draws" className="feature-link">
                            View Draws →
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="section-heading">
                    <span>HOW IT WORKS</span>
                    <h2>Start Your Journey</h2>
                </div>

                <div className="steps-grid">
                    <div className="step-card">
                        <strong>01</strong>
                        <h3>Create Your Account</h3>
                        <p>
                            Register and set up your Digital Heroes profile.
                        </p>
                    </div>

                    <div className="step-card">
                        <strong>02</strong>
                        <h3>Choose Your Plan</h3>
                        <p>
                            Select a subscription and your preferred charity.
                        </p>
                    </div>

                    <div className="step-card">
                        <strong>03</strong>
                        <h3>Play and Participate</h3>
                        <p>
                            Track scores and participate in eligible draws.
                        </p>
                    </div>
                </div>
            </section>

            {/* Winners Section */}
            <section className="winners-section">
                <div className="section-heading">
                    <span>CELEBRATING SUCCESS</span>
                    <h2>Meet Our Winners 🏆</h2>
                    <p>
                        Discover winners from our previous monthly draws.
                    </p>
                </div>

                <div className="winners-content">
                    <div className="winner-placeholder">
                        <span className="winner-icon">🏆</span>
                        <h3>Monthly Draw Winners</h3>
                        <p>
                            Explore the winners and their achievements.
                        </p>

                        <Link
                            to="/winnings"
                            className="btn btn-primary"
                        >
                            View Winners
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>
                    {isLoggedIn
                        ? "Keep Making an Impact!"
                        : "Ready to Become a Digital Hero?"}
                </h2>

                <p>
                    {isLoggedIn
                        ? "Continue your journey with Digital Heroes."
                        : "Join the community and make your participation count."}
                </p>

                <Link
                    to={isLoggedIn ? "/draws" : "/pricing"}
                    className="btn btn-primary"
                >
                    {isLoggedIn ? "Explore Monthly Draws" : "View Pricing"}
                </Link>
            </section>
        </div>
    );
}

export default Home;