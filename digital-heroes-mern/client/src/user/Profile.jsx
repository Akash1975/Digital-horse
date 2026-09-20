
import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import "../pages/styles/Profile.css";

const Profile = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

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

        try {
            await api.put("/users/profile", {
                name: formData.name,
            });

            setMessage("Profile updated successfully.");
        } catch (err) {
            setMessage(
                err.response?.data?.message ||
                "Unable to update profile"
            );
        }
    };

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

            {message && (
                <p className="profile-message">
                    {message}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="profile-form"
            >
                <label htmlFor="name">Name</label>

                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                />

                <label htmlFor="email">Email</label>

                <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                />

                <button type="submit">
                    Update Profile
                </button>
            </form>
        </div>
    );
};

export default Profile;