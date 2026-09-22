
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

const Profile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await api.get("/users/profile");
                const user = response.data.user;

                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                });
            } catch (err) {
                setMessage(
                    err.response?.data?.message ||
                    "Unable to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        if (!formData.name.trim()) {
            setMessage("Name cannot be empty.");
            return;
        }

        try {
            setUpdating(true);

            await api.put("/users/profile", {
                name: formData.name.trim(),
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to update profile"
            );
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {formData.name
                            ? formData.name.charAt(0).toUpperCase()
                            : "U"}
                    </div>

                    <div className="profile-heading">
                        <span>ACCOUNT SETTINGS</span>
                        <h1>My Profile 👤</h1>
                        <p>
                            Manage your personal account information.
                        </p>
                    </div>
                </div>

                {message && (
                    <div
                        className={`profile-message ${message.includes("successfully")
                                ? "success"
                                : "error"
                            }`}
                    >
                        <span>
                            {message.includes("successfully")
                                ? "✓"
                                : "ⓘ"}
                        </span>
                        {message}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="profile-form"
                >
                    <div className="form-title">
                        <h2>Personal Information</h2>
                        <p>
                            Update your name below. Your email address
                            cannot be changed.
                        </p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <div className="input-wrapper">
                            <span>👤</span>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                autoComplete="name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="input-wrapper disabled-input">
                            <span>📧</span>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                            />

                            <span className="lock-icon">
                                🔒
                            </span>
                        </div>

                        <small>
                            Email address is protected and cannot be
                            edited.
                        </small>
                    </div>

                    <button
                        type="submit"
                        className="update-button"
                        disabled={updating}
                    >
                        {updating
                            ? "Updating..."
                            : "Update Profile →"}
                    </button>
                </form>
            </div>

            <style>{styles}</style>
        </div>
    );
};

const styles = `
    .profile-page {
        width: 100%;
        min-height: 100vh;
        padding: 40px 20px;
        box-sizing: border-box;
        background: linear-gradient(135deg, #f5f8f6, #eaf3ed);
        color: #183329;
        font-family: inherit;
        overflow-x: hidden;
    }

    .profile-container {
        width: 100%;
        max-width: 720px;
        margin: 0 auto;
    }

    .profile-header {
        display: flex;
        align-items: center;
        gap: 20px;
        margin-bottom: 25px;
        padding: 30px;
        border-radius: 22px;
        background: linear-gradient(135deg, #0b1f1a, #216442);
        color: white;
        box-shadow: 0 14px 35px rgba(11, 31, 26, 0.16);
    }

    .profile-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        width: 85px;
        height: 85px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        background: #a8dfb8;
        color: #123d27;
        font-size: 36px;
        font-weight: 800;
    }

    .profile-heading {
        min-width: 0;
    }

    .profile-heading span {
        color: #a8e7bd;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 1.8px;
    }

    .profile-heading h1 {
        margin: 8px 0 0;
        color: white;
        font-size: clamp(27px, 4vw, 38px);
        line-height: 1.2;
    }

    .profile-heading p {
        margin: 10px 0 0;
        color: #d5e9dc;
        font-size: 14px;
        line-height: 1.5;
    }

    .profile-message {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 0 0 22px;
        padding: 14px 16px;
        border-radius: 11px;
        font-size: 14px;
        font-weight: 600;
        overflow-wrap: anywhere;
    }

    .profile-message.success {
        border: 1px solid #c5e6d0;
        background: #eaf8ee;
        color: #18713c;
    }

    .profile-message.error {
        border: 1px solid #f1c5c5;
        background: #fff0f0;
        color: #b42318;
    }

    .profile-form {
        width: 100%;
        padding: clamp(22px, 5vw, 38px);
        box-sizing: border-box;
        border: 1px solid #e1ebe4;
        border-radius: 22px;
        background: white;
        box-shadow: 0 10px 35px rgba(20, 55, 35, 0.08);
    }

    .form-title {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e6eee8;
    }

    .form-title h2 {
        margin: 0 0 8px;
        color: #183b29;
        font-size: 22px;
    }

    .form-title p {
        margin: 0;
        color: #7b8b80;
        font-size: 13px;
        line-height: 1.6;
    }

    .form-group {
        margin-bottom: 24px;
    }

    .form-group label {
        display: block;
        margin-bottom: 9px;
        color: #294936;
        font-size: 14px;
        font-weight: 700;
    }

    .input-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-width: 0;
        padding: 0 14px;
        box-sizing: border-box;
        border: 1px solid #dce7df;
        border-radius: 11px;
        background: #fbfdfb;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }

    .input-wrapper:focus-within {
        border-color: #328354;
        box-shadow: 0 0 0 3px rgba(50, 131, 84, 0.1);
    }

    .input-wrapper > span:first-child {
        flex-shrink: 0;
        font-size: 17px;
    }

    .input-wrapper input {
        width: 100%;
        min-width: 0;
        padding: 14px 0;
        border: none;
        outline: none;
        background: transparent;
        color: #203e2c;
        font-family: inherit;
        font-size: 14px;
    }

    .input-wrapper input::placeholder {
        color: #9aa89e;
    }

    .disabled-input {
        background: #f0f4f1;
        cursor: not-allowed;
    }

    .disabled-input input {
        color: #77877c;
        cursor: not-allowed;
    }

    .lock-icon {
        flex-shrink: 0;
        font-size: 13px !important;
    }

    .form-group small {
        display: block;
        margin-top: 8px;
        color: #8a998f;
        font-size: 12px;
        line-height: 1.5;
    }

    .update-button {
        width: 100%;
        margin-top: 8px;
        padding: 15px 20px;
        border: none;
        border-radius: 11px;
        background: linear-gradient(135deg, #0b1f1a, #246b45);
        color: white;
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .update-button:hover {
        transform: translateY(-2px);
    }

    .update-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    @media (max-width: 600px) {
        .profile-page {
            padding: 22px 14px;
        }

        .profile-header {
            align-items: flex-start;
            padding: 24px 20px;
            border-radius: 18px;
        }

        .profile-avatar {
            width: 62px;
            height: 62px;
            font-size: 27px;
        }

        .profile-heading h1 {
            font-size: 26px;
        }

        .profile-heading p {
            font-size: 12px;
        }

        .profile-form {
            border-radius: 18px;
        }

        .form-title h2 {
            font-size: 19px;
        }
    }

    @media (max-width: 400px) {
        .profile-header {
            gap: 12px;
            padding: 20px 15px;
        }

        .profile-avatar {
            width: 50px;
            height: 50px;
            font-size: 23px;
        }

        .profile-heading h1 {
            font-size: 22px;
        }

        .profile-heading span {
            font-size: 9px;
        }

        .profile-form {
            padding: 20px 16px;
        }
    }
`;

export default Profile;