import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        setMenuOpen(false);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    Digital<span>Heroes</span>
                </Link>

                <button
                    className="menu-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                <nav className={`navbar-links ${menuOpen ? "active" : ""}`}>
                    <NavLink to="/" onClick={closeMenu}>
                        Home
                    </NavLink>

                    <NavLink to="/charities" onClick={closeMenu}>
                        Charities
                    </NavLink>

                    <NavLink to="/draws" onClick={closeMenu}>
                        Draws
                    </NavLink>

                    {token && (
                        <>
                            <NavLink to="/dashboard" onClick={closeMenu}>
                                Dashboard
                            </NavLink>

                            <NavLink to="/profile" onClick={closeMenu}>
                                Profile
                            </NavLink>

                            <button
                                className="logout-button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!token && (
                        <>
                            <NavLink to="/login" onClick={closeMenu}>
                                Login
                            </NavLink>

                            <Link
                                to="/signup"
                                className="register-button"
                                onClick={closeMenu}
                            >
                                Join Now
                            </Link>
                        </>
                    )}
                </nav>
            </div>

            <style>{`
        .navbar {
          width: 100%;
          background: #0b1f1a;
          color: white;
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
        }

        .navbar-container {
          max-width: 1200px;
          margin: auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-logo {
          color: white;
          text-decoration: none;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .navbar-logo span {
          color: #f4c95d;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .navbar-links a {
          color: #d8e6df;
          text-decoration: none;
          font-size: 15px;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .navbar-links a:hover,
        .navbar-links a.active {
          color: #f4c95d;
        }

        .register-button {
          background: #f4c95d;
          color: #0b1f1a !important;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700 !important;
        }

        .logout-button {
          border: 1px solid #f4c95d;
          background: transparent;
          color: #f4c95d;
          padding: 9px 17px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }

        .logout-button:hover {
          background: #f4c95d;
          color: #0b1f1a;
        }

        .menu-button {
          display: none;
          background: transparent;
          border: none;
          color: white;
          font-size: 26px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .menu-button {
            display: block;
          }

          .navbar-links {
            display: none;
            position: absolute;
            top: 65px;
            left: 0;
            width: 100%;
            padding: 22px;
            background: #0b1f1a;
            flex-direction: column;
            align-items: stretch;
            gap: 18px;
          }

          .navbar-links.active {
            display: flex;
          }

          .navbar-links a,
          .logout-button {
            text-align: center;
            width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
        </header>
    );
};

export default Navbar;