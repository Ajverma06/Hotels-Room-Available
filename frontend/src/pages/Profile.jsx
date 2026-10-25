
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    UserRound,
    Mail,
    ShieldCheck,
    CalendarDays,
    ArrowLeft,
    LogOut
} from "lucide-react";
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();

    const [user] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("hotelpro_user")
            );
        } catch {
            return null;
        }
    });

    function handleLogout() {
        localStorage.removeItem("hotelpro_token");
        localStorage.removeItem("hotelpro_user");

        alert("Logged out successfully!");
        navigate("/login");
    }

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-card profile-login-message">
                    <UserRound size={48} />

                    <h2>Please Login</h2>

                    <p>
                        Login to view your profile details.
                    </p>

                    <Link to="/login" className="profile-primary-btn">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    const name =
        user.name ||
        user.username ||
        user.fullName ||
        "HotelPro User";

    const email = user.email || "Email not available";
    const role = user.role || "user";

    return (
        <main className="profile-page">
            <div className="profile-container">
                <Link to="/" className="profile-back-link">
                    <ArrowLeft size={18} />
                    Back to Home
                </Link>

                <div className="profile-banner">
                    <div className="profile-avatar">
                        {name.charAt(0).toUpperCase()}
                    </div>

                    <h1>{name}</h1>
                    <p>{email}</p>

                    <span className="profile-role-badge">
                        <ShieldCheck size={16} />
                        {role}
                    </span>
                </div>

                <section className="profile-details-card">
                    <h2>Personal Information</h2>
                    <p className="profile-description">
                        Your HotelPro account details.
                    </p>

                    <div className="profile-info-row">
                        <div className="profile-info-icon">
                            <UserRound size={21} />
                        </div>

                        <div>
                            <span>Full Name</span>
                            <strong>{name}</strong>
                        </div>
                    </div>

                    <div className="profile-info-row">
                        <div className="profile-info-icon">
                            <Mail size={21} />
                        </div>

                        <div>
                            <span>Email Address</span>
                            <strong>{email}</strong>
                        </div>
                    </div>

                    <div className="profile-info-row">
                        <div className="profile-info-icon">
                            <ShieldCheck size={21} />
                        </div>

                        <div>
                            <span>Account Role</span>
                            <strong>{role}</strong>
                        </div>
                    </div>

                    {user.createdAt && (
                        <div className="profile-info-row">
                            <div className="profile-info-icon">
                                <CalendarDays size={21} />
                            </div>

                            <div>
                                <span>Account Created</span>
                                <strong>
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </strong>
                            </div>
                        </div>
                    )}

                    <div className="profile-actions">
                        <Link
                            to="/my-bookings"
                            className="profile-primary-btn"
                        >
                            My Bookings
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="profile-logout-btn"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

