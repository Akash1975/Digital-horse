import { Link } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <Link to="/" className="footer-logo">
                        Digital<span>Heroes</span>
                    </Link>

                    <p>
                        Improve your golf performance, support meaningful
                        charities, and become part of the Digital Heroes
                        community.
                    </p>
                </div>

                <div className="footer-section">
                    <h3>Quick Links</h3>

                    <Link to="/">Home</Link>
                    <Link to="/charities">Charities</Link>
                    <Link to="/draws">Draws</Link>
                    <Link to="/about">About Us</Link>
                </div>

                <div className="footer-section">
                    <h3>Account</h3>

                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © {currentYear} Digital Heroes. All rights reserved.
                </p>
            </div>

            <style>{`
        .footer {
          background: #0b1f1a;
          color: #d8e6df;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: auto;
          padding: 50px 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-logo {
          color: white;
          text-decoration: none;
          font-size: 26px;
          font-weight: 800;
        }

        .footer-logo span {
          color: #f4c95d;
        }

        .footer-section p {
          max-width: 350px;
          line-height: 1.7;
          color: #aebfb6;
        }

        .footer-section h3 {
          color: #f4c95d;
          margin: 0 0 8px;
        }

        .footer-section a {
          color: #d8e6df;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-section a:hover {
          color: #f4c95d;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          text-align: center;
          padding: 20px 24px;
          color: #aebfb6;
          font-size: 14px;
        }

        .footer-bottom p {
          margin: 0;
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
            gap: 30px;
          }
        }
      `}</style>
        </footer>
    );
};

export default Footer;