import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Hotel, Mail, Lock } from "lucide-react";
import API from "../services/api";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
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
                "/auth/login",
                form
            );

            localStorage.setItem(
                "hotelpro_token",
                response.data.token
            );

            localStorage.setItem(
                "hotelpro_user",
                JSON.stringify(response.data.user)
            );

            alert("Welcome to HotelPro!");
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Login failed. Check your backend connection."
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

                <h1>Welcome Back!</h1>
                <p className="auth-subtitle">
                    Login to continue your journey.
                </p>

                <form onSubmit={handleSubmit}>
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
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="current-password"
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
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

