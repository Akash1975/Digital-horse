
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

      setSuccess(
        response.data.message ||
        "If your email exists, reset instructions have been sent."
      );

      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-card">
        <div className="forgot-icon">
          <span>🔐</span>
        </div>

        <div className="auth-header">
          <h1>Forgot Password?</h1>
          <p>
            Don't worry! Enter your email and we'll help
            you reset your password.
          </p>
        </div>

        {error && (
          <div className="alert error-message">
            <span>⚠</span>
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="alert success-message">
            <span>✓</span>
            <p>{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>

          <div className="input-wrapper">
            <span className="input-icon">✉</span>

            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                Send Reset Request
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Remember your password?</span>
          <Link to="/login">Back to Login</Link>
        </div>
      </div>

      <style>{`
                * {
                    box-sizing: border-box;
                }

                .forgot-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    padding: 30px 20px;
                    position: relative;
                    overflow: hidden;

                    background:
                        radial-gradient(
                            circle at 20% 20%,
                            rgba(16, 185, 129, 0.18),
                            transparent 35%
                        ),
                        radial-gradient(
                            circle at 80% 80%,
                            rgba(6, 182, 212, 0.12),
                            transparent 35%
                        ),
                        #080d1a;

                    font-family: "Inter", "Segoe UI", sans-serif;
                    box-sizing: border-box;
                }

                .forgot-card {
                    width: 100%;
                    max-width: 440px;
                    padding: 42px 38px;
                    background: rgba(16, 185, 129, 0.18);
                    border: 1px solid #e1ebe5;
                    border-radius: 22px;
                    color: #fff;
                    box-shadow:
                        0 15px 45px rgba(11, 31, 26, 0.09),
                        0 3px 10px rgba(11, 31, 26, 0.03);
                    animation: fadeIn 0.5s ease;
                }

                .forgot-icon {
                    width: 68px;
                    height: 68px;
                    margin: 0 auto 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20px;
                    background: #e5f1ea;
                    border: 1px solid #cce2d5;
                }

                .forgot-icon span {
                    font-size: 29px;
                }

                .auth-header {
                    text-align: center;
                    margin-bottom: 28px;
                }

                .auth-header h1 {
                    color: #0b1f1a;
                    font-size: 27px;
                    font-weight: 750;
                    letter-spacing: -0.7px;
                    margin: 0 0 10px;
                }

                .auth-header p {
                    color: #718078;
                    font-size: 14px;
                    line-height: 1.7;
                    margin: 0;
                }

                .alert {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 13px 14px;
                    border-radius: 10px;
                    margin-bottom: 20px;
                    font-size: 13px;
                    line-height: 1.5;
                }

                .alert p {
                    margin: 0;
                    overflow-wrap: anywhere;
                }

                .error-message {
                    background: #fff0f0;
                    color: #b42318;
                    border: 1px solid #ffd4d4;
                }

                .success-message {
                    background: #e8f8ee;
                    color: #176b4d;
                    border: 1px solid #c6ead4;
                }

                form {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                label {
                    color: #253b31;
                    font-size: 13px;
                    font-weight: 700;
                    margin-top: 2px;
                }

                .input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0 13px;
                    border: 1px solid #d4ded8;
                    border-radius: 10px;
                    background: #fff;
                    transition: 0.2s ease;
                }

                .input-wrapper:focus-within {
                    border-color: #176b4d;
                    box-shadow: 0 0 0 3px rgba(23, 107, 77, 0.08);
                }

                .input-icon {
                    color: #718078;
                    font-size: 16px;
                    flex-shrink: 0;
                }

                input {
                    width: 100%;
                    min-width: 0;
                    padding: 14px 0;
                    border: none;
                    outline: none;
                    background: transparent;
                    color: #253b31;
                    font-size: 14px;
                }

                input::placeholder {
                    color: #9aa9a1;
                }

                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    width: 100%;
                    border: none;
                    background: linear-gradient(
                        135deg,
                        #0b1f1a,
                        #176b4d
                    );
                    color: white;
                    padding: 14px;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 700;
                    margin-top: 14px;
                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease,
                        opacity 0.2s ease;
                }

                button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 18px rgba(11, 31, 26, 0.18);
                }

                button:active:not(:disabled) {
                    transform: translateY(0);
                }

                button:disabled {
                    opacity: 0.65;
                    cursor: not-allowed;
                }

                .spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }

                .auth-footer {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 5px;
                    text-align: center;
                    color: #718078;
                    font-size: 13px;
                    margin: 26px 0 0;
                }

                .auth-footer a {
                    color: #176b4d;
                    font-weight: 700;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .auth-footer a:hover {
                    color: #0b1f1a;
                    text-decoration: underline;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(15px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @media (max-width: 480px) {
                    .forgot-page {
                        padding: 25px 15px;
                    }

                    .forgot-card {
                        padding: 32px 22px;
                        border-radius: 18px;
                    }

                    .forgot-icon {
                        width: 60px;
                        height: 60px;
                    }

                    .auth-header h1 {
                        font-size: 24px;
                    }

                    .auth-header p {
                        font-size: 13px;
                    }

                    .auth-footer {
                        flex-direction: column;
                        gap: 8px;
                    }
                }
            `}</style>
    </div>
  );
};

export default ForgotPassword;