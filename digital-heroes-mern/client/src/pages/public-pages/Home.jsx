import { Link } from "react-router-dom";
import "../styles/home.css";

function Home() {
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
                        Improve your golf game, support meaningful charities,
                        and participate in exciting monthly prize draws with
                        Digital Heroes.
                    </p>

                    <div className="hero-buttons">
                        <Link to="/register" className="btn btn-primary">
                            Get Started
                        </Link>

                        <Link to="/charities" className="btn btn-secondary">
                            Explore Charities
                        </Link>
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
                    </div>

                    <div className="feature-card">
                        <h3>❤️ Support Charities</h3>
                        <p>
                            Choose a charity and contribute a percentage of
                            your subscription.
                        </p>
                    </div>

                    <div className="feature-card">
                        <h3>🎯 Monthly Draws</h3>
                        <p>
                            Participate in monthly draws and get the chance
                            to win exciting prizes.
                        </p>
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
                        <p>Register and set up your Digital Heroes profile.</p>
                    </div>

                    <div className="step-card">
                        <strong>02</strong>
                        <h3>Choose Your Plan</h3>
                        <p>Select a subscription and your preferred charity.</p>
                    </div>

                    <div className="step-card">
                        <strong>03</strong>
                        <h3>Play and Participate</h3>
                        <p>Track scores and participate in eligible draws.</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <h2>Ready to Become a Digital Hero?</h2>
                <p>Join the community and make your participation count.</p>

                <Link to="/pricing" className="btn btn-primary">
                    View Pricing
                </Link>
            </section>
        </div>
    );
}

export default Home;