
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hotel, User, Mail, Lock } from "lucide-react";
import API from "../services/api";

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await API.post(
                "/auth/signup",
                form
            );

            alert(response.data.message);
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration failed. Check your backend connection."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/" className="auth-logo">
                    <Hotel size={30} />
                    <span>HotelPro</span>
                </Link>

                <h1>Create Account</h1>
                <p className="auth-subtitle">
                    Join HotelPro and discover your next stay.
                </p>

                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <div className="auth-input">
                        <User size={19} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Email Address</label>
                    <div className="auth-input">
                        <Mail size={19} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label>Password</label>
                    <div className="auth-input">
                        <Lock size={19} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Minimum 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            minLength={6}
                            required
                        />
                    </div>

                    {error && (
                        <p className="auth-error">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

